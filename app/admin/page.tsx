"use client";

import { useEffect, useState, useCallback } from "react";
import { useWallet } from "@/lib/wallet";
import { supabase } from "@/lib/supabase";
import { CLEARMARKET_WALLET } from "@/lib/helius";
import { SUPABASE_URL } from "@/lib/config";
import { verifyMilestone } from "@/lib/escrow";
import type { EscrowAccount, EscrowMilestone } from "@/lib/escrow";
import type { LaunchpadListing } from "@/lib/types";
import {
  ShieldCheck,
  ShieldX,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  LayoutDashboard,
  FileCheck,
  Milestone as MilestoneIcon,
  Banknote,
  ExternalLink,
  AlertTriangle,
  Users,
  TrendingUp,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Admin wallet allow-list
// ---------------------------------------------------------------------------
const ADMIN_WALLETS = [CLEARMARKET_WALLET];

type Tab = "pending" | "funding" | "milestones" | "settlements";

// ---------------------------------------------------------------------------
// Extended types for joined queries
// ---------------------------------------------------------------------------
interface MilestoneWithContext extends EscrowMilestone {
  escrow_accounts?: {
    id: string;
    listing_id: string;
    total_deposited: number;
    status: string;
    launchpad_listings?: {
      grower_name: string | null;
      commodity_type: string;
      token_symbol: string | null;
    };
  };
}

interface SettlementRecord extends EscrowAccount {
  launchpad_listings?: {
    grower_name: string | null;
    commodity_type: string;
    token_symbol: string | null;
    funding_target: number | null;
  };
  milestone_summary?: {
    total: number;
    released: number;
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function statusBadge(status: string) {
  const colours: Record<string, string> = {
    pending_review: "bg-yellow-500/20 text-yellow-400",
    approved: "bg-green-500/20 text-green-400",
    rejected: "bg-red-500/20 text-red-400",
    funding: "bg-blue-500/20 text-blue-400",
    pending: "bg-yellow-500/20 text-yellow-400",
    verified: "bg-cyan-500/20 text-cyan-400",
    released: "bg-green-500/20 text-green-400",
    disputed: "bg-red-500/20 text-red-400",
    open: "bg-blue-500/20 text-blue-400",
    funded: "bg-emerald-500/20 text-emerald-400",
    releasing: "bg-purple-500/20 text-purple-400",
    settled: "bg-green-500/20 text-green-400",
    cancelled: "bg-zinc-500/20 text-zinc-400",
    distributed: "bg-green-500/20 text-green-400",
  };
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ${colours[status] ?? "bg-zinc-500/20 text-zinc-400"}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

function formatUsd(n: number | null | undefined): string {
  if (n == null) return "$0";
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function progressBar(raised: number, target: number | null) {
  const t = target ?? 1;
  const pct = Math.min((raised / t) * 100, 100);
  return (
    <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
      <div
        className="h-full bg-primary rounded-full transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main admin page component
// ---------------------------------------------------------------------------
export default function AdminPage() {
  const { connected, address } = useWallet();
  const [tab, setTab] = useState<Tab>("pending");

  const isAdmin = connected && address && ADMIN_WALLETS.includes(address);

  // ------- Access denied view -------
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="bg-card-bg border border-border rounded-xl p-8 max-w-md text-center space-y-4">
          <ShieldX className="w-12 h-12 text-red-400 mx-auto" />
          <h1 className="text-xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted text-sm">
            Connect an admin wallet to access the ClearMarket admin panel.
          </p>
          {connected && address && (
            <p className="text-muted text-xs font-mono break-all">
              Connected: {address}
            </p>
          )}
        </div>
      </div>
    );
  }

  // ------- Authenticated admin view -------
  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "pending", label: "Pending Listings", icon: <Clock className="w-4 h-4" /> },
    { key: "funding", label: "Active Funding", icon: <TrendingUp className="w-4 h-4" /> },
    { key: "milestones", label: "Milestones", icon: <FileCheck className="w-4 h-4" /> },
    { key: "settlements", label: "Settlements", icon: <Banknote className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card-bg/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-bold text-foreground">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            <span className="text-xs text-muted font-mono">
              {address?.slice(0, 4)}...{address?.slice(-4)}
            </span>
          </div>
        </div>
      </header>

      {/* Tab navigation */}
      <nav className="border-b border-border bg-card-bg/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                tab === t.key
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted hover:text-foreground hover:border-zinc-600"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Tab content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {tab === "pending" && <PendingListingsTab adminWallet={address!} />}
        {tab === "funding" && <ActiveFundingTab />}
        {tab === "milestones" && <MilestonesTab adminWallet={address!} />}
        {tab === "settlements" && <SettlementsTab />}
      </main>
    </div>
  );
}

// ===========================================================================
// Tab 1: Pending Listings
// ===========================================================================
function PendingListingsTab({ adminWallet }: { adminWallet: string }) {
  const [listings, setListings] = useState<LaunchpadListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("launchpad_listings")
      .select("*")
      .eq("status", "pending_review")
      .order("created_at", { ascending: false });

    if (data) setListings(data as LaunchpadListing[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleAction(id: string, action: "approved" | "rejected") {
    setActionLoading(id);
    await supabase
      .from("launchpad_listings")
      .update({ status: action, updated_at: new Date().toISOString() })
      .eq("id", id);
    setListings((prev) => prev.filter((l) => l.id !== id));
    setActionLoading(null);
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (listings.length === 0) {
    return <EmptyState message="No pending listings to review." />;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">{listings.length} listing{listings.length !== 1 ? "s" : ""} awaiting review</p>
      <div className="grid gap-4">
        {listings.map((l) => (
          <div
            key={l.id}
            className="bg-card-bg border border-border rounded-xl p-5 flex flex-col lg:flex-row lg:items-center gap-4"
          >
            {/* Info */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground uppercase">
                  {l.commodity_type}
                </span>
                {statusBadge(l.status)}
                <span className="text-xs text-muted">Grade {l.risk_grade}</span>
              </div>
              <p className="text-foreground font-medium">
                {l.grower_name ?? "Unknown Grower"}
                {l.strain ? ` — ${l.strain}` : ""}
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-muted">
                <span>Target: {formatUsd(l.funding_target)}</span>
                <span>Oracle: {l.oracle_discount_pct.toFixed(1)}%</span>
                <span>Completeness: {l.completeness_score}%</span>
                {l.region && <span>Region: {l.region}</span>}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => handleAction(l.id, "approved")}
                disabled={actionLoading === l.id}
                className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {actionLoading === l.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                Approve
              </button>
              <button
                onClick={() => handleAction(l.id, "rejected")}
                disabled={actionLoading === l.id}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===========================================================================
// Tab 2: Active Funding
// ===========================================================================
function ActiveFundingTab() {
  const [listings, setListings] = useState<LaunchpadListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("launchpad_listings")
        .select("*")
        .in("status", ["approved", "funding"])
        .order("created_at", { ascending: false });

      if (data) setListings(data as LaunchpadListing[]);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (listings.length === 0) return <EmptyState message="No active funding rounds." />;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">{listings.length} active round{listings.length !== 1 ? "s" : ""}</p>
      <div className="grid gap-4 lg:grid-cols-2">
        {listings.map((l) => {
          const target = l.funding_target ?? 0;
          const pct = target > 0 ? ((l.funding_raised / target) * 100).toFixed(1) : "0";
          return (
            <div
              key={l.id}
              className="bg-card-bg border border-border rounded-xl p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground uppercase">
                    {l.commodity_type}
                  </span>
                  {statusBadge(l.status)}
                </div>
                <span className="text-xs text-muted">Grade {l.risk_grade}</span>
              </div>

              <p className="text-foreground font-medium">
                {l.grower_name ?? "Unknown Grower"}
                {l.token_symbol ? ` (${l.token_symbol})` : ""}
              </p>

              {/* Progress */}
              <div className="space-y-1">
                {progressBar(l.funding_raised, l.funding_target)}
                <div className="flex justify-between text-xs text-muted">
                  <span>{formatUsd(l.funding_raised)} raised</span>
                  <span>{pct}% of {formatUsd(target)}</span>
                </div>
              </div>

              {/* Investors */}
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Users className="w-3.5 h-3.5" />
                <span>{l.investor_count} investor{l.investor_count !== 1 ? "s" : ""}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ===========================================================================
// Tab 3: Milestones
// ===========================================================================
function MilestonesTab({ adminWallet }: { adminWallet: string }) {
  const [milestones, setMilestones] = useState<MilestoneWithContext[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("escrow_milestones")
      .select(
        "*, escrow_accounts!inner(id, listing_id, total_deposited, status, launchpad_listings(grower_name, commodity_type, token_symbol))"
      )
      .in("status", ["pending", "verified"])
      .order("created_at", { ascending: true });

    if (data) setMilestones(data as unknown as MilestoneWithContext[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleVerify(milestoneId: string) {
    setActionLoading(milestoneId);
    const success = await verifyMilestone(milestoneId, adminWallet);
    if (success) {
      setMilestones((prev) =>
        prev.map((m) =>
          m.id === milestoneId
            ? { ...m, status: "verified" as const, verified_at: new Date().toISOString(), verifier_wallet: adminWallet }
            : m
        )
      );
    }
    setActionLoading(null);
  }

  async function handleRelease(milestoneId: string, escrowId: string) {
    setActionLoading(milestoneId);
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/release-milestone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ milestone_id: milestoneId, escrow_id: escrowId }),
      });
      if (res.ok) {
        setMilestones((prev) => prev.filter((m) => m.id !== milestoneId));
      }
    } catch {
      // Silently fail, admin can retry
    }
    setActionLoading(null);
  }

  if (loading) return <LoadingSpinner />;
  if (milestones.length === 0) return <EmptyState message="No pending or verified milestones." />;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">{milestones.length} milestone{milestones.length !== 1 ? "s" : ""} requiring attention</p>
      <div className="grid gap-4">
        {milestones.map((m) => {
          const listing = m.escrow_accounts?.launchpad_listings;
          const escrow = m.escrow_accounts;
          return (
            <div
              key={m.id}
              className="bg-card-bg border border-border rounded-xl p-5 flex flex-col lg:flex-row lg:items-center gap-4"
            >
              {/* Info */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground uppercase">
                    {m.milestone_type}
                  </span>
                  {statusBadge(m.status)}
                  <span className="text-xs text-muted">{m.release_percent}% release</span>
                </div>
                <p className="text-foreground text-sm">
                  {listing?.grower_name ?? "Unknown"} &middot;{" "}
                  <span className="uppercase">{listing?.commodity_type ?? "unknown"}</span>
                  {listing?.token_symbol ? ` (${listing.token_symbol})` : ""}
                </p>
                {escrow && (
                  <p className="text-xs text-muted">
                    Escrow: {formatUsd(escrow.total_deposited)} deposited
                  </p>
                )}
                {m.evidence_url && (
                  <a
                    href={m.evidence_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View evidence
                  </a>
                )}
                {m.verified_at && (
                  <p className="text-xs text-muted">
                    Verified: {new Date(m.verified_at).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 shrink-0">
                {m.status === "pending" && (
                  <button
                    onClick={() => handleVerify(m.id)}
                    disabled={actionLoading === m.id}
                    className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    {actionLoading === m.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    Verify
                  </button>
                )}
                {m.status === "verified" && escrow && (
                  <button
                    onClick={() => handleRelease(m.id, escrow.id)}
                    disabled={actionLoading === m.id}
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    {actionLoading === m.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Banknote className="w-4 h-4" />
                    )}
                    Release
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ===========================================================================
// Tab 4: Settlements
// ===========================================================================
function SettlementsTab() {
  const [settlements, setSettlements] = useState<SettlementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("escrow_accounts")
        .select(
          "*, launchpad_listings(grower_name, commodity_type, token_symbol, funding_target)"
        )
        .in("status", ["settled", "releasing"])
        .order("created_at", { ascending: false });

      if (data) setSettlements(data as unknown as SettlementRecord[]);
      setLoading(false);
    }
    load();
  }, []);

  async function handleDistribute(escrowId: string) {
    setActionLoading(escrowId);
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/distribute-returns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ escrow_id: escrowId }),
      });
      if (res.ok) {
        setSettlements((prev) =>
          prev.map((s) =>
            s.id === escrowId ? { ...s, status: "settled" as const } : s
          )
        );
      }
    } catch {
      // Silently fail, admin can retry
    }
    setActionLoading(null);
  }

  if (loading) return <LoadingSpinner />;
  if (settlements.length === 0) return <EmptyState message="No settlements to process." />;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">{settlements.length} settlement{settlements.length !== 1 ? "s" : ""}</p>
      <div className="grid gap-4">
        {settlements.map((s) => {
          const listing = s.launchpad_listings;
          const releasePct =
            s.total_deposited > 0
              ? ((s.total_released / s.total_deposited) * 100).toFixed(1)
              : "0";
          return (
            <div
              key={s.id}
              className="bg-card-bg border border-border rounded-xl p-5 flex flex-col lg:flex-row lg:items-center gap-4"
            >
              {/* Info */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  {statusBadge(s.status)}
                  <span className="text-sm font-semibold text-foreground uppercase">
                    {listing?.commodity_type ?? "unknown"}
                  </span>
                  {listing?.token_symbol && (
                    <span className="text-xs text-muted">{listing.token_symbol}</span>
                  )}
                </div>
                <p className="text-foreground text-sm">
                  {listing?.grower_name ?? "Unknown Grower"}
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-muted">
                  <span>Deposited: {formatUsd(s.total_deposited)}</span>
                  <span>Released: {formatUsd(s.total_released)} ({releasePct}%)</span>
                  <span>Target: {formatUsd(listing?.funding_target)}</span>
                </div>
                {/* Progress */}
                <div className="pt-1">
                  {progressBar(s.total_released, s.total_deposited)}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 shrink-0">
                {s.status === "settled" && (
                  <button
                    onClick={() => handleDistribute(s.id)}
                    disabled={actionLoading === s.id}
                    className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/80 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    {actionLoading === s.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Banknote className="w-4 h-4" />
                    )}
                    Distribute Returns
                  </button>
                )}
                {s.status === "releasing" && (
                  <span className="flex items-center gap-1.5 px-4 py-2 text-yellow-400 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    Milestones in progress
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ===========================================================================
// Shared UI atoms
// ===========================================================================
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="w-6 h-6 text-primary animate-spin" />
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted space-y-2">
      <CheckCircle2 className="w-8 h-8 text-green-500/50" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
