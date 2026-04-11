export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-[var(--radius)] bg-[rgba(27,67,50,0.06)] ${className}`} />
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-warm-sm border border-[var(--border-default)]">
      <Skeleton className="h-3 w-20 mb-3" />
      <Skeleton className="h-8 w-16 mb-1" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-warm-sm border border-[var(--border-default)] animate-fadeIn">
      <Skeleton className="h-4 w-32 mb-3" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-3 mb-2 ${i === lines - 1 ? "w-3/4" : "w-full"}`} />
      ))}
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <div className="flex gap-4 py-3 px-4 border-b border-gray-100">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className={`h-4 ${i === 0 ? "w-32" : "w-16"}`} />
      ))}
    </div>
  );
}
