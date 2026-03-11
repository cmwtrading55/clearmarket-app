export default function TradeLoading() {
  return (
    <div className="h-dvh bg-background flex flex-col overflow-hidden">
      {/* Header skeleton */}
      <div className="flex items-center h-14 px-4 bg-card border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="h-4 w-32 bg-surface rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-4 ml-6">
          <div className="h-8 w-20 bg-surface rounded animate-pulse" />
          <div className="h-8 w-16 bg-surface rounded animate-pulse" />
          <div className="h-8 w-16 bg-surface rounded animate-pulse" />
        </div>
        <div className="ml-auto h-8 w-28 bg-surface rounded-lg animate-pulse" />
      </div>

      {/* Body skeleton */}
      <div className="flex-1 grid grid-cols-[220px_1fr_320px] min-h-0">
        {/* Left sidebar */}
        <div className="border-r border-border p-3 space-y-3">
          <div className="h-4 w-16 bg-surface rounded animate-pulse" />
          <div className="h-8 bg-surface rounded animate-pulse" />
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 w-20 bg-surface rounded animate-pulse" />
                <div className="h-4 w-12 bg-surface rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Centre */}
        <div className="flex flex-col border-r border-border">
          <div className="flex-[6] bg-card border-b border-border p-3">
            <div className="h-full bg-surface rounded animate-pulse" />
          </div>
          <div className="flex-[4] p-3 space-y-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-4 bg-surface rounded animate-pulse" />
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col">
          <div className="p-3 space-y-3 border-b border-border">
            <div className="flex gap-0">
              <div className="flex-1 h-10 bg-buy/10 rounded-l animate-pulse" />
              <div className="flex-1 h-10 bg-surface rounded-r animate-pulse" />
            </div>
            <div className="h-8 bg-surface rounded animate-pulse" />
            <div className="h-10 bg-surface rounded animate-pulse" />
            <div className="h-10 bg-surface rounded animate-pulse" />
            <div className="h-10 bg-buy/20 rounded animate-pulse" />
          </div>
          <div className="flex-1 p-3 space-y-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-3 bg-surface rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
