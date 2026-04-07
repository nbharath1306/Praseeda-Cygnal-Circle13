import type { TeamMember } from "@/data/types";
import praseedaData from "@/data/praseeda";

/**
 * Data layer — reads from local JSON files.
 * Admin saves commit to GitHub via API → triggers Vercel rebuild.
 *
 * No external database needed.
 */

const LOCAL_MEMBERS: Record<string, TeamMember> = {
  praseeda: praseedaData,
};

export async function getMember(slug: string): Promise<TeamMember | null> {
  return LOCAL_MEMBERS[slug] ?? null;
}

export async function getAllSlugs(): Promise<string[]> {
  return Object.keys(LOCAL_MEMBERS);
}

export async function getAllMembers(): Promise<TeamMember[]> {
  return Object.values(LOCAL_MEMBERS);
}

// ── GitHub API helpers (used by admin to persist changes) ──────

const REPO = process.env.GITHUB_REPO ?? "nbharath1306/Praseeda-Cygnal-Circle13";
const BRANCH = process.env.GITHUB_BRANCH ?? "main";

function githubHeaders() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN env var is not set.");
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };
}

/**
 * Save a team member by committing their JSON file to GitHub.
 * This triggers a Vercel rebuild automatically.
 */
export async function saveMemberToGitHub(member: TeamMember): Promise<void> {
  const path = `src/data/${member.slug}.ts`;
  const content = `import { TeamMember } from "./types";\n\nconst ${member.slug}: TeamMember = ${JSON.stringify(member, null, 2)};\n\nexport default ${member.slug};\n`;

  // Get current file SHA (needed for updates)
  let sha: string | undefined;
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`,
      { headers: githubHeaders() }
    );
    if (res.ok) {
      const data = await res.json();
      sha = data.sha;
    }
  } catch {
    // File doesn't exist yet, that's fine
  }

  // Also update team.ts to include the new member
  await updateTeamRegistry(member.slug);

  // Commit the member file
  await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    method: "PUT",
    headers: githubHeaders(),
    body: JSON.stringify({
      message: `Update ${member.name} (${member.slug})`,
      content: Buffer.from(content).toString("base64"),
      branch: BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });
}

/**
 * Update src/data/team.ts to import all members.
 */
async function updateTeamRegistry(newSlug: string): Promise<void> {
  const path = "src/data/team.ts";

  // Get current team.ts
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`,
    { headers: githubHeaders() }
  );

  let sha: string | undefined;
  let existingSlugs: string[] = Object.keys(LOCAL_MEMBERS);

  if (res.ok) {
    const data = await res.json();
    sha = data.sha;
    // Parse existing imports to find slugs
    const content = Buffer.from(data.content, "base64").toString("utf-8");
    const importMatches = content.matchAll(/import (\w+) from "\.\/(\w+)"/g);
    existingSlugs = [...importMatches].map((m) => m[2]);
  }

  if (!existingSlugs.includes(newSlug)) {
    existingSlugs.push(newSlug);
  }

  // Generate new team.ts
  const imports = existingSlugs
    .map((s) => `import ${s}Data from "./${s}";`)
    .join("\n");
  const entries = existingSlugs.map((s) => `  ${s}: ${s}Data,`).join("\n");

  const teamTs = `import { TeamMember } from "./types";\n${imports}\n\nconst teamMembers: Record<string, TeamMember> = {\n${entries}\n};\n\nexport function getTeamMember(slug: string): TeamMember | undefined {\n  return teamMembers[slug];\n}\n\nexport function getAllSlugs(): string[] {\n  return Object.keys(teamMembers);\n}\n`;

  await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    method: "PUT",
    headers: githubHeaders(),
    body: JSON.stringify({
      message: `Update team registry (add ${newSlug})`,
      content: Buffer.from(teamTs).toString("base64"),
      branch: BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });
}
