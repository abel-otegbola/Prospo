'use client';
import { useMemo, useState } from "react";
import { AltArrowDown } from "@solar-icons/react";
import Link from "next/link";
import type { FaqCategory, FaqItem } from "../../constants/faqs";
import { FAQ_CATEGORIES, FAQ_ITEMS } from "../../constants/faqs";

interface FaqSectionProps {
  title?: string;
  subtitle?: string;
  sectionClassName?: string;
  categories?: readonly FaqCategory[];
  items?: FaqItem[];
}

function FaqSection({
  title = "Frequently asked questions",
  subtitle = "These are the most commonly asked questions about Prospo. Can't find what you are looking for?",
  sectionClassName = "pb-20 mt-20",
  categories = FAQ_CATEGORIES,
  items = FAQ_ITEMS,
}: FaqSectionProps) {
  const [activeCategory, setActiveCategory] = useState<FaqCategory>(categories[0]);

  const filteredItems = useMemo(
    () => items.filter((item) => item.category === activeCategory),
    [items, activeCategory]
  );

  const [openItemId, setOpenItemId] = useState<string | null>(filteredItems[0]?.id ?? null);

  const onCategoryChange = (category: FaqCategory) => {
    setActiveCategory(category);
    const firstInCategory = items.find((item) => item.category === category);
    setOpenItemId(firstInCategory?.id ?? null);
  };

  return (
    <section className={`px-4 sm:px-6 lg:px-16 max-w-4xl mx-auto ${sectionClassName}`}>
      <div className="rounded-3xl border border-gray/[0.18] bg-background px-4 sm:px-8 py-10 sm:py-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="xl:text-4xl sm:text-3xl text-2xl font-semibold">{title}</h2>
          <p className="mt-3 text-sm sm:text-base opacity-[0.75] leading-6">
            {subtitle} {" "}
            <Link href="/contact" className="underline underline-offset-2 hover:text-primary transition-colors">
              Chat to our friendly team
            </Link>
            .
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {categories.map((category) => {
            const isActive = category === activeCategory;

            return (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                className={`px-4 py-1.5 rounded-full border text-sm transition-colors ${
                  isActive
                    ? "bg-black text-white border-black"
                    : "border-gray/[0.25] hover:border-black/40"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="mt-8 space-y-3">
          {filteredItems.map((item, index) => {
            const isOpen = openItemId === item.id;

            return (
              <article key={item.id} className="rounded-2xl border border-gray/[0.2] bg-background overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenItemId(isOpen ? null : item.id)}
                  className="w-full px-4 sm:px-5 py-4 flex items-center gap-3 text-left"
                >
                  <span className="w-8 h-8 rounded-lg border border-gray/[0.2] flex items-center justify-center text-xs font-medium opacity-[0.7] shrink-0">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="flex-1 font-medium text-sm sm:text-base">{item.question}</span>

                  <span
                    className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
                    aria-hidden="true"
                  >
                    <AltArrowDown size={16} />
                  </span>
                </button>

                {isOpen ? (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 pl-[58px] text-sm sm:text-[15px] opacity-[0.72] leading-6">
                    {item.answer}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
