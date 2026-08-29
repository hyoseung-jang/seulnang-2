import Link from "next/link";
import { LINKS } from "@/lib/site";

type CtaButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "gold" | "dark";
};

export function CtaButton({
  href = LINKS.contact,
  children,
  variant = "gold",
}: CtaButtonProps) {
  const styles =
    variant === "dark"
      ? "bg-brown text-white shadow-[0_14px_36px_rgba(46,21,4,0.28)]"
      : "bg-gold text-ink shadow-[0_14px_36px_rgba(199,149,0,0.32)] hover:bg-gold-bright";

  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 rounded-[16px] px-7 py-4 text-[15px] font-bold transition duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] md:text-[16px] ${styles}`}
    >
      {children}
      <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-sm text-ink transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        ↗
      </span>
    </Link>
  );
}
