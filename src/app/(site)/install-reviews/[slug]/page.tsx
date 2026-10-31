import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getInstallReview, installReviews } from "@/lib/installReviews";
import { jsonLdString } from "@/lib/jsonld";

export function generateStaticParams() { return installReviews.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: PageProps<"/install-reviews/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const review = getInstallReview(slug);
  return review
    ? {
        title: `${review.region} 설치 후기 | 슬기로운 낭만지기`,
        description: review.summary,
        alternates: { canonical: `/install-reviews/${slug}` },
        openGraph: {
          type: "article",
          title: `${review.region} ${review.facilityType} 설치 후기 | 슬기로운 낭만지기`,
          description: review.summary,
          images: [{ url: review.photos[0].src, alt: review.photos[0].alt }],
        },
      }
    : {};
}
export default async function InstallReviewDetailPage({ params }: PageProps<"/install-reviews/[slug]">) {
  const { slug } = await params; const review = getInstallReview(slug); if (!review) notFound();
  const pageUrl = `https://seulnang.co.kr/install-reviews/${review.slug}`;
  const imageObjects = review.photos.map((photo, index) => ({
    "@type": "ImageObject",
    "@id": `${pageUrl}#image-${index + 1}`,
    name: photo.title,
    description: photo.caption,
    contentUrl: `https://seulnang.co.kr${photo.src}`,
    url: `https://seulnang.co.kr${photo.src}`,
    representativeOfPage: index === 0,
    caption: photo.caption,
  }));
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: `${review.region} ${review.facilityType} 실제 설치 후기`,
        description: review.summary,
        datePublished: review.date.replaceAll(".", "-").replace(/-$/, ""),
        dateModified: review.date.replaceAll(".", "-").replace(/-$/, ""),
        mainEntityOfPage: pageUrl,
        image: imageObjects.map((image) => ({ "@id": image["@id"] })),
        author: { "@id": "https://seulnang.co.kr/#organization" },
        publisher: { "@id": "https://seulnang.co.kr/#organization" },
        about: { "@id": `${pageUrl}#service` },
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: "슬낭 무인관제 및 슬기로운 낭만지기 키오스크 설치",
        description: `${review.region} ${review.facilityType}에 적용한 ${review.installation}`,
        serviceType: "호텔 무인관제 및 키오스크 운영 지원",
        provider: { "@id": "https://seulnang.co.kr/#organization" },
        areaServed: { "@type": "AdministrativeArea", name: review.region },
      },
      ...imageObjects,
    ],
  };
  return <main><article>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(structuredData) }} />
    <header className="bg-cream px-5 py-16 md:px-8 md:py-24"><div className="mx-auto max-w-4xl"><Link href="/install-reviews" className="text-sm text-muted underline underline-offset-4">← 설치 후기 전체 보기</Link><p className="mt-10 text-sm font-semibold tracking-[0.08em] text-gold-text">{review.region} · 실제 설치 후기</p><h1 className="mt-4 text-[34px] font-semibold leading-[1.3] tracking-[-0.04em] md:text-[52px]">{review.originalTitle}</h1></div></header>
    <section className="mx-auto max-w-4xl px-5 py-14 md:px-8 md:py-20"><div className="grid gap-6 md:grid-cols-2">{review.photos.map((photo) => <figure key={photo.src}><div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-ink"><Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="(min-width: 768px) 36rem, 100vw" /></div><figcaption className="mt-3 text-sm leading-6 text-muted">{photo.caption}</figcaption></figure>)}</div><p className="mt-10 text-xs font-semibold tracking-[0.08em] text-gold-text">{review.region} / {review.installationType}</p><div className="mt-5 max-w-3xl space-y-6 text-[17px] leading-8">{review.originalBody.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><a href={review.sourceUrl} target="_blank" rel="noreferrer" className="mt-8 inline-flex text-sm font-semibold underline decoration-gold-deep decoration-2 underline-offset-4">네이버 카페 원문 보기 <span aria-hidden className="ml-2">↗</span></a></section>
  </article></main>;
}
