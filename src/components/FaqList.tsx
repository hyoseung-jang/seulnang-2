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
              className="flex w-full items-center justify-between gap-4 py-5 text-left text-[16px] font-medium md:text-[18px]"
              onClick={() => setOpenIndex(open ? null : index)}
              aria-expanded={open}
            >
              {item.q}
              <span aria-hidden className="text-xl text-muted">
                {open ? "×" : "+"}
              </span>
            </button>
            {open ? (
              <p className="pb-5 text-[15px] leading-7 text-muted">{item.a}</p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
