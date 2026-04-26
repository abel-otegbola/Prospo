'use client';
import MediaBlockPreview from "./MediaBlockPreview";
import type { CaseStudyBlock, TextAlign, TextVariant } from "../../interface/caseStudy";
import { AlignLeft, AlignRight, AlignVerticalCenter, TextBold, TextItalic, TextUnderline } from "@solar-icons/react";
import CloudinaryDropUpload from "./CloudinaryDropUpload";
import { resolveMediaUrl } from "../../helpers/mediaUrl";
import type { CloudinaryUploadResult } from "../../helpers/cloudinaryUpload";
import { useRef } from "react";
import Image from "next/image";

interface CaseStudyBlocksCanvasProps {
  blocks: CaseStudyBlock[];
  selectedBlockId: number | null;
  onSelectBlock: (id: number) => void;
  onUpdateBlockContent: (id: number, content: string) => void;
  onDeleteBlock: (id: number) => void | Promise<void>;
  onMoveBlock: (id: number, direction: "up" | "down") => void;
  onUpdateImageStyle: (id: number, patch: Partial<CaseStudyBlock["imageStyle"]>) => void;
  onUpdateEmbedStyle: (id: number, patch: Partial<CaseStudyBlock["embedStyle"]>) => void;
  onUpdateMediaBlock: (id: number, content: string) => void;
  onUploadImage: (id: number, result: CloudinaryUploadResult) => void | Promise<void>;
  onUploadVideo: (id: number, result: CloudinaryUploadResult) => void | Promise<void>;
  disabled?: boolean;
}

const TEXT_VARIANTS: TextVariant[] = ["paragraph", "heading"];
const TEXT_ALIGNMENTS: TextAlign[] = ["left", "center", "right"];

function HoverActions({
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="absolute -top-10 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
      <div className="flex items-center gap-1 p-1 rounded-lg border border-gray/[0.2] bg-background shadow-sm">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={isFirst}
          className="px-2 py-1 text-xs rounded hover:bg-gray/[0.12] disabled:opacity-30"
        >
          Up
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={isLast}
          className="px-2 py-1 text-xs rounded hover:bg-gray/[0.12] disabled:opacity-30"
        >
          Down
        </button>
        <button type="button" onClick={onDelete} className="px-2 py-1 text-xs rounded text-red-500 hover:bg-red-500/10">
          Delete
        </button>
      </div>
    </div>
  );
}

function TextInlineToolbar({
  block,
  onRunCommand,
}: {
  block: CaseStudyBlock;
  onRunCommand: (id: number, command: string, value?: string) => void;
}) {
  return (
    <div className="absolute left-2 -top-10 opacity-0 group-hover:opacity-100 transition-opacity z-10">
      <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg border border-gray/[0.2] bg-background shadow-sm">
        <select
          defaultValue="paragraph"
          onMouseDown={(e) => e.preventDefault()}
          onChange={(e) => {
            const selected = e.target.value as TextVariant;
            onRunCommand(block.id, "formatBlock", selected === "heading" ? "H2" : "P");
            e.currentTarget.value = "paragraph";
          }}
          className="px-2 py-1 text-xs border border-gray/[0.2] rounded bg-transparent"
        >
          {TEXT_VARIANTS.map((variant) => (
            <option key={variant} value={variant}>
              {variant}
            </option>
          ))}
        </select>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          className="px-2 py-1 text-xs rounded hover:bg-gray/[0.12]"
          onClick={() => onRunCommand(block.id, "bold")}
        >
          <TextBold size={14} color="currentColor" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          className="px-2 py-1 text-xs rounded hover:bg-gray/[0.12]"
          onClick={() => onRunCommand(block.id, "italic")}
        >
          <TextItalic size={14} color="currentColor" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          className="px-2 py-1 text-xs rounded hover:bg-gray/[0.12]"
          onClick={() => onRunCommand(block.id, "underline")}
        >
          <TextUnderline size={14} color="currentColor" />
        </button>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          className="px-2 py-1 text-xs rounded hover:bg-gray/[0.12]"
          onClick={() => onRunCommand(block.id, "insertUnorderedList")}
        >
          UL
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          className="px-2 py-1 text-xs rounded hover:bg-gray/[0.12]"
          onClick={() => onRunCommand(block.id, "insertOrderedList")}
        >
          OL
        </button>

        {TEXT_ALIGNMENTS.map((align) => {
          const command = align === "left" ? "justifyLeft" : align === "center" ? "justifyCenter" : "justifyRight";
          return (
          <button
            key={align}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            className="px-2 py-1 text-xs rounded hover:bg-gray/[0.12]"
            onClick={() => onRunCommand(block.id, command)}
          >
            {align === "left" ? <AlignLeft size={14} color="currentColor" /> : align === "center" ? <AlignVerticalCenter size={14} color="currentColor" /> : <AlignRight size={14} color="currentColor" />}
          </button>
          );
        })}

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          className="px-2 py-1 text-xs rounded hover:bg-gray/[0.12]"
          onClick={() => {
            const nextLink = window.prompt("Enter text link URL", "https://");
            if (nextLink !== null) {
              const trimmed = nextLink.trim();
              if (!trimmed) {
                onRunCommand(block.id, "unlink");
                return;
              }
              onRunCommand(block.id, "createLink", trimmed);
            }
          }}
        >
          Link
        </button>
      </div>
    </div>
  );
}

