'use client'
import { useContext, useEffect, useState } from "react";
import CaseStudyBlocksCanvas from "../../../../components/caseStudy/CaseStudyBlocksCanvas";
import Toast from "../../../../components/toast/Toast";
import { AuthContext } from "../../../../contexts/AuthContextValue";
import { deleteCloudinaryAsset } from "../../../../helpers/cloudinaryUpload";
import { getUserCaseStudyById, publishCaseStudy, saveCaseStudyDraft } from "../../../../helpers/caseStudyApi";
import { resolveMediaUrl } from "../../../../helpers/mediaUrl";
import type { BlockType, CaseStudyBlock, CaseStudyPayload } from "../../../../interface/caseStudy";
import Button from "../../../../components/button/Button";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";

interface InsertOptionButtonProps {
  label: string;
  onClick: () => void;
}

function InsertOptionButton({ label, onClick }: InsertOptionButtonProps) {
  return (
    <button
      className="flex flex-col gap-2 items-center justify-center px-3 py-2 font-medium rounded-lg border border-gray/[0.15] text-[12px]"
      onClick={onClick}
    >
      <Image src="/picture-placeholder.png" alt="picture" width={40} height={40} />
      {label}
    </button>
  );
}

export default function NewCaseStudy() {
  const { id } = useParams();
  const routeCaseStudyId = Array.isArray(id) ? id[0] : id;
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("Title");
  const [blocks, setBlocks] = useState<CaseStudyBlock[]>([
    { id: 1, type: "text", content: "Write your case study story here..." },
  ]);
  const [selectedBlockId, setSelectedBlockId] = useState<number | null>(blocks[0]?.id ?? null);
  const [caseStudyId, setCaseStudyId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isLoadingExisting, setIsLoadingExisting] = useState(false);
  const [popup, setPopup] = useState<{ type: "success" | "error"; msg: string; timestamp: number } | null>(null);

  useEffect(() => {
    const loadExisting = async () => {
      if (!routeCaseStudyId || !user?.uid) {
        return;
      }

      setIsLoadingExisting(true);
      try {
        const study = await getUserCaseStudyById(user.uid, routeCaseStudyId);
        setTitle(study.title || "Title");
        setBlocks(Array.isArray(study.blocks) && study.blocks.length ? study.blocks : [{ id: 1, type: "text", content: "" }]);
        setSelectedBlockId(study.blocks?.[0]?.id ?? null);
        setCaseStudyId(study.id);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load case study for editing.";
        setPopup({ type: "error", msg: message, timestamp: Date.now() });
      } finally {
        setIsLoadingExisting(false);
      }
    };

    loadExisting();
  }, [routeCaseStudyId, user?.uid]);

  const addBlock = (type: BlockType) => {
    const next: CaseStudyBlock = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      type,
      content:
        type === "text"
          ? "Add your description..."
          : type === "embed"
            ? "<div style='padding: 20px; font-family: sans-serif;'>Paste your embed HTML here</div>"
            : "",
    };

    setBlocks((prev) => [...prev, next]);
    setSelectedBlockId(next.id);
  };

  const updateBlock = (id: number, content: string) => {
    setBlocks((prev) => prev.map((block) => (block.id === id ? { ...block, content } : block)));
  };

  const updateMediaBlock = (id: number, content: string) => {
    const media = resolveMediaUrl(content);
    updateBlock(id, media.isValid ? media.normalizedUrl : content);
  };

  const updateImageStyle = (id: number, patch: Partial<CaseStudyBlock["imageStyle"]>) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === id
          ? {
              ...block,
              imageStyle: {
                ...(block.imageStyle || {}),
                ...patch,
              },
            }
          : block,
      ),
    );
  };

  const updateEmbedStyle = (id: number, patch: Partial<CaseStudyBlock["embedStyle"]>) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === id
          ? {
              ...block,
              embedStyle: {
                ...(block.embedStyle || {}),
                ...patch,
              },
            }
          : block,
      ),
    );
  };

  const moveBlock = (id: number, direction: "up" | "down") => {
    setBlocks((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      if (index < 0) {
        return prev;
      }

      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) {
        return prev;
      }

      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
  };

  const cleanupBlockAsset = async (block: CaseStudyBlock) => {
    try {
      if (block.type === "image" && block.imageStyle?.cloudinaryPublicId) {
        await deleteCloudinaryAsset("image", block.imageStyle.cloudinaryPublicId);
      }

      if (block.type === "media" && block.mediaStyle?.cloudinaryPublicId) {
        await deleteCloudinaryAsset("video", block.mediaStyle.cloudinaryPublicId);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete Cloudinary asset";
      setPopup({ type: "error", msg: message, timestamp: Date.now() });
    }
  };

  const deleteBlock = async (id: number) => {
    const blockToDelete = blocks.find((block) => block.id === id);
    if (blockToDelete) {
      await cleanupBlockAsset(blockToDelete);
    }

    setBlocks((prev) => {
      const next = prev.filter((block) => block.id !== id);
      if (selectedBlockId === id) {
        setSelectedBlockId(next[0]?.id ?? null);
      }
      return next;
    });
  };

  const handleImageUpload = async (id: number, result: { url: string; publicId: string }) => {
    const current = blocks.find((block) => block.id === id);
    if (current?.imageStyle?.cloudinaryPublicId) {
      await cleanupBlockAsset(current);
    }

    setBlocks((prev) =>
      prev.map((block) =>
        block.id === id
          ? {
              ...block,
              content: result.url,
              imageStyle: {
                ...(block.imageStyle || {}),
                cloudinaryPublicId: result.publicId,
              },
            }
          : block,
      ),
    );
  };

  const handleVideoUpload = async (id: number, result: { url: string; publicId: string }) => {
    const current = blocks.find((block) => block.id === id);
    if (current?.mediaStyle?.cloudinaryPublicId) {
      await cleanupBlockAsset(current);
    }

    setBlocks((prev) =>
      prev.map((block) =>
        block.id === id
          ? {
              ...block,
              content: result.url,
              mediaStyle: {
                ...(block.mediaStyle || {}),
                cloudinaryPublicId: result.publicId,
              },
            }
          : block,
      ),
    );
  };

  const buildPayload = (): CaseStudyPayload => ({
    title,
    blocks,
  });

  const requireUserId = () => {
    if (!user?.uid) {
      setPopup({ type: "error", msg: "You need to be logged in to save or publish.", timestamp: Date.now() });
      return null;
    }
    return user.uid;
  };

  const handleSaveDraft = async () => {
    const userId = requireUserId();
    if (!userId) {
      return;
    }

    setIsSaving(true);
    try {
      const id = await saveCaseStudyDraft(userId, buildPayload(), caseStudyId ?? undefined);
      setCaseStudyId(id);
      setPopup({ type: "success", msg: "Draft saved successfully.", timestamp: Date.now() });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save draft.";
      setPopup({ type: "error", msg: message, timestamp: Date.now() });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    const userId = requireUserId();
    if (!userId) {
      return;
    }

    setIsPublishing(true);
    try {
      const id = await publishCaseStudy(userId, buildPayload(), caseStudyId ?? undefined);
      setCaseStudyId(id);
      setPopup({ type: "success", msg: "Case study published successfully.", timestamp: Date.now() });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to publish case study.";
      setPopup({ type: "error", msg: message, timestamp: Date.now() });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] p-3 md:p-6 bg-bg-gray-100/50 dark:bg-dark-bg">
      <div className="mx-auto max-w-[1300px]">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{id ? "Edit Case Study" : "Add Case Study"}</h1>
            <p className="opacity-65">Compose with rich blocks and preview live.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/account/case-studies"
              className="px-4 py-2 rounded-xl border border-gray/[0.2] hover:bg-white dark:hover:bg-dark-bg-secondary"
            >
              Back
            </Link>
            <Button
              onClick={handleSaveDraft}
              disabled={isSaving || isPublishing || isLoadingExisting}
              variant="secondary"
            >
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>
            <Button
              onClick={handlePublish}
              disabled={isSaving || isPublishing || isLoadingExisting}
            >
              {isPublishing ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </div>

        {isLoadingExisting && (
          <div className="mb-4 text-sm opacity-70">Loading case study...</div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
          <section className="bg-background border border-gray/[0.08]">
            <div className="border-b border-gray/[0.08] p-4 md:p-5">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-2xl md:text-3xl font-semibold bg-transparent outline-none"
                placeholder="Case study title"
              />
            </div>

            <CaseStudyBlocksCanvas
              blocks={blocks}
              selectedBlockId={selectedBlockId}
              onSelectBlock={setSelectedBlockId}
              onUpdateBlockContent={updateBlock}
              onUpdateMediaBlock={updateMediaBlock}
              onDeleteBlock={deleteBlock}
              onMoveBlock={moveBlock}
              onUpdateImageStyle={updateImageStyle}
              onUpdateEmbedStyle={updateEmbedStyle}
              onUploadImage={handleImageUpload}
              onUploadVideo={handleVideoUpload}
              disabled={isSaving || isPublishing || isLoadingExisting}
            />
          </section>

          <aside className="bg-background border border-gray/[0.08] h-fit xl:sticky xl:top-[90px]">
            <div className="p-4 border-b border-gray/[0.08]">
              <h2 className="font-semibold">Insert</h2>
              <p className="text-sm opacity-65">Build your page with flexible content blocks.</p>
            </div>

            <div className="p-4 grid grid-cols-2 gap-2">
              <InsertOptionButton label="Text" onClick={() => addBlock("text")} />
              <InsertOptionButton label="Image" onClick={() => addBlock("image")} />
              <InsertOptionButton label="Video/Audio" onClick={() => addBlock("media")} />
              <InsertOptionButton label="Embed" onClick={() => addBlock("embed")} />
            </div>

          </aside>
        </div>
      </div>
      <Toast
        message={popup?.msg}
        type={popup?.type}
        timestamp={popup?.timestamp}
      />
    </div>
  );
}