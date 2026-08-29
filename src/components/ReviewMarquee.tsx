import { REVIEWS } from "@/lib/site";

type Review = (typeof REVIEWS)[number];

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="flex w-[300px] shrink-0 flex-col rounded-3xl border border-black/[0.06] bg-white p-6 shadow-[0_10px_34px_rgba(46,21,4,0.07)] md:w-[340px]">
      <span
        className="font-display text-[30px] font-black leading-none text-gold-deep"
        aria-hidden
      >
        &ldquo;
      </span>
      <p className="mt-2 text-left text-[15px] leading-[1.7]">{review.quote}</p>
      <p className="mt-auto pt-5 text-left text-[13px] font-semibold text-gold-text">
        {review.hotel} 사장님
      </p>
    </article>
  );
}

/* 상·하 두 줄이 서로 반대 방향으로 흐르는 후기 마퀴 — 호버 시 일시정지 */
export function ReviewMarquee() {
  const reversed = [...REVIEWS].reverse();
  const rowA = [...REVIEWS, ...REVIEWS];
  const rowB = [...reversed, ...reversed];

  return (
    <div className="marquee-pause marquee-mask space-y-4 overflow-hidden">
      <div className="animate-marquee-slow flex w-max items-stretch gap-4 pr-4">
        {rowA.map((review, index) => (
          <ReviewCard key={`a-${review.hotel}-${index}`} review={review} />
        ))}
      </div>
      <div className="animate-marquee-slower marquee-reverse flex w-max items-stretch gap-4 pr-4">
        {rowB.map((review, index) => (
          <ReviewCard key={`b-${review.hotel}-${index}`} review={review} />
        ))}
      </div>
    </div>
  );
}
