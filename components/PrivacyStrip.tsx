export function PrivacyStrip() {
  return (
    <div className="flex flex-wrap justify-center gap-6 font-mono text-xs text-text-secondary">
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
      className="inline-block h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_6px_rgba(124,255,178,0.6)]"
      aria-hidden
    />
  );
}
