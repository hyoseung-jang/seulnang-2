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
      ? "bg-brown text-white"
      : "bg-gold text-ink";

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-3 rounded-[14px] px-6 py-4 text-[15px] font-medium transition duration-200 hover:brightness-105 ${styles}`}
    >
      {children}
      <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-ink">↗</span>
    </Link>
  );
}
