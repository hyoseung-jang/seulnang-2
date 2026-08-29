"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { COMPANY, LINKS } from "@/lib/site";

const products = [
  { href: LINKS.pms, label: "PMS" },
  { href: LINKS.muin, label: "무인관제" },
  { href: LINKS.kiosk, label: "키오스크 및 시스템" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white/92 backdrop-blur-md transition-shadow duration-300 ${
        scrolled
          ? "shadow-[0_6px_28px_rgba(18,18,43,0.08)]"
          : "border-b border-black/5"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-[72px] md:px-8">
        <Link
          href={LINKS.home}
          className="shrink-0 text-[16px] font-bold tracking-[-0.03em] text-ink md:text-[17px]"
        >
          슬기로운 낭만지기
        </Link>

        <nav className="hidden items-center gap-7 text-[15px] text-ink md:flex">
          <div
            className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-1.5 py-2 transition hover:text-gold-text"
              aria-expanded={productsOpen}
            >
              제품 소개
              <svg
                viewBox="0 0 10 6"
                fill="none"
                aria-hidden
                className={`h-1.5 w-2.5 transition-transform duration-200 ${
                  productsOpen ? "rotate-180" : ""
                }`}
              >
                <path
                  d="m1 1 4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {productsOpen ? (
              <div className="absolute left-0 top-full pt-1.5">
                <div className="min-w-48 rounded-2xl border border-line bg-white py-2 shadow-[0_18px_50px_rgba(18,18,43,0.12)]">
                  {products.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2.5 transition hover:bg-cream hover:text-gold-text"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <Link href={LINKS.faq} className="transition hover:text-gold-text">
            FAQ
          </Link>
          <a
            href={LINKS.blog}
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-gold-text"
          >
            블로그
          </a>
          <Link href={LINKS.about} className="transition hover:text-gold-text">
            회사 소개
          </Link>
          <a href={LINKS.tel} className="tnum font-semibold">
            {COMPANY.phone}
          </a>
          <Link
            href={LINKS.contact}
            className="rounded-[14px] bg-ink px-4.5 py-2.5 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-brown active:translate-y-0"
          >
            무료 문의
          </Link>
        </nav>

        <button
          type="button"
          className="relative flex h-10 w-10 cursor-pointer items-center justify-center md:hidden"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span
            className={`absolute block h-[2px] w-5 bg-ink transition-transform duration-300 ${
              open ? "rotate-45" : "-translate-y-[4px]"
            }`}
          />
          <span
            className={`absolute block h-[2px] w-5 bg-ink transition-transform duration-300 ${
              open ? "-rotate-45" : "translate-y-[4px]"
            }`}
          />
        </button>
      </div>

      <div
        className={`grid overflow-hidden border-t transition-all duration-300 md:hidden ${
          open ? "grid-rows-[1fr] border-line" : "grid-rows-[0fr] border-transparent"
        }`}
      >
        <div className="overflow-hidden bg-white">
          <div className="flex flex-col gap-3 px-5 py-4 text-[16px]">
            <p className="text-sm text-muted">제품 소개</p>
            {products.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link href={LINKS.faq} onClick={() => setOpen(false)}>
              FAQ
            </Link>
            <a href={LINKS.blog} target="_blank" rel="noreferrer">
              블로그
            </a>
            <Link href={LINKS.about} onClick={() => setOpen(false)}>
              회사 소개
            </Link>
            <a href={LINKS.tel} className="tnum">
              {COMPANY.phone}
            </a>
            <Link
              href={LINKS.contact}
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex justify-center rounded-[14px] bg-ink px-4 py-3 font-semibold text-white"
            >
              무료 문의
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
