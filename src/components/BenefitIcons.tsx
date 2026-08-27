type IconProps = {
  className?: string;
};

export function IconSave({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <circle cx="24" cy="24" r="18" className="fill-gold" />
      <path
        d="M24 14.5v19M20.2 18.2c1.1-1.1 2.4-1.6 3.8-1.6 2.6 0 4.4 1.5 4.4 3.6 0 2.3-1.9 3.4-4.7 4.1-2.6.6-3.8 1.5-3.8 3.1 0 1.6 1.5 2.8 4 2.8 1.6 0 3-.5 4.1-1.5"
        className="stroke-ink"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconRest({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <rect x="7" y="18" width="34" height="16" rx="4" className="fill-gold" />
      <path
        d="M11 18v-2.2c0-2 1.6-3.6 3.6-3.6H22"
        className="stroke-ink"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path
        d="M11 34v2.5M37 34v2.5"
        className="stroke-ink"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path
        d="M16 26h7M16 29.5h4"
        className="stroke-ink"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconFlex({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <rect x="8" y="10" width="32" height="28" rx="6" className="fill-gold" />
      <path
        d="M16 18h16M16 24h10M16 30h7"
        className="stroke-ink"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path
        d="M31 27.5v5.2M28.4 30.1 31 32.7l2.6-2.6"
        className="stroke-ink"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
