"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, User, ChevronRight } from "lucide-react";
import { useAdminPin } from "./layout";
import type { TeamMember } from "@/data/types";

export default function AdminHome() {
  const pin = useAdminPin();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newSlug, setNewSlug] = useState("");
  const [newName, setNewName] = useState("");

  useEffect(() => {
    fetch("/api/members")
      .then((r) => r.json())
      .then(setMembers)
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlug || !newName) return;

    const member: TeamMember = {
      slug: newSlug.toLowerCase().replace(/[^a-z0-9-]/g, ""),
      name: newName,
      title: "",
      company: "Circle13",
      bio: "",
      photo: "",
      socials: [],
      sections: [],
    };

    await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-pin": pin },
      body: JSON.stringify(member),
    });

    window.location.href = `/admin/${member.slug}`;
  };

  return (
    <div className="min-h-dvh max-w-[520px] mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl text-text-primary">
            Team
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage your team&apos;s link pages
          </p>
        </div>
        <button
          onClick={() => setShowNew(!showNew)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-accent-gold text-bg-primary hover:bg-accent-gold-hover transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* New member form */}
      {showNew && (
        <form
          onSubmit={handleCreate}
          className="mb-8 p-5 rounded-2xl bg-bg-elevated border border-border-default flex flex-col gap-4"
        >
          <h2 className="text-sm font-semibold text-text-primary">
            Add team member
          </h2>
          <input
            type="text"
            placeholder="Name (e.g. N Bharath)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full py-2.5 px-4 rounded-xl bg-bg-subtle border border-border-default focus:border-accent-gold/40 focus:outline-none text-sm text-text-primary placeholder:text-text-tertiary"
          />
          <input
            type="text"
            placeholder="Slug (e.g. bharath — becomes bharath.circle13.space)"
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value)}
            className="w-full py-2.5 px-4 rounded-xl bg-bg-subtle border border-border-default focus:border-accent-gold/40 focus:outline-none text-sm text-text-primary placeholder:text-text-tertiary"
          />
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-accent-gold text-bg-primary font-semibold text-sm hover:bg-accent-gold-hover transition-colors"
          >
            Create
          </button>
        </form>
      )}

      {/* Members list */}
      {loading ? (
        <div className="text-text-tertiary text-sm text-center py-12">
          Loading...
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-16">
          <User size={32} className="text-text-tertiary mx-auto mb-3" />
          <p className="text-text-secondary text-sm">No team members yet</p>
          <p className="text-text-tertiary text-xs mt-1">
            Click + to add your first member
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {members.map((m) => (
            <Link
              key={m.slug}
              href={`/admin/${m.slug}`}
              className="group flex items-center gap-4 p-4 rounded-2xl bg-bg-elevated border border-border-default hover:border-border-hover hover:bg-bg-subtle transition-all"
            >
              {m.photo ? (
                <img
                  src={m.photo}
                  alt={m.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-border-default"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-bg-subtle flex items-center justify-center ring-2 ring-border-default">
                  <User size={20} className="text-text-tertiary" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-text-primary truncate">
                  {m.name}
                </p>
                <p className="text-[13px] text-text-tertiary">
                  {m.slug}.circle13.space
                </p>
              </div>
              <ChevronRight
                size={16}
                className="text-text-tertiary group-hover:text-text-secondary transition-colors"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
