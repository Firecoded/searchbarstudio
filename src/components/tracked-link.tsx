"use client";

import { track } from "./posthog";

type Props = React.ComponentPropsWithoutRef<"a"> & {
  event: string;
  eventProps?: Record<string, unknown>;
};

// An anchor that fires a PostHog event on click, for CTAs and outbound links
// worth attributing. Behaves like a normal <a> otherwise.
export function TrackedLink({ event, eventProps, onClick, ...rest }: Props) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        track(event, eventProps);
        onClick?.(e);
      }}
    />
  );
}
