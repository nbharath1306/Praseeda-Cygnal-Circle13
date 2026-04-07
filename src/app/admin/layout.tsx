"use client";

import { useState, useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pin, setPin] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check if PIN is stored in sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("admin-pin");
    if (stored) {
      setPin(stored);
      setAuthenticated(true);
    }
    setChecking(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    // Verify PIN by making a test API call
    const res = await fetch("/api/members", {
      headers: { "x-admin-pin": pin },
    });

    if (res.ok) {
      sessionStorage.setItem("admin-pin", pin);
      setAuthenticated(true);
    } else {
      setError(true);
    }
  };

  if (checking) return null;

  if (!authenticated) {
    return (
      <div className="min-h-dvh flex items-center justify-center px-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[320px] flex flex-col items-center gap-6"
        >
          <div className="text-center">
            <h1 className="font-[family-name:var(--font-display)] text-2xl text-text-primary">
              Circle13 Admin
            </h1>
            <p className="text-sm text-text-secondary mt-2">
              Enter PIN to continue
            </p>
          </div>

          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="PIN"
            autoFocus
            className="w-full text-center text-2xl tracking-[0.3em] py-3 px-4 rounded-xl bg-bg-elevated border border-border-default focus:border-accent-gold/40 focus:outline-none text-text-primary placeholder:text-text-tertiary transition-colors"
          />

          {error && (
            <p className="text-red-400 text-sm">Wrong PIN. Try again.</p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-accent-gold text-bg-primary font-semibold text-sm hover:bg-accent-gold-hover transition-colors"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  // Provide PIN to child components via a hidden input trick,
  // or we pass it through context. Let's use a simple approach.
  return (
    <AdminPinContext.Provider value={pin}>{children}</AdminPinContext.Provider>
  );
}

// Simple context to share PIN with child pages
import { createContext, useContext } from "react";

export const AdminPinContext = createContext<string>("");
export function useAdminPin() {
  return useContext(AdminPinContext);
}
