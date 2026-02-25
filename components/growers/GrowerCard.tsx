import Link from "next/link";
import type { Grower } from "@/lib/types";
import { MapPin, Star, CheckCircle, Leaf } from "lucide-react";

interface Props {
  grower: Grower;
  selected?: boolean;
  onToggleCompare?: (id: string) => void;
}

export default function GrowerCard({ grower, selected, onToggleCompare }: Props) {
  return (
    <div className="bg-card-bg border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
      <div className="flex items-start gap-4">
        <img
          src={grower.avatar}
          alt={grower.name}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground truncate">{grower.name}</h3>
            {grower.verified && (
              <CheckCircle size={14} className="text-primary shrink-0" />
            )}
          </div>
          <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
            <MapPin size={12} /> {grower.location}
          </p>
        </div>
        {onToggleCompare && (
          <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={selected}
              onChange={() => onToggleCompare(grower.id)}
              className="w-3.5 h-3.5 rounded border-border accent-primary"
            />
            <span className="text-xs text-muted">Compare</span>
          </label>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4">
        <div>
          <p className="text-xs text-muted">Rating</p>
          <p className="text-sm font-medium text-foreground flex items-center gap-1">
            <Star size={12} className="text-warning" />
            {grower.rating}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted">Trust</p>
          <p className="text-sm font-medium text-foreground">{grower.trustScore}%</p>
        </div>
        <div>
          <p className="text-xs text-muted">Batches</p>
          <p className="text-sm font-medium text-foreground">{grower.batchCount}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {grower.specialities.slice(0, 3).map((s) => (
          <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-primary/5 text-primary border border-primary/10">
            {s}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
        <span className="text-xs text-muted capitalize flex items-center gap-1">
          <Leaf size={12} /> {grower.type}
        </span>
        <Link
          href={`/growers/${grower.id}`}
          className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
