export type RouteCardInput = {
  idea: string;
  audience?: string;
  uncertainty?: string;
  constraints?: string;
};

export type RouteCard = {
  title: string;
  ideaSummary: string;
  targetUser: string;
  problem: string;
  corePromise: string;
  bestFirstFormat: string;
  buildFirst: string[];
  notYet: string[];
  mvpScope: string[];
  suggestedScreensOrWorkflow: string[];
  keyRisks: string[];
  nextActions: [string, string, string];
  launchReadinessNotes: string;
};

export type RouteCardResponse = {
  card: RouteCard;
  mode: "mock" | "ai-ready";
};