function ImageInlineToolbar({
  block,
  onUpdateBlockContent,
  onUpdateImageStyle,
}: {
  block: CaseStudyBlock;
  onUpdateBlockContent: (id: number, content: string) => void;
  onUpdateImageStyle: (id: number, patch: Partial<CaseStudyBlock["imageStyle"]>) => void;
}) {
  const fitMode = block.imageStyle?.fit || "cover";

  return (
    <div className="absolute left-2 -top-10 opacity-0 group-hover:opacity-100 transition-opacity z-10">
      <div className="flex items-center gap-1 p-1 rounded-lg border border-gray/[0.2] bg-background shadow-sm">
        <input
          value={block.content}
          onChange={(e) => onUpdateBlockContent(block.id, e.target.value)}
          className="w-[220px] px-2 py-1 text-xs border border-gray/[0.2] rounded bg-transparent"
          placeholder="https://image-url"
        />
        <select
          value={fitMode}
          onChange={(e) => onUpdateImageStyle(block.id, { fit: e.target.value as "cover" | "contain" })}
          className="px-2 py-1 text-xs border border-gray/[0.2] rounded bg-transparent"
        >
          <option value="cover">Cover</option>
          <option value="contain">Contain</option>
        </select>
      </div>
    </div>
  );
}

export default function CaseStudyBlocksCanvas({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onUpdateBlockContent,
  onDeleteBlock,
  onMoveBlock,
  onUpdateImageStyle,
  onUpdateEmbedStyle,
  onUpdateMediaBlock,
  onUploadImage,
  onUploadVideo,
  disabled = false,
}: CaseStudyBlocksCanvasProps) {
  const textRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const syncTextHtml = (id: number) => {
    const element = textRefs.current.get(id);
    if (!element) {
      return;
    }

    onUpdateBlockContent(id, element.innerHTML);
  };

  const runTextCommand = (id: number, command: string, value?: string) => {
    const element = textRefs.current.get(id);
    if (!element) {
      return;
    }

    element.focus();
    document.execCommand(command, false, value);
    syncTextHtml(id);
  };

  return (
    <div className="p-4 md:p-6 space-y-4 min-h-[60vh]">
      {blocks.map((block, index) => {
        const isSelected = selectedBlockId === block.id;
        const shellClasses = `group relative rounded-xl border ${
          isSelected ? "border-primary/50 bg-primary/5" : "border-gray/[0.12]"
        }`;

        if (block.type === "text") {
          return (
            <div key={block.id} onClick={() => onSelectBlock(block.id)} className={`${shellClasses} p-4 cursor-text`}>
              <TextInlineToolbar block={block} onRunCommand={runTextCommand} />
              <HoverActions
                isFirst={index === 0}
                isLast={index === blocks.length - 1}
                onMoveUp={() => onMoveBlock(block.id, "up")}
                onMoveDown={() => onMoveBlock(block.id, "down")}
                onDelete={() => onDeleteBlock(block.id)}
              />

              <div
                ref={(node) => {
                  if (node) {
                    textRefs.current.set(block.id, node);
                  } else {
                    textRefs.current.delete(block.id);
                  }
                }}
                contentEditable
                suppressContentEditableWarning
                className="min-h-[80px] outline-none leading-7"
                onInput={() => syncTextHtml(block.id)}
                onBlur={() => syncTextHtml(block.id)}
                dangerouslySetInnerHTML={{ __html: block.content || "" }}
              />
            </div>
          );
        }

        if (block.type === "image") {
          const fitMode = block.imageStyle?.fit || "cover";

          return (
            <div key={block.id} onClick={() => onSelectBlock(block.id)} className={`${shellClasses} p-3`}>
              <ImageInlineToolbar
                block={block}
                onUpdateBlockContent={onUpdateBlockContent}
                onUpdateImageStyle={onUpdateImageStyle}
              />
              <HoverActions
                isFirst={index === 0}
                isLast={index === blocks.length - 1}
                onMoveUp={() => onMoveBlock(block.id, "up")}
                onMoveDown={() => onMoveBlock(block.id, "down")}
                onDelete={() => onDeleteBlock(block.id)}
              />

              

              {block.content ? (
                <Image src={block.content} alt="Case study visual" className={`w-full max-h-[420px] rounded-lg ${fitMode === "contain" ? "object-contain" : "object-cover"}`} />
              ) : (
                <div className="mb-3 fex items-center justify-center min-h-[200px]">
                <CloudinaryDropUpload
                  kind="image"
                  onUploaded={async (result) => onUploadImage(block.id, result)}
                  disabled={disabled}
                />
              </div>
              )}
            </div>
          );
        }

        if (block.type === "media") {
          const media = resolveMediaUrl(block.content);

          return (
            <div key={block.id} onClick={() => onSelectBlock(block.id)} className={`${shellClasses} p-3`}>
              <HoverActions
                isFirst={index === 0}
                isLast={index === blocks.length - 1}
                onMoveUp={() => onMoveBlock(block.id, "up")}
                onMoveDown={() => onMoveBlock(block.id, "down")}
                onDelete={() => onDeleteBlock(block.id)}
              />

              <div className="mb-3">
                <CloudinaryDropUpload
                  kind="video"
                  onUploaded={async (result) => onUploadVideo(block.id, result)}
                  disabled={disabled}
                />
              </div>

              <MediaBlockPreview value={block.content} />

              <div className="mt-3">
                <input
                  value={block.content}
                  onChange={(e) => onUpdateBlockContent(block.id, e.target.value)}
                  onBlur={(e) => onUpdateMediaBlock(block.id, e.target.value)}
                  className="w-full rounded-lg border border-gray/[0.15] bg-transparent px-3 py-2 text-sm outline-none"
                  placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                />
                {!block.content ? (
                  <p className="text-xs opacity-60 mt-2">Supports YouTube, Vimeo, Cloudinary, and direct audio/video file URLs.</p>
                ) : media.isValid ? (
                  <p className="text-xs text-green-600 mt-2">Normalized URL: {media.normalizedUrl}</p>
                ) : (
                  <p className="text-xs text-red-500 mt-2">{media.error}</p>
                )}
              </div>
            </div>
          );
        }

        return (
          <div key={block.id} onClick={() => onSelectBlock(block.id)} className={`${shellClasses} p-3`}>
            <HoverActions
              isFirst={index === 0}
              isLast={index === blocks.length - 1}
              onMoveUp={() => onMoveBlock(block.id, "up")}
              onMoveDown={() => onMoveBlock(block.id, "down")}
              onDelete={() => onDeleteBlock(block.id)}
            />
            {block.content ? (
              <iframe
                srcDoc={block.content}
                title={`Embed ${block.id}`}
                sandbox="allow-scripts allow-same-origin"
                className="w-full rounded-lg border border-gray/[0.12] bg-white"
                style={{ minHeight: `${block.embedStyle?.height || 220}px` }}
              />
            ) : (
              <div className="h-[220px] rounded-lg border border-dashed border-gray/[0.25] flex items-center justify-center opacity-60">
                Add embed code below
              </div>
            )}

            <div className="mt-3 space-y-2">
              <textarea
                value={block.content}
                onChange={(e) => onUpdateBlockContent(block.id, e.target.value)}
                className="w-full h-[140px] rounded-lg border border-gray/[0.15] bg-transparent p-3 text-sm outline-none font-mono"
                placeholder="Paste embed HTML"
              />
              <input
                type="number"
                min={120}
                max={900}
                value={block.embedStyle?.height || 220}
                onChange={(e) => onUpdateEmbedStyle(block.id, { height: Number(e.target.value) || 220 })}
                className="w-full rounded-lg border border-gray/[0.15] bg-transparent px-3 py-2 text-sm outline-none"
                placeholder="Embed height"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
