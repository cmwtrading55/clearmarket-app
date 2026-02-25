"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, Settings, Shield, LogOut, ChevronDown } from "lucide-react";
import { useWallet } from "@/lib/wallet";

interface Props {
  onDisconnect: () => void;
}

export default function ProfileDropdown({ onDisconnect }: Props) {
  const [open, setOpen] = useState(false);
  const { address, provider } = useWallet();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const shortAddr = address ? `${address.slice(0, 4)}...${address.slice(-4)}` : "";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:border-primary/40 transition-colors"
      >
        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
          <User size={14} className="text-primary" />
        </div>
        <span className="text-xs font-mono text-foreground">{shortAddr}</span>
        <ChevronDown size={14} className={`text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-card-bg border border-border rounded-xl shadow-xl overflow-hidden z-50">
          <div className="p-3 border-b border-border">
            <p className="text-xs text-muted capitalize">{provider}</p>
            <p className="text-xs font-mono text-foreground truncate">{address}</p>
          </div>
          <div className="py-1">
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-primary/5 transition-colors"
            >
              <Settings size={16} className="text-muted" />
              Account
            </Link>
            <Link
              href="/verification"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-primary/5 transition-colors"
            >
              <Shield size={16} className="text-muted" />
              Verification
            </Link>
          </div>
          <div className="border-t border-border py-1">
            <button
              onClick={() => {
                onDisconnect();
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-400/5 transition-colors"
            >
              <LogOut size={16} />
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
