import type { RouteCard } from "@/types/route-card";

function list(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

export function routeCardToCodexPrompt(card: RouteCard) {
  const assumptions = card.assumptions?.length
    ? `\nAssumptions:\n${list(card.assumptions)}\n`
    : "";

  return `Use this BuildBearing Route Card as the source of truth and build only the first useful version.

Keep scope small. Do not add authentication, database, payments, analytics, saved cards, complex dashboards, or AI/provider calls unless the Route Card explicitly asks for them.

Project:
${card.title}

Idea summary:
${card.ideaSummary}

Target user:
${card.targetUser}

Problem:
${card.problem}

Core promise:
${card.corePromise}

Best first format:
${card.bestFirstFormat}

Build first:
${list(card.buildFirst)}

Do not build yet:
${list(card.notYet)}

MVP scope:
${list(card.mvpScope)}

Suggested pages, screens, or workflow:
${list(card.suggestedScreensOrWorkflow)}

Key risks:
${list(card.keyRisks)}
${assumptions}
Next 3 actions:
${card.nextActions.map((action, index) => `${index + 1}. ${action}`).join("\n")}

Launch readiness notes:
${card.launchReadinessNotes}

Implementation request:
Create the smallest usable first version that satisfies the core promise, follows the suggested workflow, and visibly avoids everything in the Not Yet list. Preserve a simple, understandable UX. If something is unclear, make the safest small-scope assumption and note it briefly.`;
}
