'use client'
import { useEffect, useState } from "react";
import { AltArrowLeft } from "@solar-icons/react";
import { CaseStudyBlock, CaseStudyDocument } from "@/interface/caseStudy";
import Image from "next/image";
import MediaBlockPreview from "@/components/caseStudy/MediaBlockPreview";
import { useParams } from "next/navigation";
import { getPublicCaseStudyById } from "@/helpers/caseStudyApi";
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
        width={2000}
        height={2000}
        alt="Case study visual"
        className={`w-full max-h-[520px] rounded-lg ${fitMode === "contain" ? "object-contain" : "object-cover"}`}
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

export default function PublicCaseStudy() {
  const { id } = useParams();
  const [caseStudy, setCaseStudy] = useState<CaseStudyDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      if (!id) {
        setLoading(false);
        setError("Case study not found.");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const data = await getPublicCaseStudyById(Array.isArray(id) ? id[0] : id);
        setCaseStudy(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load case study.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [id]);

  return (
    <div className="md:p-6 p-3 min-h-screen">
      <div className="mx-auto max-w-[980px]">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white dark:hover:bg-dark-bg-secondary"
          >
            <AltArrowLeft size={16} />Back
          </Link>
          {caseStudy && (
            <p className="text-sm opacity-70">
              {caseStudy.status === "published" ? "Published" : "Draft Preview"}
            </p>
          )}
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
                <div key={block.id}>
                  <BlockView block={block} />
                </div>
              ))}
            </section>
          </article>
        )}
      </div>
    </div>
  );
}
