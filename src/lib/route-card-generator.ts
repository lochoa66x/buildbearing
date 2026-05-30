import type { RouteCard, RouteCardInput } from "@/types/route-card";

type IdeaType =
  | "local-discovery"
  | "marketplace-directory"
  | "dashboard-reporting"
  | "internal-tool"
  | "workflow-tool"
  | "ai-helper"
  | "website"
  | "content-resource"
  | "small-business"
  | "app"
  | "generic";

type RouteCardTemplate = Omit<RouteCard, "ideaSummary" | "targetUser"> & {
  targetUser: string;
};

const broadAudienceValues = new Set([
  "anyone",
  "everybody",
  "everyone",
  "people",
  "users",
  "all users",
  "general users",
  "customers",
  "businesses",
  "the public",
]);

function clean(value: string | undefined) {
  return value?.trim().replace(/\s+/g, " ") ?? "";
}

function sentence(value: string) {
  if (!value) return value;
  return /[.!?]$/.test(value) ? value : `${value}.`;
}

function textFromInput(input: RouteCardInput) {
  return [input.idea, input.audience, input.uncertainty, input.constraints]
    .map(clean)
    .join(" ")
    .toLowerCase();
}

function hasAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
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

function isBroadAudience(audience: string) {
  const normalized = audience.toLowerCase().replace(/[^\w\s]/g, "").trim();

  if (broadAudienceValues.has(normalized)) return true;
  if (normalized.endsWith(" users") && normalized.split(/\s+/).length <= 3) return true;

  return false;
}

function detectIdeaType(input: RouteCardInput): IdeaType {
  const text = textFromInput(input);

  const restaurantSignals = [
    "restaurant",
    "restaurants",
    "food",
    "menu",
    "menus",
    "nearby",
    "near me",
    "location",
    "geolocation",
    "places",
    "available",
    "availability",
    "quality",
    "reviews",
  ];
  const localSignals = ["nearby", "near me", "location", "geolocation", "places", "local"];
  const contentSignals = [
    "blog",
    "newsletter",
    "guide",
    "resource",
    "resources",
    "article",
    "articles",
    "notes",
    "library",
    "knowledge base",
    "content",
  ];
  const workflowSignals = [
    "workflow",
    "process",
    "approval",
    "approvals",
    "intake",
    "handoff",
    "checklist",
    "sop",
    "tracker",
    "automation",
    "automate",
  ];
  const internalSignals = [
    "internal",
    "staff",
    "team",
    "ops",
    "operations",
    "admin",
    "back office",
    "employee",
    "inventory",
    "crm",
  ];

  if (
    hasAny(text, ["restaurant", "restaurants", "menu", "menus"]) ||
    (hasAny(text, restaurantSignals) && hasAny(text, localSignals))
  ) {
    return "local-discovery";
  }

  if (
    hasAny(text, [
      "marketplace",
      "directory",
      "listing",
      "listings",
      "buyers",
      "sellers",
      "vendors",
      "providers",
      "catalog",
      "profiles",
    ])
  ) {
    return "marketplace-directory";
  }

  if (
    hasAny(text, [
      "dashboard",
      "report",
      "reports",
      "reporting",
      "metrics",
      "kpi",
      "analytics",
      "chart",
      "charts",
      "insights",
    ])
  ) {
    return "dashboard-reporting";
  }

  if (
    hasAny(text, [
      "ai",
      "assistant",
      "chatbot",
      "copilot",
      "gpt",
      "llm",
      "prompt",
      "summarizer",
      "classifier",
      "helper",
    ])
  ) {
    return "ai-helper";
  }

  if (hasAny(text, contentSignals)) {
    return "content-resource";
  }

  if (
    hasAny(text, ["workflow", "process", "intake", "handoff", "sop"]) ||
    (hasAny(text, workflowSignals) &&
      !hasAny(text, contentSignals) &&
      !hasAny(text, internalSignals))
  ) {
    return "workflow-tool";
  }

  if (hasAny(text, internalSignals)) {
    return "internal-tool";
  }

  if (
    hasAny(text, [
      "small business",
      "shop",
      "store",
      "salon",
      "clinic",
      "service business",
      "bakery",
      "dentist",
      "gym",
      "studio",
    ])
  ) {
    return "small-business";
  }

  if (
    hasAny(text, [
      "website",
      "landing page",
      "homepage",
      "site",
      "portfolio",
      "brochure",
      "marketing page",
      "seo",
    ])
  ) {
    return "website";
  }

  if (hasAny(text, ["app", "mobile", "ios", "android", "web app", "saas", "platform"])) {
    return "app";
  }

  return "generic";
}

