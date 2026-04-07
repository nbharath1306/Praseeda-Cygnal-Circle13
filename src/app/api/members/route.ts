import { NextRequest, NextResponse } from "next/server";
import { getMember, getAllMembers, saveMemberToGitHub } from "@/lib/data";
import type { TeamMember } from "@/data/types";

function checkPin(request: NextRequest): boolean {
  const pin = request.headers.get("x-admin-pin");
  return pin === process.env.ADMIN_PIN;
}

// GET /api/members — list all members
// GET /api/members?slug=bharath — get one member
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");

  if (slug) {
    const member = await getMember(slug);
    if (!member) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(member);
  }

  const members = await getAllMembers();
  return NextResponse.json(members);
}

// POST /api/members — create or update a member (saves to GitHub)
export async function POST(request: NextRequest) {
  if (!checkPin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const member = (await request.json()) as TeamMember;

  if (!member.slug || !member.name) {
    return NextResponse.json(
      { error: "slug and name are required" },
      { status: 400 }
    );
  }

  try {
    await saveMemberToGitHub(member);
    return NextResponse.json({
      ok: true,
      slug: member.slug,
      message: "Saved to GitHub. Vercel will rebuild in ~30 seconds.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
