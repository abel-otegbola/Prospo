'use client'
import { useContext, useEffect, useState } from "react";
import MediaBlockPreview from "../../../../components/caseStudy/MediaBlockPreview";
import { AuthContext } from "../../../../contexts/AuthContextValue";
import { getUserCaseStudyById } from "../../../../helpers/caseStudyApi";
import type { CaseStudyBlock, CaseStudyDocument } from "../../../../interface/caseStudy";
import { AltArrowLeft } from "@solar-icons/react";
import { PenNewSquare } from "@solar-icons/react/ssr";
import Toast from "../../../../components/toast/Toast";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";

function formatDate(value: unknown): string {
  if (!value || typeof value !== "object" || !("toDate" in value)) {
    return "Recent";
  }

  try {
    const date = (value as { toDate: () => Date }).toDate();
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return "Recent";
  }
}

function TextBlockView({ block }: { block: CaseStudyBlock }) {
  return (
    <div
      className="leading-7 [&_h1]:text-3xl [&_h1]:font-semibold [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:text-xl [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-primary [&_a]:underline"
      dangerouslySetInnerHTML={{ __html: block.content || "" }}
    />
  );
}

function BlockView({ block }: { block: CaseStudyBlock }) {
  if (block.type === "text") {
    return <TextBlockView block={block} />;
  }

  if (block.type === "image") {
    const fitMode = block.imageStyle?.fit || "cover";
    if (!block.content) {
      return (
        <div className="h-[220px] rounded-lg border border-dashed border-gray/[0.25] flex items-center justify-center opacity-60">
          No image set
        </div>
      );
    }

    return (
      <Image
        src={block.content}
        alt="Case study visual"
        className={`w-full max-h-[520px] rounded-lg ${fitMode === "contain" ? "object-contain" : "object-cover"}`}
        width={520}
        height={520}
      />
    );
  }

  if (block.type === "media") {
    return <MediaBlockPreview value={block.content} />;
  }

  if (!block.content) {
    return (
      <div className="h-[220px] rounded-lg border border-dashed border-gray/[0.25] flex items-center justify-center opacity-60">
        No embed code set
      </div>
    );
  }

  return (
    <iframe
      srcDoc={block.content}
      title={`Embed ${block.id}`}
      sandbox="allow-scripts allow-same-origin"
      className="w-full rounded-lg border border-gray/[0.12] bg-white"
      style={{ minHeight: `${block.embedStyle?.height || 220}px` }}
    />
  );
}

export default function CaseStudyDetails() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { user } = useContext(AuthContext);
  const [caseStudy, setCaseStudy] = useState<CaseStudyDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [popup, setPopup] = useState<{ type: "success" | "error"; msg: string; timestamp: number } | null>(null);

  const handleCopyShareLink = async () => {
    if (!id) {
      return;
    }

    const shareUrl = `${window.location.origin}/case-study/${id}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setPopup({ type: "success", msg: "Share link copied.", timestamp: Date.now() });
    } catch {
      setPopup({ type: "error", msg: "Unable to copy link. Please copy it manually.", timestamp: Date.now() });
    }
  };

  useEffect(() => {
    const run = async () => {
      if (!id || !user?.uid) {
        setLoading(false);
        setError("Case study not found.");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const data = await getUserCaseStudyById(user.uid, id);
        setCaseStudy(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load case study.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [id, user?.uid]);

  return (
    <div className="md:p-6 p-3 min-h-screen">
      <div className="mx-auto max-w-[980px]">
        <div className="mb-6 flex items-center justify-between gap-3">
            <Link
              href="/account/case-studies"
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white dark:hover:bg-dark-bg-secondary"
            >
              <AltArrowLeft size={16} />Back
            </Link>
          <div className="flex items-center gap-6">
            {id && (
              <button
                onClick={handleCopyShareLink}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray/[0.2] hover:bg-white dark:hover:bg-dark-bg-secondary"
              >
                Copy Share Link
              </button>
            )}
            {id && (
              <Link
                href={`/account/case-studies/${id}/edit`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray/[0.2] hover:bg-white dark:hover:bg-dark-bg-secondary"
              >
                <PenNewSquare size={16} />Edit
              </Link>
            )}
          {caseStudy && (
            <p className="text-sm opacity-70">
              {caseStudy.status === "published" ? "Published" : "Draft"}
            </p>
          )}
          </div>
        </div>

        {loading && <div className="text-sm opacity-70">Loading case study...</div>}

        {!loading && error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-red-500 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && caseStudy && (
          <article className="rounded-2xl border border-gray/[0.1] bg-background p-4 md:p-6">
            <header className="mb-6 border-b border-gray/[0.1] pb-5">
              <h1 className="text-2xl md:text-4xl font-semibold leading-tight mb-2">{caseStudy.title}</h1>
              <p className="text-sm opacity-70">
                Updated {formatDate(caseStudy.updatedAt || caseStudy.createdAt)}
              </p>
            </header>

            <section className="space-y-5">
              {caseStudy.blocks.length === 0 && (
                <p className="text-sm opacity-70">No content blocks found for this case study.</p>
              )}

              {caseStudy.blocks.map((block) => (
                <div key={block.id} className="">
                  <BlockView block={block} />
                </div>
              ))}
            </section>
          </article>
        )}
      </div>
      <Toast
        message={popup?.msg}
        type={popup?.type}
        timestamp={popup?.timestamp}
      />
    </div>
  );
}
