export default function SectionHeader({
  index,
  title,
  count,
}: {
  index: string;
  title: string;
  count?: number;
}) {
  return (
    <div className="flex items-end justify-between gap-3 border-b-2 border-[var(--border-color)] mb-5 pb-2">
      <div className="flex items-baseline gap-3 min-w-0">
        <span className="font-serif font-bold text-3xl leading-none opacity-25 select-none" aria-hidden>
          {index}
        </span>
        <h3 className="text-base sm:text-lg font-bold uppercase tracking-widest leading-tight">
          {title}
        </h3>
      </div>
      {count !== undefined && (
        <span className="shrink-0 text-xs font-bold border-2 border-[var(--border-color)] px-2 py-0.5">
          {String(count).padStart(2, "0")}
        </span>
      )}
    </div>
  );
}
