"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { COMPANY, IMG, LINKS } from "@/lib/site";

const products = [
  { href: LINKS.pms, label: "PMS" },
  { href: LINKS.muin, label: "무인관제" },
  { href: LINKS.kiosk, label: "키오스크 및 시스템" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-[72px] md:px-8">
        <Link href={LINKS.home} className="relative h-11 w-[132px] shrink-0">
          <Image
            src={IMG.logo}
            alt={COMPANY.name}
            fill
            className="object-contain object-left"
            sizes="132px"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-7 text-[15px] text-ink md:flex">
          <div
            className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <button type="button" className="inline-flex items-center gap-1">
              제품 소개
              <span className="text-[10px]">▾</span>
            </button>
            {productsOpen ? (
              <div className="absolute left-0 top-full min-w-44 rounded-xl border border-line bg-white py-2 shadow-lg">
                {products.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2.5 hover:bg-cream"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          <Link href={LINKS.faq}>FAQ</Link>
          <a href={LINKS.blog} target="_blank" rel="noreferrer">
            블로그
          </a>
          <Link href={LINKS.about}>회사 소개</Link>
          <a href={LINKS.tel} className="font-medium">
            {COMPANY.phone}
          </a>
          <Link
            href={LINKS.contact}
            className="rounded-[14px] bg-brown px-4 py-2 text-sm text-white"
          >
            무료 문의
          </Link>
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="block h-[2px] w-5 bg-ink" />
          <span className="block h-[2px] w-5 bg-ink" />
        </button>
      </div>

      {open ? (
        <div className="border-t border-line bg-white px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-[16px]">
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
            <a href={LINKS.tel}>{COMPANY.phone}</a>
            <Link
              href={LINKS.contact}
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex justify-center rounded-[14px] bg-brown px-4 py-3 text-white"
            >
              무료 문의
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