const templates: Record<IdeaType, RouteCardTemplate> = {
  "local-discovery": {
    title: "Local Food Discovery Route Card",
    targetUser:
      "People looking for a specific type of food nearby, especially when they care about availability, distance, and restaurant quality.",
    problem:
      "People want a quick way to find restaurants that likely match a specific food craving, but menu data, availability, location, and quality signals are hard to trust without narrowing the first data set.",
    corePromise:
      "Help someone find likely matching restaurants nearby without pretending the first version has perfect real-time data.",
    bestFirstFormat: "Manual-first local discovery prototype with a constrained search flow.",
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
    assumptions: [
      "First data coverage should be narrow and transparent.",
      "Manual collection is safer than premature integrations.",
    ],
  },
  "marketplace-directory": {
    title: "Marketplace Directory Route Card",
    targetUser:
      "People trying to compare a small set of providers, listings, or options before contacting or choosing one.",
    problem:
      "Marketplace and directory ideas get complex quickly because supply, trust, search, and matching all compete for attention before there is enough evidence.",
    corePromise:
      "Help someone find and compare a small, trustworthy set of options without building a full two-sided marketplace yet.",
    bestFirstFormat: "Curated directory prototype with manual listing management.",
    buildFirst: [
      "Basic category or search filter",
      "Curated listing cards",
      "Listing detail page",
      "Simple contact or interest action",
      "Feedback or missing-listing form",
    ],
    notYet: [
      "User accounts",
      "Payments",
      "Vendor self-serve portal",
      "Complex matching algorithm",
      "Reviews system",
      "Automated onboarding",
    ],
    mvpScope: [
      "One category or niche",
      "10-25 curated listings",
      "Manual approval process",
      "Clear trust signals",
      "Simple inquiry handoff",
    ],
    suggestedScreensOrWorkflow: [
      "Choose category or need",
      "Browse curated results",
      "Open listing detail",
      "Compare trust signals",
      "Send inquiry or save feedback",
    ],
    keyRisks: [
      "Cold-start supply problem",
      "Low listing quality",
      "Trust and verification gaps",
      "Users expecting marketplace features too early",
    ],
    nextActions: [
      "Pick one niche and define what makes a listing worth including.",
      "Manually collect 10 strong example listings before building self-serve tools.",
      "Test whether users can choose confidently from the first result set.",
    ],
    launchReadinessNotes:
      "Launch only when the directory explains why listings are included and gives users a clear next step after comparing options.",
    assumptions: [
      "The first version can be curated manually.",
      "A small trusted set is more useful than a large unverified catalog.",
    ],
  },
  "dashboard-reporting": {
    title: "Dashboard Reporting Route Card",
    targetUser:
      "People who need to make a recurring decision from a few important metrics or status signals.",
    problem:
      "Dashboard ideas often turn into busy data surfaces before the key decision, source data, and update rhythm are clear.",
    corePromise:
      "Show the few signals that help the target user understand what changed and what to do next.",
    bestFirstFormat: "Static or semi-manual reporting dashboard with a narrow metric set.",
    buildFirst: [
      "One summary view",
      "3-5 priority metrics",
      "Status or trend indicators",
      "Simple filter for time or category",
      "Notes area for interpretation",
    ],
    notYet: [
      "Role-based access",
      "Complex chart builder",
      "Real-time data sync",
      "Custom dashboards",
      "Exports",
      "Advanced alerting",
    ],
    mvpScope: [
      "One audience",
      "One reporting cadence",
      "One data source or manual upload",
      "Readable metric definitions",
      "Decision-focused summary",
    ],
    suggestedScreensOrWorkflow: [
      "Open summary",
      "Scan top metrics",
      "Review what changed",
      "Read interpretation notes",
      "Choose next action",
    ],
    keyRisks: [
      "Unreliable data source",
      "Too many metrics",
      "Unclear definitions",
      "Charts that do not change decisions",
    ],
    nextActions: [
      "Name the one recurring decision the dashboard should support.",
      "Pick 3-5 metrics and define exactly where each comes from.",
      "Mock one report with real or realistic data before connecting integrations.",
    ],
    launchReadinessNotes:
      "Launch only when every metric has a plain-language definition and the dashboard makes one next decision easier.",
    assumptions: [
      "Manual or static data is acceptable for the first trust test.",
      "A narrow report is more useful than a flexible dashboard builder.",
    ],
  },
  "internal-tool": {
    title: "Internal Tool Route Card",
    targetUser:
      "A specific internal team member who repeats the same operational task and needs a cleaner handoff or decision point.",
    problem:
      "Internal tools fail when they copy the whole messy process instead of improving the smallest painful repeat step.",
    corePromise:
      "Make one recurring internal task clearer, faster, and easier to hand off.",
    bestFirstFormat: "Internal workflow prototype with manual review built in.",
    buildFirst: [
      "Task intake form",
      "Work queue or status list",
      "Detail view for one item",
      "Update/status action",
      "Simple handoff notes",
    ],
    notYet: [
      "Advanced permissions",
      "Full admin dashboard",
      "Automated integrations",
      "Bulk actions",
      "Audit trails",
      "Complex reporting",
    ],
    mvpScope: [
      "One team",
      "One repeated workflow",
      "One status model",
      "Manual review step",
      "Basic notes or handoff field",
    ],
    suggestedScreensOrWorkflow: [
      "Submit or capture work item",
      "Review queue",
      "Open item detail",
      "Update status",
      "Hand off next step",
    ],
    keyRisks: [
      "Workflow exceptions",
      "Low team adoption",
      "Messy source data",
      "Tool adds steps instead of removing friction",
    ],
    nextActions: [
      "Map the current workflow from intake to done in 6 steps or fewer.",
      "Choose the one handoff that causes the most delay or confusion.",
      "Prototype that handoff with 3 real examples before adding integrations.",
    ],
    launchReadinessNotes:
      "Launch only after the target team agrees on the status names, handoff rule, and what stays manual.",
    assumptions: [
      "The first version is for one team, not the whole company.",
      "Manual review is safer than hidden automation at V1.",
    ],
  },
  "workflow-tool": {
    title: "Workflow Tool Route Card",
    targetUser:
      "People who need to move a repeatable request, task, or process through clear steps without losing context.",
    problem:
      "Workflow ideas become too broad when every exception, automation, and role is included before the core path is tested.",
    corePromise:
      "Turn a repeatable process into a visible path with clear status, ownership, and next action.",
    bestFirstFormat: "Simple process tracker with one core workflow.",
    buildFirst: [
      "Workflow start form",
      "Status strip or checklist",
      "Task detail view",
      "Owner or next-action field",
      "Completion confirmation",
    ],
    notYet: [
      "Complex automation",
      "Role-based permissions",
      "Multi-workflow builder",
      "Notifications engine",
      "Integrations",
      "Advanced analytics",
    ],
    mvpScope: [
      "One process",
      "3-5 statuses",
      "One owner model",
      "Manual updates",
      "Visible next step",
    ],
    suggestedScreensOrWorkflow: [
      "Create workflow item",
      "Confirm required details",
      "Move through statuses",
      "Show current owner",
      "Close with outcome notes",
    ],
    keyRisks: [
      "Status names do not match real behavior",
      "Too many edge cases",
      "Ambiguous ownership",
      "Automation before trust",
    ],
    nextActions: [
      "Choose one workflow and write its happy path in 5 steps.",
      "Name the statuses and owner for each step.",
      "Test the flow with 5 real tasks before adding automation.",
    ],
    launchReadinessNotes:
      "Launch only when a user can tell what state the item is in, who owns it, and what happens next.",
    assumptions: [
      "The first workflow can ignore rare exceptions.",
      "Manual status changes are enough to test clarity.",
    ],
  },
  "ai-helper": {
    title: "AI Helper Route Card",
    targetUser:
      "People with a repeated judgment, drafting, summarizing, or triage task who need a helpful first pass and clear human review.",
    problem:
      "AI helper ideas can overpromise quickly unless the job, inputs, review moments, and failure modes are named up front.",
    corePromise:
      "Give the user a useful first pass while keeping the final decision understandable and reviewable.",
    bestFirstFormat: "Prompt-driven helper prototype with explicit guardrails.",
    buildFirst: [
      "Input prompt or upload area",
      "Output preview",
      "Confidence or limitation note",
      "Edit/regenerate action",
      "Human review checklist",
    ],
    notYet: [
      "Autonomous actions",
      "Fine-tuning",
      "Long-term memory",
      "Accounts",
      "Payments",
      "Complex agent workflows",
    ],
    mvpScope: [
      "One job",
      "One input format",
      "One output format",
      "Visible limitations",
      "Human approval before use",
    ],
    suggestedScreensOrWorkflow: [
      "Enter source material",
      "Confirm desired output",
      "Generate first pass",
      "Review limitations",
      "Edit and accept result",
    ],
    keyRisks: [
      "False confidence",
      "Ambiguous prompts",
      "Sensitive data handling",
      "Users skipping review",
    ],
    nextActions: [
      "Collect 10 realistic examples of the task and desired output.",
      "Write the helper's job, refusal boundaries, and review checklist.",
      "Test whether users can spot and correct weak outputs before relying on them.",
    ],
    launchReadinessNotes:
      "Launch only when the helper makes its limitations visible and keeps a human review step in the main path.",
    assumptions: [
      "The first version can use a simple prompt flow.",
      "Human review is part of the product, not an afterthought.",
    ],
  },
  website: {
    title: "Website Launch Route Card",
    targetUser:
      "Visitors who need to quickly understand the offer, trust it, and know the next step.",
    problem:
      "Website ideas often start with pages and styling before the audience, offer, proof, and primary action are clear.",
    corePromise:
      "Help the right visitor understand the offer and take one clear next action.",
    bestFirstFormat: "Focused landing page or small website with one primary conversion path.",
    buildFirst: [
      "Clear hero section",
      "Offer or value section",
      "Proof or examples",
      "Simple FAQ or objection handling",
      "Primary CTA",
    ],
    notYet: [
      "Blog system",
      "CMS",
      "User accounts",
      "Complex animations",
      "Multi-language support",
      "Full resource library",
    ],
    mvpScope: [
      "Homepage or one-page landing page",
      "One audience",
      "One primary CTA",
      "Essential proof",
      "Mobile responsive layout",
    ],
    suggestedScreensOrWorkflow: [
      "Land on hero",
      "Understand the offer",
      "Scan proof or examples",
      "Resolve common doubt",
      "Take primary action",
    ],
    keyRisks: [
      "Generic positioning",
      "Weak CTA",
      "Too many sections",
      "No proof for the promise",
    ],
    nextActions: [
      "Write the one-sentence offer and primary CTA before designing sections.",
      "Pick 3 proof points or examples that make the promise credible.",
      "Build the smallest responsive page and test whether visitors understand it in 10 seconds.",
    ],
    launchReadinessNotes:
      "Launch only when the page makes the offer, audience, and next action obvious without extra explanation.",
    assumptions: [
      "A focused page is enough before adding a CMS or content system.",
      "The first conversion goal should be singular.",
    ],
  },
  "content-resource": {
    title: "Resource Project Route Card",
    targetUser:
      "People trying to learn, compare, or reference a specific topic without digging through scattered material.",
    problem:
      "Content projects become hard to maintain when the first version tries to be a full library instead of a useful path through one topic.",
    corePromise:
      "Give readers a clear, useful path through a focused set of resources.",
    bestFirstFormat: "Curated resource hub or field-note collection with a narrow topic.",
    buildFirst: [
      "Topic landing page",
      "Curated resource list",
      "Short summaries",
      "Simple category filter",
      "Recommended next read",
    ],
    notYet: [
      "User accounts",
      "Community features",
      "Full CMS workflow",
      "Personalization",
      "Paid content",
      "Large taxonomy",
    ],
    mvpScope: [
      "One topic",
      "5-10 high-quality resources",
      "Short editorial notes",
      "Simple navigation",
      "Clear update promise",
    ],
    suggestedScreensOrWorkflow: [
      "Choose topic or guide",
      "Read short orientation",
      "Browse curated resources",
      "Open recommended item",
      "Return to next step",
    ],
    keyRisks: [
      "Too broad a topic",
      "Low editorial point of view",
      "Stale links",
      "Resource overload",
    ],
    nextActions: [
      "Choose one topic and the reader's first concrete question.",
      "Curate 5-10 resources and write a one-line reason each belongs.",
      "Test whether a reader knows what to open first and why.",
    ],
    launchReadinessNotes:
      "Launch only when the collection helps a reader make progress without feeling like a dumping ground of links.",
    assumptions: [
      "Curation quality matters more than content volume.",
      "A narrow first topic is easier to maintain.",
    ],
  },
  "small-business": {
    title: "Small Business Project Route Card",
    targetUser:
      "A local or small-business owner who needs a practical first digital tool, page, or workflow that supports real customer activity.",
    problem:
      "Small business projects can overbuild too early when bookings, payments, CRM, and marketing all get bundled into one first release.",
    corePromise:
      "Help the business support one important customer action without adding a full platform too soon.",
    bestFirstFormat: "Simple customer-facing page or lightweight operations prototype.",
    buildFirst: [
      "Clear offer or service page",
      "Customer request form",
      "Basic confirmation message",
      "Manual follow-up workflow",
      "Trust or proof section",
    ],
    notYet: [
      "Payments",
      "Accounts",
      "Full CRM",
      "Automated scheduling",
      "Loyalty program",
      "Complex admin tools",
    ],
    mvpScope: [
      "One business goal",
      "One customer action",
      "Manual fulfillment",
      "Simple contact capture",
      "Mobile-first experience",
    ],
    suggestedScreensOrWorkflow: [
      "Understand service or offer",
      "Submit request",
      "Receive confirmation",
      "Business follows up manually",
      "Capture feedback after first use",
    ],
    keyRisks: [
      "Trying to replace too many tools",
      "Unclear customer action",
      "Manual operations not planned",
      "Low trust signals",
    ],
    nextActions: [
      "Choose the one customer action the first version should improve.",
      "Write the manual follow-up process before building automation.",
      "Test the flow with 5 real customer scenarios.",
    ],
    launchReadinessNotes:
      "Launch only when the customer knows what to do and the business can fulfill the request manually without confusion.",
    assumptions: [
      "Manual follow-up is acceptable for the first release.",
      "The project should serve one business goal first.",
    ],
  },
  app: {
    title: "App Idea Route Card",
    targetUser:
      "People with a recurring need who would benefit from one focused mobile or web flow before a full product exists.",
    problem:
      "App ideas tend to expand into accounts, dashboards, settings, and platforms before the first repeated user action is proven.",
    corePromise:
      "Help the target user complete one useful action with less confusion or friction.",
    bestFirstFormat: "Mobile-friendly clickable or lightweight web app prototype.",
    buildFirst: [
      "Start screen",
      "Core input or action flow",
      "Result or confirmation screen",
      "Basic guidance copy",
      "Feedback capture",
    ],
    notYet: [
      "Accounts",
      "Payments",
      "Push notifications",
      "Complex settings",
      "Admin dashboard",
      "Native app store release",
    ],
    mvpScope: [
      "One primary user action",
      "One result state",
      "Manual or local data",
      "Mobile responsive UI",
      "Simple feedback loop",
    ],
    suggestedScreensOrWorkflow: [
      "Open start screen",
      "Enter or choose key input",
      "Review preview",
      "See result",
      "Take one next step",
    ],
    keyRisks: [
      "Feature creep",
      "Unclear repeat use",
      "Too many user states",
      "Building native too early",
    ],
    nextActions: [
      "Write the one user action the app must make easier.",
      "Sketch only the start, input, and result screens.",
      "Test the flow with 3 realistic examples before adding accounts or settings.",
    ],
    launchReadinessNotes:
      "Launch only when the core action works end to end without needing a full platform around it.",
    assumptions: [
      "A web prototype is enough before deciding on native apps.",
      "The first release should prove one repeated action.",
    ],
  },
  generic: {
    title: "First Build Route Card",
    targetUser:
      "People who have this problem often enough to test a focused first version.",
    problem:
      "The idea needs a sharper first use case before it turns into too many features.",
    corePromise:
      "Help the target user understand the clearest next step before anything gets overbuilt.",
    bestFirstFormat: "Lightweight clickable or manual prototype.",
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
    launchReadinessNotes:
      "Before sharing, confirm the first user action is obvious, the promise is specific, and the result can be tested with real examples.",
    assumptions: [
      "A smaller first version will reveal the right shape faster than a complete platform.",
      "Manual steps are acceptable until the core use case is proven.",
    ],
  },
};

