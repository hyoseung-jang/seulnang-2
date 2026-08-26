import { REVIEWS } from "@/lib/site";

export function ReviewMarquee() {
  const items = [...REVIEWS, ...REVIEWS];

  return (
    <div className="overflow-hidden">
      <div className="animate-marquee-slow flex w-max gap-4 pr-4">
        {items.map((review, index) => (
          <article
            key={`${review.hotel}-${index}`}
            className="w-[280px] shrink-0 rounded-2xl bg-gradient-to-b from-white/60 to-cream p-5 md:w-[320px]"
          >
            <p className="text-[15px] leading-6">&ldquo;{review.quote}&rdquo;</p>
            <p className="mt-4 text-sm text-muted">{review.hotel}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
