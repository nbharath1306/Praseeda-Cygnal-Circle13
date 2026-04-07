import { TeamMember } from "./types";
import praseeda from "./praseeda";

const teamMembers: Record<string, TeamMember> = {
  praseeda,
};

export function getTeamMember(slug: string): TeamMember | undefined {
  return teamMembers[slug];
}

export function getAllSlugs(): string[] {
  return Object.keys(teamMembers);
}