function targetUserFromInput(input: RouteCardInput, ideaType: IdeaType) {
  const audience = clean(input.audience);

  if (audience && !isBroadAudience(audience)) return sentence(audience);

  return templates[ideaType].targetUser;
}

function launchNotesFromInput(input: RouteCardInput, baseNotes: string) {
  const constraints = clean(input.constraints);

  if (!constraints) return baseNotes;

  return `${baseNotes} Also confirm the first version respects this constraint: ${sentence(constraints)}`;
}

function assumptionsFromInput(input: RouteCardInput, ideaType: IdeaType) {
  const uncertainty = clean(input.uncertainty);
  const constraints = clean(input.constraints);
  const assumptions = [...(templates[ideaType].assumptions ?? [])];

  if (uncertainty) {
    assumptions.push(`Treat "${uncertainty}" as something to test before expanding scope.`);
  }

  if (constraints) {
    assumptions.push(`The first build must respect: ${sentence(constraints)}`);
  }

  return assumptions.slice(0, 4);
}

export function generateMockRouteCard(input: RouteCardInput): RouteCard {
  const idea = clean(input.idea);
  const ideaType = detectIdeaType(input);
  const template = templates[ideaType];
  const title = ideaType === "generic" ? titleFromIdea(idea) : template.title;

  return {
    ...template,
    title,
    ideaSummary: sentence(idea),
    targetUser: targetUserFromInput(input, ideaType),
    launchReadinessNotes: launchNotesFromInput(input, template.launchReadinessNotes),
    assumptions: assumptionsFromInput(input, ideaType),
  };
}
