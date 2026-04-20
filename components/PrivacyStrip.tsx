export function PrivacyStrip() {
  return (
    <div className="flex flex-wrap justify-center gap-8 font-mono text-xs text-text-tertiary">
      <span className="flex items-center gap-2">
        <Dot />0 uploads
      </span>
      <span className="flex items-center gap-2">
        <Dot />0 accounts
      </span>
      <span className="flex items-center gap-2">
        <Dot />0 tracking
      </span>
    </div>
  );
}

function Dot() {
  return (
    <span
      className="inline-block h-1.5 w-1.5 animate-pulse-soft rounded-full bg-accent shadow-[0_0_5px_rgba(124,255,178,0.5)]"
      aria-hidden
    />
  );
}
