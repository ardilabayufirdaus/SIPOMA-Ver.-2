"use client";

import * as React from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";

type Props = {
  content: React.ReactNode;
  children: React.ReactElement;
};

export default function Tooltip({ content, children }: Props) {
  return (
    <RadixTooltip.Root delayDuration={150}>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side="top"
          align="center"
          className="z-50 rounded bg-gray-800 text-white text-xs px-2 py-1 shadow-lg"
        >
          {content}
          <RadixTooltip.Arrow className="fill-current text-gray-800" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}
