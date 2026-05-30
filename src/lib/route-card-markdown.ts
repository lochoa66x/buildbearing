import type { RouteCard } from "@/types/route-card";

function list(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

export function routeCardToMarkdown(card: RouteCard) {
  const assumptions = card.assumptions?.length
    ? `\n\n## Assumptions\n${list(card.assumptions)}`
    : "";

  return `# ${card.title}

## Idea Summary
${card.ideaSummary}

## Target User
${card.targetUser}

## Problem
${card.problem}

## Core Promise
${card.corePromise}

## Best First Format
${card.bestFirstFormat}

## Build First
${list(card.buildFirst)}

## Not Yet
${list(card.notYet)}

## MVP Scope
${list(card.mvpScope)}

## Suggested Screens Or Workflow
${list(card.suggestedScreensOrWorkflow)}

## Key Risks
${list(card.keyRisks)}${assumptions}

## Next 3 Actions
${card.nextActions.map((action, index) => `${index + 1}. ${action}`).join("\n")}

## Launch Readiness Notes
${card.launchReadinessNotes}
`;
}
