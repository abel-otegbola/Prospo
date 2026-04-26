import {
  Buildings,
  MapPoint,
  Star,
  Bookmark,
  Pen,
  TrashBin2,
  Letter,
  ClockCircle,
  UsersGroupRounded,
} from "@solar-icons/react";
import LoadingIcon from "../../assets/icons/loadingIcon";
import type { Lead } from "../../contexts/LeadsContextValue";
import Link from "next/link";
import Image from "next/image";

interface LeadCardProps {
  lead: Lead;
  // Card actions
  onClick?: (lead: Lead) => void;

  // Bookmark action (for dashboard)
  onBookmark?: (lead: Lead) => void;
  isBookmarking?: boolean;

  // Lead management actions (for leads page)
  onFindEmail?: (
    leadId: string,
    companyWebsite: string,
    companyName: string,
  ) => void;
  isFindingEmail?: boolean;
  onEdit?: (lead: Lead) => void;
  onDelete?: (leadId: string) => void;

  // Score color helper
  getScoreColor: (score: number) => string;
}

export default function LeadCard({
  lead,
  onClick,
  onBookmark,
  isBookmarking = false,
  onFindEmail,
  isFindingEmail = false,
  onEdit,
  onDelete,
  getScoreColor,
}: LeadCardProps) {
  return (
    <div
      className="bg-background border-t border-gray/[0.1] transition-all duration-300 overflow-hidden cursor-pointer w-full"
      onClick={() => onClick?.(lead)}
    >
      {/* Header */}
      <div className="flex flex-wrap items-stretch gap-4 p-4">
        {lead?.logoUrl ? (
          <Image
            src={lead.logoUrl}
            alt={`${lead.company} logo`}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover flex-shrink-0 border border-gray/[0.1]"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              target.nextElementSibling?.classList.remove("hidden");
            }}
          />
        ) : null}
        <div
          className={`w-12 h-12 bg-slate-100/[0.3] rounded-full flex flex-wrap items-center justify-center font-bold flex-shrink-0 border border-gray/[0.1] ${lead?.logoUrl ? "hidden" : ""}`}
        >
          {lead?.company.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-1">
            <h3 className="font-semibold">{lead?.company}</h3>
            <div className="flex items-center gap-1 bg-gray/[0.09] px-2 py-1 leading-[110%] text-[12px] rounded-full">
              <Star size={14} className="text-yellow-500" weight="Bold" />
              <span className={`font-medium ${getScoreColor(lead?.score)}`}>
                {lead?.score}
              </span>
            </div>
          </div>
          <div className="flex items-center flex-wrap gap-2 opacity-50 text-[13px]">
            <Buildings size={16} className="flex-shrink-0" />
            <span className="font-medium">{lead?.industry}</span>
          </div>
          {lead?.estimatedEmployees && (
            <div className="flex items-center gap-1 mt-1 opacity-50 text-[13px]">
              <UsersGroupRounded size={14} />
              <span className="">{lead.estimatedEmployees} employees</span>
            </div>
          )}
          <div className="flex items-center gap-1 mt-1 opacity-50 text-[13px]">
            <MapPoint size={14} />
            <span>{lead?.location}</span>
          </div>
          {lead?.foundedYear && (
            <div className="flex items-center gap-1 mt-1 opacity-50 text-[13px]">
              <ClockCircle size={14} />
              <span>Founded {lead.foundedYear}</span>
            </div>
          )}
          {/* Service Needs (if available) */}
          {lead?.serviceNeeds && lead.serviceNeeds.length > 0 && (
            <div className="py-2 flex flex-wrap items-center gap-2">
              <p className="text-xs opacity-50 text-[13px] font-medium">
                Service Needs:
              </p>
              <div className="flex flex-wrap gap-2">
                {lead.serviceNeeds.map((service, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-500/[0.09] text-xs rounded-full font-medium"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* Social Links */}
          {(lead?.linkedinUrl ||
            lead?.twitterUrl ||
            lead?.facebookUrl ||
            lead?.companyWebsite) && (
            <div className="flex items-center flex-wrap gap-2 mt-3">
              {lead?.companyWebsite && (
                <Link
                  href={lead.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs px-4 py-1 rounded bg-gray/[0.05] font-medium border border-gray/[0.1] hover:bg-primary hover:text-white hover:border-primary"
                >
                  Website
                </Link>
              )}
              {lead?.linkedinUrl && (
                <Link
                  href={lead.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs px-4 py-1 rounded bg-gray/[0.05] font-medium border border-gray/[0.1] hover:bg-primary hover:text-white hover:border-primary"
                >
                  LinkedIn
                </Link>
              )}
              {lead?.twitterUrl && (
                <Link
                  href={lead.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs px-4 py-1 rounded bg-gray/[0.05] font-medium border border-gray/[0.1] hover:bg-primary hover:text-white hover:border-primary"
                >
                  Twitter
                </Link>
              )}
              {lead?.facebookUrl && (
                <Link
                  href={lead.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs px-4 py-1 rounded bg-gray/[0.05] font-medium border border-gray/[0.1] hover:bg-primary hover:text-white hover:border-primary"
                >
                  Facebook
                </Link>
              )}
            </div>
          )}
        </div>
        {/* Footer */}
        <div
          className={`flex md:flex-col justify-between items-center ${onFindEmail || onEdit || onDelete ? "justify-between" : ""} gap-4`}
        >
          <div className="flex items-center gap-1.5">
            <span className="opacity-50 text-[13px]">Est. Value:</span>
            <span className="font-bold opacity-50 text-[13px]">
              ${lead?.value.toLocaleString()}
            </span>
          </div>

          {/* Action buttons (for leads page) */}
          {(onFindEmail || onEdit || onDelete) && (
            <div className="flex items-center gap-2">
              {onFindEmail && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFindEmail(lead.id, lead.companyWebsite, lead.company);
                  }}
                  disabled={isFindingEmail || !lead.companyWebsite}
                  className="flex items-center gap-2 p-2 bg-gray/[0.09] rounded-full hover:bg-gray/[0.08] opacity-100"
                  title={
                    !lead.companyWebsite ? "No website available" : "Find email"
                  }
                >
                  {isFindingEmail ? (
                    <LoadingIcon className="w-[18px] h-[18px] " />
                  ) : (
                    <Letter size={18} className="" />
                  )}
                </button>
              )}
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(lead);
                  }}
                  className="flex items-center gap-2 p-2 bg-gray/[0.09] rounded-full hover:bg-gray/[0.08] opacity-100"
                  title="Edit lead"
                >
                  <Pen size={18} className="text-[13px]" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(lead.id);
                  }}
                  className="flex items-center gap-2 p-2 bg-gray/[0.09] rounded-full hover:bg-gray/[0.08] opacity-100"
                  title="Delete lead"
                >
                  <TrashBin2 size={18} className="text-red-600" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Bookmark button (for dashboard) */}
        {onBookmark && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookmark(lead);
            }}
            disabled={isBookmarking}
            className="opacity-75 hover:opacity-100 disabled:opacity-50"
            title="Save to leads"
          >
            <Bookmark
              size={20}
              weight={isBookmarking ? "Bold" : "Linear"}
              className={isBookmarking ? "" : "text-gray"}
            />
          </button>
        )}
      </div>
    </div>
  );
}
