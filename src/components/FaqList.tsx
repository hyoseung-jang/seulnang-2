"use client";

import { useState } from "react";
import { FAQS } from "@/lib/site";

export function FaqList() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <ul className="divide-y divide-line border-y border-line">
      {FAQS.map((item, index) => {
        const open = openIndex === index;
        return (
          <li key={item.q}>
            <button
              type="button"
              className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left text-[16px] font-medium transition-colors duration-200 hover:text-gold-text md:text-[18px]"
              onClick={() => setOpenIndex(open ? null : index)}
              aria-expanded={open}
            >
              {item.q}
              <span
                aria-hidden
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-lg text-muted transition-transform duration-300 ${
                  open ? "rotate-45 border-gold bg-gold/15 text-gold-text" : ""
                }`}
              >
                +
              </span>
            </button>
            <div className="faq-panel" data-open={open}>
              <div>
                <p className="pb-6 pr-12 text-[15px] leading-7 text-muted">
                  {item.a}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
