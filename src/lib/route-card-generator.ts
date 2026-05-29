import type { RouteCard, RouteCardInput } from "@/types/route-card";

type IdeaType = "restaurant-local-discovery" | "general";

const broadAudienceValues = new Set(["anyone", "everyone", "everybody"]);

function clean(value: string | undefined) {
  return value?.trim().replace(/\s+/g, " ") ?? "";
}

function sentence(value: string) {
  if (!value) return value;
  return /[.!?]$/.test(value) ? value : `${value}.`;
}

function titleFromIdea(idea: string) {
  const withoutPunctuation = idea
    .replace(/[^\w\s-]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 6)
    .join(" ");

  if (!withoutPunctuation) return "First Build Route Card";

  return withoutPunctuation
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace(/\bA\b/g, "A");
}

function textFromInput(input: RouteCardInput) {
  return [input.idea, input.audience, input.uncertainty, input.constraints]
    .map(clean)
    .join(" ")
    .toLowerCase();
}

function detectIdeaType(input: RouteCardInput): IdeaType {
  const text = textFromInput(input);
  const hasRestaurantSignal =
    /\b(restaurants?|food|menus?|nearby|near me|places?)\b/.test(text);
  const hasDiscoverySignal =
    /\b(available|availability|locations?|geolocation|quality|reviews?)\b/.test(text);

  return hasRestaurantSignal && hasDiscoverySignal
    ? "restaurant-local-discovery"
    : "general";
}

function isBroadAudience(audience: string) {
  const normalized = audience.toLowerCase().replace(/[^\w\s]/g, "").trim();
  return broadAudienceValues.has(normalized);
}

function inferredAudienceForType(ideaType: IdeaType) {
  if (ideaType === "restaurant-local-discovery") {
    return "People looking for a specific type of food nearby, especially when they care about availability, distance, and restaurant quality.";
  }

  return "People who have this problem often enough to test a focused first version.";
}

function inferFormat(idea: string, ideaType: IdeaType) {
  if (ideaType === "restaurant-local-discovery") {
    return "Manual-first local discovery prototype with a constrained search flow.";
  }

  const lower = idea.toLowerCase();

  if (lower.includes("website") || lower.includes("landing page")) {
    return "Focused website or landing page prototype.";
  }

  if (lower.includes("workflow") || lower.includes("internal")) {
    return "Small internal workflow tool prototype.";
  }

  if (lower.includes("ai") || lower.includes("assistant") || lower.includes("helper")) {
    return "Prompt-driven helper prototype with clear guardrails.";
  }

  if (lower.includes("app") || lower.includes("mobile")) {
    return "Mobile-friendly app prototype.";
  }

  return "Lightweight clickable or manual prototype.";
}

function targetUserFromInput(input: RouteCardInput, ideaType: IdeaType) {
  const audience = clean(input.audience);

  if (audience && !isBroadAudience(audience)) return sentence(audience);

  return inferredAudienceForType(ideaType);
}

function problemFromInput(input: RouteCardInput, ideaType: IdeaType) {
  if (ideaType === "restaurant-local-discovery") {
    return "People want a quick way to find restaurants that likely match a specific food craving, but menu data, availability, location, and quality signals are hard to trust without narrowing the first data set.";
  }

  const uncertainty = clean(input.uncertainty);

  if (uncertainty) {
    return sentence(`The idea is promising, but the unclear part is ${uncertainty.toLowerCase()}`);
  }

  return "The idea needs a sharper first use case before it turns into too many features.";
}

function launchNotesFromInput(input: RouteCardInput) {
  const constraints = clean(input.constraints);

  if (constraints) {
    return sentence(
      `Before sharing, confirm the first flow respects these constraints: ${constraints}`,
    );
  }

  return "Before sharing, confirm the first user action is obvious, the promise is specific, and the result can be tested with real examples.";
}

export function generateMockRouteCard(input: RouteCardInput): RouteCard {
  const idea = clean(input.idea);
  const ideaType = detectIdeaType(input);
  const targetUser = targetUserFromInput(input, ideaType);
  const bestFirstFormat = inferFormat(idea, ideaType);

  if (ideaType === "restaurant-local-discovery") {
    return {
      title: "Local Food Discovery Route Card",
      ideaSummary: sentence(idea),
      targetUser,
      problem: problemFromInput(input, ideaType),
      corePromise:
        "Help someone find likely matching restaurants nearby without pretending the first version has perfect real-time data.",
      bestFirstFormat,
      buildFirst: [
        "Food search input",
        "Location or current-area selector",
        "Small result list",
        "Restaurant detail preview",
        "Feedback option",
      ],
      notYet: [
        "Accounts",
        "Payments",
        "Reservations",
        "Full menu database",
        "Real-time availability claims",
        "Complex recommendation engine",
      ],
      mvpScope: [
        "One city or neighborhood",
        "Small set of food categories",
        "Manual or semi-manual data collection",
        "Basic quality signals",
      ],
      suggestedScreensOrWorkflow: [
        "Enter food craving",
        "Confirm location",
        "Show likely matching restaurants",
        "Explain confidence or data source",
        "Collect user feedback",
      ],
      keyRisks: [
        "Outdated menu data",
        "Real-time availability overclaim",
        "Subjective quality",
        "Geolocation privacy or permission friction",
      ],
      nextActions: [
        "Pick one city or neighborhood and 5-10 food types to test.",
        "Collect restaurant and menu examples manually before building integrations.",
        "Test whether users trust likely available results more than exact availability claims.",
      ],
      launchReadinessNotes:
        "Launch only after the prototype clearly labels its data source, avoids exact availability claims, and gives users a simple way to correct weak matches.",
    };
  }

  return {
    title: titleFromIdea(idea),
    ideaSummary: sentence(idea),
    targetUser,
    problem: problemFromInput(input, ideaType),
    corePromise:
      "Help the target user understand the clearest next step before anything gets overbuilt.",
    bestFirstFormat,
    buildFirst: [
      "One focused input flow",
      "A simple preview or result screen",
      "Plain-language next-step guidance",
      "A lightweight way to capture feedback",
    ],
    notYet: [
      "Accounts",
      "Payments",
      "Complex dashboards",
      "Advanced automations",
      "Integrations before manual testing",
    ],
    mvpScope: [
      "Start screen",
      "Core input step",
      "Review or preview step",
      "Result or recommendation screen",
      "Simple feedback handoff",
    ],
    suggestedScreensOrWorkflow: [
      "Capture the user input",
      "Confirm what the user is trying to do",
      "Show the first useful result",
      "Offer one clear next action",
    ],
    keyRisks: [
      "Scope drift",
      "Unclear target user",
      "A promise that is too broad",
      "Testing with examples that are not realistic enough",
    ],
    nextActions: [
      "Collect 5 real examples that match the target user's situation.",
      "Sketch the first screen and the result screen only.",
      "Test the route with 3 people before adding more features.",
    ],
    launchReadinessNotes: launchNotesFromInput(input),
  };
}
