import { NextResponse } from "next/server";
import { generateMockRouteCard } from "@/lib/route-card-generator";
import type { RouteCardInput, RouteCardResponse } from "@/types/route-card";

const MIN_IDEA_LENGTH = 20;

function hasAiKey() {
  return Boolean(process.env.BUILDBEARING_AI_API_KEY || process.env.OPENAI_API_KEY);
}

export async function POST(request: Request) {
  let input: Partial<RouteCardInput>;

  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: "Please provide a valid idea." }, { status: 400 });
  }

  if (!input || typeof input !== "object") {
    return NextResponse.json({ error: "Please provide a valid idea." }, { status: 400 });
  }

  const idea = typeof input.idea === "string" ? input.idea.trim() : "";

  if (idea.length < MIN_IDEA_LENGTH) {
    return NextResponse.json(
      { error: "Please describe the idea in at least 20 characters." },
      { status: 400 },
    );
  }

  const card = generateMockRouteCard({
    idea,
    audience: typeof input.audience === "string" ? input.audience : "",
    uncertainty: typeof input.uncertainty === "string" ? input.uncertainty : "",
    constraints: typeof input.constraints === "string" ? input.constraints : "",
  });
  const response: RouteCardResponse = {
    card,
    mode: hasAiKey() ? "ai-ready" : "mock",
  };

  return NextResponse.json(response);
}
