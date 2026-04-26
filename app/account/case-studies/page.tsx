'use client'
import { useContext, useEffect, useState } from "react";
import { AddCircle, CheckCircle, Copy, Eye, PenNewSquare, Tablet } from "@solar-icons/react";
import Button from "../../../components/button/Button";
import { AuthContext } from "../../../contexts/AuthContextValue";
import { getUserCaseStudies } from "../../../helpers/caseStudyApi";
import type { CaseStudyBlock, CaseStudyDocument } from "../../../interface/caseStudy";
import { ClockCircle } from "@solar-icons/react/ssr";
import Toast from "../../../components/toast/Toast";
import Link from "next/link";
import Image from "next/image";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function getPreviewText(blocks: CaseStudyBlock[]): string {
  const textBlock = blocks.find((block) => block.type === "text" && stripHtml(block.content).trim());
  return textBlock ? stripHtml(textBlock.content) : "No summary yet. Open this case study to add a short description.";
}

function getPreviewImage(blocks: CaseStudyBlock[]): string {
  const imageBlock = blocks.find((block) => block.type === "image" && block.content.trim());
  if (imageBlock?.content) {
    return imageBlock.content;
  }

  const mediaBlock = blocks.find((block) => block.type === "media" && block.content.trim());
  if (mediaBlock?.content) {
    return mediaBlock.content;
  }

  return "/picture-placeholder.png";
}

function formatDate(value: unknown): string {
  if (!value || typeof value !== "object" || !("toDate" in value)) {
    return "Recent";
  }

  try {
    const date = (value as { toDate: () => Date }).toDate();
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
  } catch {
    return "Recent";
  }
}

export default function CaseStudies() {
  const { user } = useContext(AuthContext);
  const [caseStudies, setCaseStudies] = useState<CaseStudyDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [popup, setPopup] = useState<{ type: "success" | "error"; msg: string; timestamp: number } | null>(null);

  const copyShareLink = async (id: string) => {
    const shareUrl = `${window.location.origin}/case-study/${id}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setPopup((prev) => ({
        type: "success",
        msg: "Share link copied.",
        timestamp: (prev?.timestamp ?? 0) + 1,
      }));
    } catch {
      setPopup((prev) => ({
        type: "error",
        msg: "Unable to copy link. Please copy it manually.",
        timestamp: (prev?.timestamp ?? 0) + 1,
      }));
    }
  };

  useEffect(() => {
    const run = async () => {
      if (!user?.uid) {
        setCaseStudies([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const docs = await getUserCaseStudies(user.uid);
        setCaseStudies(docs);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch case studies.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [user?.uid]);

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center gap-6 justify-between">
        <div>
          <h1 className="md:text-2xl text-xl font-medium mb-2">Case Studies</h1>
          <p className="opacity-[0.6]">Manage and design case studies</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/account/case-studies/new">
            <Button variant="secondary" className="flex items-center gap-2">
              <AddCircle size={20} />
              Add New Case Study
            </Button>
          </Link>
        </div>
      </div>

      {/* Feed Layout */}
      <div className="max-w-[980px] border-y border-gray/[0.12] divide-y divide-gray/[0.12] mx-auto">
        {loading && (
          <div className="py-12 text-[12px] opacity-70">Loading your case studies...</div>
        )}

        {!loading && error && (
          <div className="py-12 text-[12px] text-red-500">{error}</div>
        )}

        {!loading && !error && caseStudies.length === 0 && (
          <div className="py-12">
            <p className="text-lg font-medium mb-2">No case studies yet</p>
            <p className="opacity-70 mb-4">Start by creating your first case study.</p>
            <Link href="/account/case-studies/new">
              <Button className="flex items-center gap-2">
                <AddCircle size={20} />
                Add New Case Study
              </Button>
            </Link>
          </div>
        )}

        {!loading && !error && caseStudies.map((study) => {
          const previewText = getPreviewText(study.blocks);
          const imageUrl = getPreviewImage(study.blocks);

          return (
            <article key={study.id} className="py-7 flex  gap-5 items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="opacity-75 md:text-[15px] text-[13px] mb-3">
                  In Case Studies by You
                </p>

                <Link href={`/account/case-studies/${study.id}`}>
                  <h2 className="text-xl md:text-[24px] font-semibold leading-tight mb-2 line-clamp-2 hover:underline">
                    {study.title}
                  </h2>
                </Link>

                <p className="text-[14px] font-medium opacity-80 line-clamp-2 mb-4">
                  {previewText}
                </p>

                <div className="flex justify-between flex-wrap gap-8">
                  <div className="flex items-center flex-wrap md:gap-x-8 gap-x-4 gap-y-4 text-[12px] opacity-70">
                    <span className="flex gap-1 items-center"><ClockCircle weight={"BoldDuotone"} className="text-primary" size={20} />{formatDate(study.publishedAt || study.updatedAt || study.createdAt)}</span>
                    <span className="flex gap-1 items-center"><CheckCircle weight={"BoldDuotone"} className="text-green-400" size={20} />{study.status === "published" ? "Published" : "Draft"}</span>
                    <span className="flex gap-1 items-center"><Tablet weight={"BoldDuotone"} className="text-orange-400" size={20} />{study.blocks.length} blocks</span>
                    
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/account/case-studies/${study.id}/edit`}
                      className="flex items-center gap-2 p-2 bg-gray/[0.09] rounded-full hover:bg-gray/[0.08] opacity-100"
                    >
                      <PenNewSquare size={16} />
                    </Link>
                    <Link
                      href={`/case-study/${study.id}`}
                      className="flex items-center gap-2 p-2 bg-gray/[0.09] rounded-full hover:bg-gray/[0.08] opacity-100"
                    >
                      <Eye size={16} />
                    </Link>
                    <button
                      onClick={() => copyShareLink(study.id)}
                      className="p-2 bg-gray/[0.09] rounded-full hover:bg-gray/[0.08] opacity-100"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <Link href={`/account/case-studies/${study.id}`} className="shrink-0">
                <Image
                  src={imageUrl}
                  alt="Case study preview"
                    width={120}
                    height={80}
                  className="md:w-[200px] w-[100px] h-full rounded object-cover border border-gray/[0.12]"
                />
              </Link>
            </article>
          );
        })}
      </div>
      <Toast
        message={popup?.msg}
        type={popup?.type}
        timestamp={popup?.timestamp}
      />
    </div>
  );
}
