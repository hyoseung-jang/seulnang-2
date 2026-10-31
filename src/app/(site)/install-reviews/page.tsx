import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { installReviews } from "@/lib/installReviews";

export const metadata: Metadata = {
  title: "설치 후기 | 슬기로운 낭만지기",
  description: "실제 업장의 무인관제 도입 배경과 운영 방식을 확인하세요.",
  alternates: { canonical: "/install-reviews" },
};

export default function InstallReviewsPage() {
  return (
    <main>
      <section className="bg-cream px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold tracking-[0.08em] text-gold-text">INSTALL STORIES</p>
          <h1 className="mt-4 max-w-3xl text-[34px] font-semibold leading-[1.3] tracking-[-0.04em] md:text-[52px]">설치 후기로 보는<br />무인운영의 실제 모습</h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-8 text-muted">현장 사진으로 먼저 보고, 궁금한 사례는 원문 그대로 확인해 보세요.</p>
        </div>
      </section>
      <section className="px-5 py-14 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {installReviews.map((review, index) => (
            <Link key={review.slug} href={`/install-reviews/${review.slug}`} className="group overflow-hidden rounded-[24px] border border-line bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-deep">
              <div className="relative aspect-[4/3] bg-ink">
                <Image src={review.photos[0].src} alt={review.photos[0].alt} fill className="object-cover" sizes="(min-width: 768px) 45vw, 100vw" />
                <span className="absolute left-5 top-5 rounded-full bg-white/92 px-3 py-1.5 text-xs font-semibold text-ink">{String(index + 1).padStart(2, "0")} · {review.region}</span>
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold tracking-[0.08em] text-gold-text">{review.region} · 실제 설치 후기</p>
                <h2 className="mt-3 text-[23px] font-semibold leading-snug tracking-[-0.03em] group-hover:underline group-hover:decoration-gold-deep group-hover:decoration-2 group-hover:underline-offset-4">{review.title}</h2>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
