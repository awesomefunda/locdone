import { cn } from '@/lib/utils';

type BrandMarkProps = {
  size?: number;
  className?: string;
};

/**
 * Locdone brand mark — document with a signal-green checkmark badge.
 * "Local processing. Done." compressed into one glyph.
 *
 * Designed to read cleanly at 20–28 px display size.
 */
export function BrandMark({ size = 26, className }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn('shrink-0', className)}
    >
      {/* Background */}
      <rect width="32" height="32" rx="7.5" fill="#0E0E10" />

      {/* Document body */}
      <path
        d="M5 3.5 L17.5 3.5 L22.5 8.5 L22.5 27.5 L5 27.5 Z"
        fill="#1C1C21"
      />
      {/* Fold crease */}
      <path
        d="M17.5 3.5 L17.5 8.5 L22.5 8.5"
        stroke="#2E2E3A"
        strokeWidth="0.8"
      />
      {/* Document outline */}
      <path
        d="M5 3.5 L17.5 3.5 L22.5 8.5 L22.5 27.5 L5 27.5 Z"
        stroke="#363643"
        strokeWidth="0.75"
      />

      {/* Content lines */}
      <rect x="7.5" y="13"   width="12.5" height="1.75" rx="0.875" fill="#4A4A58" />
      <rect x="7.5" y="16.5" width="12.5" height="1.75" rx="0.875" fill="#4A4A58" />
      <rect x="7.5" y="20"   width="7.5"  height="1.75" rx="0.875" fill="#4A4A58" />

      {/* Green badge — dark separator ring then accent fill */}
      <circle cx="25" cy="25" r="8"   fill="#0E0E10" />
      <circle cx="25" cy="25" r="6.2" fill="#7CFFB2" />

      {/* Checkmark */}
      <path
        d="M22.4 25 L24.2 26.9 L27.6 23.1"
        stroke="#0C0C0E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
