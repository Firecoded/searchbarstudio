// Client-safe stage metadata (labels + order) for the stepper and selectors,
// kept separate from the db schema so client components don't bundle Drizzle.
// The `value`s must match the schema's PROJECT_STAGES.
export const PROJECT_STAGE_META = [
  {
    value: "kickoff",
    label: "Kickoff",
    description: "We're getting set up, gathering the details and assets to begin.",
  },
  {
    value: "design",
    label: "Design",
    description: "Designing the look and feel of your site.",
  },
  {
    value: "build",
    label: "Build",
    description: "Building your site and wiring everything up.",
  },
  {
    value: "review",
    label: "Your review",
    description: "Your turn, take a look and send any changes before we launch.",
  },
  {
    value: "live",
    label: "Live",
    description: "Your site is live.",
  },
  {
    value: "care",
    label: "Care",
    description: "Live and looked after, hosting, updates, and support.",
  },
] as const;

export type ProjectStageValue = (typeof PROJECT_STAGE_META)[number]["value"];

export function stageLabel(value: string) {
  return PROJECT_STAGE_META.find((s) => s.value === value)?.label ?? value;
}

export function stageDescription(value: string) {
  return PROJECT_STAGE_META.find((s) => s.value === value)?.description ?? "";
}

export function stageIndex(value: string) {
  return PROJECT_STAGE_META.findIndex((s) => s.value === value);
}
