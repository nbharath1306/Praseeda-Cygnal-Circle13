"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Save, Plus, Trash2, GripVertical,
  ExternalLink, ChevronDown, ChevronUp,
} from "lucide-react";
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, verticalListSortingStrategy, useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAdminPin } from "../layout";
import type { TeamMember, Link, LinkSection, SocialLink, ThemeId } from "@/data/types";
import { themes } from "@/lib/themes";

// ── Sortable link item ──────────────────────────────────────────
function SortableLink({
  link,
  onUpdate,
  onRemove,
}: {
  link: Link & { _id: string };
  onUpdate: (updated: Link & { _id: string }) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: link._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-bg-subtle rounded-xl border border-border-default"
    >
      <div className="flex items-center gap-2 p-3">
        <button {...attributes} {...listeners} className="cursor-grab text-text-tertiary hover:text-text-secondary">
          <GripVertical size={16} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary truncate">
            {link.label || "Untitled link"}
          </p>
        </div>
        <button onClick={() => setOpen(!open)} className="text-text-tertiary hover:text-text-secondary">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <button onClick={onRemove} className="text-text-tertiary hover:text-red-400">
          <Trash2 size={14} />
        </button>
      </div>

      {open && (
        <div className="px-3 pb-3 flex flex-col gap-2.5">
          <input
            placeholder="Label (e.g. LinkedIn)"
            value={link.label}
            onChange={(e) => onUpdate({ ...link, label: e.target.value })}
            className="input-field"
          />
          <input
            placeholder="URL"
            value={link.url}
            onChange={(e) => onUpdate({ ...link, url: e.target.value })}
            className="input-field"
          />
          <input
            placeholder="Description (optional)"
            value={link.description ?? ""}
            onChange={(e) => onUpdate({ ...link, description: e.target.value || undefined })}
            className="input-field"
          />
          <input
            placeholder="Icon name (e.g. Linkedin, Globe, Mail)"
            value={link.icon}
            onChange={(e) => onUpdate({ ...link, icon: e.target.value })}
            className="input-field"
          />
          <label className="flex items-center gap-2 text-xs text-text-secondary">
            <input
              type="checkbox"
              checked={link.isPrimary ?? false}
              onChange={(e) => onUpdate({ ...link, isPrimary: e.target.checked })}
              className="accent-accent-gold"
            />
            Primary link (highlighted)
          </label>
        </div>
      )}
    </div>
  );
}

