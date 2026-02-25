"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleCallback() {
      try {
        const { error } = await supabase.auth.getSession();
        if (error) {
          setError(error.message);
          return;
        }

        // Redirect to stored destination or default
        const destination = sessionStorage.getItem("cml-auth-redirect") || "/";
        sessionStorage.removeItem("cml-auth-redirect");
        router.replace(destination);
      } catch (err) {
        setError("Authentication failed. Please try again.");
        console.error("Auth callback error:", err);
      }
    }

    handleCallback();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-red-400 text-sm">{error}</p>
          <button
            onClick={() => router.replace("/")}
            className="text-sm text-primary hover:underline"
          >
            Return home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted">Signing you in...</p>
      </div>
    </div>
  );
}
