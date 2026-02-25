"use client";

import { Search } from "lucide-react";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  region: string;
  onRegionChange: (v: string) => void;
  type: string;
  onTypeChange: (v: string) => void;
  sort: string;
  onSortChange: (v: string) => void;
}

const selectClass =
  "bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50";

export default function GrowerFilters({
  search, onSearchChange,
  region, onRegionChange,
  type, onTypeChange,
  sort, onSortChange,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search growers..."
          className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted/50 focus:outline-none focus:border-primary/50"
        />
      </div>
      <select value={region} onChange={(e) => onRegionChange(e.target.value)} className={selectClass}>
        <option value="">All Regions</option>
        <option value="North America">North America</option>
        <option value="Europe">Europe</option>
        <option value="Caribbean">Caribbean</option>
      </select>
      <select value={type} onChange={(e) => onTypeChange(e.target.value)} className={selectClass}>
        <option value="">All Types</option>
        <option value="indoor">Indoor</option>
        <option value="outdoor">Outdoor</option>
        <option value="greenhouse">Greenhouse</option>
      </select>
      <select value={sort} onChange={(e) => onSortChange(e.target.value)} className={selectClass}>
        <option value="trust">Trust Score</option>
        <option value="rating">Rating</option>
        <option value="batches">Batch Count</option>
        <option value="volume">Volume</option>
      </select>
    </div>
  );
}