// ── Main editor ─────────────────────────────────────────────────
export default function MemberEditor() {
  const params = useParams();
  const router = useRouter();
  const pin = useAdminPin();
  const slug = params.slug as string;

  const [member, setMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/members?slug=${slug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setMember)
      .finally(() => setLoading(false));
  }, [slug]);

  const save = useCallback(async () => {
    if (!member) return;
    setSaving(true);
    setSaved(false);
    await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-pin": pin },
      body: JSON.stringify(member),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [member, pin]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center text-text-tertiary text-sm">
        Loading...
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-dvh flex items-center justify-center text-text-secondary text-sm">
        Member not found
      </div>
    );
  }

  // ── Helpers ──────────────────────────────────────────────────
  const update = (partial: Partial<TeamMember>) =>
    setMember((m) => (m ? { ...m, ...partial } : m));

  const updateSocial = (index: number, social: SocialLink) => {
    const socials = [...member.socials];
    socials[index] = social;
    update({ socials });
  };

  const addSocial = () => {
    update({
      socials: [...member.socials, { platform: "", url: "", icon: "" }],
    });
  };

  const removeSocial = (index: number) => {
    update({ socials: member.socials.filter((_, i) => i !== index) });
  };

  const addSection = () => {
    update({
      sections: [
        ...member.sections,
        { id: `section-${Date.now()}`, title: "New Section", links: [] },
      ],
    });
  };

  const updateSection = (index: number, partial: Partial<LinkSection>) => {
    const sections = [...member.sections];
    sections[index] = { ...sections[index], ...partial };
    update({ sections });
  };

  const removeSection = (index: number) => {
    update({ sections: member.sections.filter((_, i) => i !== index) });
  };

  const addLink = (sectionIndex: number) => {
    const sections = [...member.sections];
    sections[sectionIndex].links.push({
      label: "",
      url: "",
      icon: "Link",
    });
    update({ sections });
  };

  const updateLink = (sectionIndex: number, linkIndex: number, link: Link) => {
    const sections = [...member.sections];
    sections[sectionIndex].links[linkIndex] = link;
    update({ sections });
  };

  const removeLink = (sectionIndex: number, linkIndex: number) => {
    const sections = [...member.sections];
    sections[sectionIndex].links.splice(linkIndex, 1);
    update({ sections });
  };

  const handleDragEnd = (sectionIndex: number) => (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const sections = [...member.sections];
    const links = sections[sectionIndex].links.map((l, i) => ({
      ...l,
      _id: `${sectionIndex}-${i}`,
    }));
    const oldIndex = links.findIndex((l) => l._id === active.id);
    const newIndex = links.findIndex((l) => l._id === over.id);
    const reordered = arrayMove(links, oldIndex, newIndex);
    // Strip _id before saving
    sections[sectionIndex].links = reordered.map(({ _id, ...rest }) => rest);
    update({ sections });
  };

  return (
    <div className="min-h-dvh max-w-[520px] mx-auto px-5 py-8 pb-32">
      {/* Top bar */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.push("/admin")}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-bg-elevated border border-border-default hover:border-border-hover text-text-secondary hover:text-text-primary transition-all"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-text-primary">
            {member.name || "Edit Member"}
          </h1>
          <p className="text-xs text-text-tertiary">
            {slug}.circle13.space
          </p>
        </div>
        <a
          href={`/${slug}`}
          target="_blank"
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-bg-elevated border border-border-default hover:border-border-hover text-text-secondary hover:text-text-primary transition-all"
        >
          <ExternalLink size={14} />
        </a>
      </div>

      <div className="flex flex-col gap-8">
        {/* ── Profile ──────────────────────────────────────────── */}
        <section className="admin-section">
          <h2 className="section-title">Profile</h2>
          <input
            placeholder="Name"
            value={member.name}
            onChange={(e) => update({ name: e.target.value })}
            className="input-field"
          />
          <input
            placeholder="Title (e.g. CEO & Founder)"
            value={member.title}
            onChange={(e) => update({ title: e.target.value })}
            className="input-field"
          />
          <input
            placeholder="Company"
            value={member.company}
            onChange={(e) => update({ company: e.target.value })}
            className="input-field"
          />
          <textarea
            placeholder="Bio"
            value={member.bio}
            onChange={(e) => update({ bio: e.target.value })}
            rows={2}
            className="input-field resize-none"
          />
          <input
            placeholder="Status badge (e.g. Building in public)"
            value={member.status ?? ""}
            onChange={(e) => update({ status: e.target.value || undefined })}
            className="input-field"
          />
          <input
            placeholder="Profile photo URL or path"
            value={member.photo}
            onChange={(e) => update({ photo: e.target.value })}
            className="input-field"
          />
          <input
            placeholder="Cover photo URL or path"
            value={member.coverPhoto ?? ""}
            onChange={(e) => update({ coverPhoto: e.target.value || undefined })}
            className="input-field"
          />
        </section>

        {/* ── Theme ─────────────────────────────────────────── */}
        <section className="admin-section">
          <h2 className="section-title">Theme</h2>
          <div className="grid grid-cols-4 gap-2">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => update({ theme: t.id as ThemeId })}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                  (member.theme ?? "noir") === t.id
                    ? "border-accent-gold bg-accent-gold-muted"
                    : "border-border-default hover:border-border-hover"
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full ring-2 ring-border-default"
                  style={{ backgroundColor: t.preview }}
                />
                <span className="text-[10px] text-text-secondary font-medium">
                  {t.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Socials ──────────────────────────────────────────── */}
        <section className="admin-section">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Social Icons</h2>
            <button onClick={addSocial} className="add-btn">
              <Plus size={14} /> Add
            </button>
          </div>
          {member.socials.map((social, i) => (
            <div key={i} className="flex gap-2">
              <input
                placeholder="Platform"
                value={social.platform}
                onChange={(e) => updateSocial(i, { ...social, platform: e.target.value })}
                className="input-field flex-1"
              />
              <input
                placeholder="URL"
                value={social.url}
                onChange={(e) => updateSocial(i, { ...social, url: e.target.value })}
                className="input-field flex-[2]"
              />
              <input
                placeholder="Icon"
                value={social.icon}
                onChange={(e) => updateSocial(i, { ...social, icon: e.target.value })}
                className="input-field w-24"
              />
              <button onClick={() => removeSocial(i)} className="text-text-tertiary hover:text-red-400 shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </section>

        {/* ── Link Sections ────────────────────────────────────── */}
        {member.sections.map((section, si) => (
          <section key={section.id} className="admin-section">
            <div className="flex items-center gap-2">
              <input
                value={section.title}
                onChange={(e) => updateSection(si, { title: e.target.value })}
                className="input-field flex-1 font-semibold"
              />
              <button onClick={() => removeSection(si)} className="text-text-tertiary hover:text-red-400">
                <Trash2 size={14} />
              </button>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd(si)}
            >
              <SortableContext
                items={section.links.map((_, li) => `${si}-${li}`)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-2">
                  {section.links.map((link, li) => (
                    <SortableLink
                      key={`${si}-${li}`}
                      link={{ ...link, _id: `${si}-${li}` }}
                      onUpdate={(updated) => {
                        const { _id, ...rest } = updated;
                        updateLink(si, li, rest);
                      }}
                      onRemove={() => removeLink(si, li)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <button onClick={() => addLink(si)} className="add-btn w-full justify-center">
              <Plus size={14} /> Add Link
            </button>
          </section>
        ))}

        <button onClick={addSection} className="add-btn w-full justify-center py-3">
          <Plus size={14} /> Add Section
        </button>
      </div>

      {/* ── Sticky save bar ──────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-bg-primary via-bg-primary to-transparent">
        <div className="max-w-[520px] mx-auto">
          <button
            onClick={save}
            disabled={saving}
            className="w-full py-3.5 rounded-2xl bg-accent-gold text-bg-primary font-semibold text-sm hover:bg-accent-gold-hover disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {saving ? (
              "Saving..."
            ) : saved ? (
              "Saved!"
            ) : (
              <>
                <Save size={16} /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
