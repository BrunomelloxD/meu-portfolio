import React from "react";
import { vi } from "vitest";

vi.mock("framer-motion", () => {
  const cache = new Map<string, React.ComponentType<React.HTMLAttributes<HTMLElement>>>();

  const passthrough = (tag: string) => {
    if (cache.has(tag)) return cache.get(tag)!;
    const Comp = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
      function MotionTag(props, ref) {
        const rest = { ...(props as Record<string, unknown>) };
        [
          "initial",
          "animate",
          "exit",
          "transition",
          "whileHover",
          "whileTap",
          "whileInView",
          "viewport",
          "variants",
          "layout",
          "layoutId",
        ].forEach((key) => delete rest[key]);
        return React.createElement(tag, { ...(rest as object), ref });
      },
    );
    cache.set(tag, Comp as React.ComponentType<React.HTMLAttributes<HTMLElement>>);
    return Comp;
  };

  const motion = new Proxy(
    {},
    {
      get: (_, key: string) => passthrough(key),
    },
  );

  const AnimatePresence = ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children);

  return { motion, AnimatePresence };
});

vi.mock("next/image", () => ({
  default: React.forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(
    function NextImage(props, ref) {
      return React.createElement("img", { ...props, ref });
    },
  ),
}));
