import React from "react";
import { afterEach, vi } from "vitest";

/**
 * motion/react mock. Motion props never reach the DOM; they are serialised into `data-motion`
 * (JSON) so tests can assert the spec values. `stagger()` and the MotionValue hooks return tagged
 * objects for the same reason. AnimatePresence and MotionConfig are vi.fn components: read their
 * props from `vi.mocked(AnimatePresence).mock.calls`.
 */
vi.mock("motion/react", () => {
  const MOTION_KEYS = [
    "initial",
    "animate",
    "exit",
    "transition",
    "whileHover",
    "whileTap",
    "whileFocus",
    "whileInView",
    "viewport",
    "variants",
    "layout",
    "layoutId",
    "custom",
    "inherit",
    "drag",
    "dragConstraints",
    "dragElastic",
    "dragMomentum",
    "dragTransition",
    "onDragStart",
    "onDrag",
    "onDragEnd",
  ];

  // Live motion props by DOM node, functions included: read them with `__motionPropsOf(el)`.
  const registry = new WeakMap<Element, Record<string, unknown>>();

  const isMotionValue = (value: unknown) =>
    typeof value === "object" && value !== null && "__mv" in (value as Record<string, unknown>);

  const serialise = (value: unknown) =>
    JSON.stringify(value, (_, v) => (typeof v === "function" ? "[fn]" : v));

  const cache = new Map<string, React.ComponentType<Record<string, unknown>>>();

  const passthrough = (tag: string) => {
    if (cache.has(tag)) return cache.get(tag)!;
    const Comp = React.forwardRef<HTMLElement, Record<string, unknown>>(function MotionTag(props, ref) {
      const rest: Record<string, unknown> = { ...props };
      const motionProps: Record<string, unknown> = {};
      for (const key of MOTION_KEYS) {
        if (key in rest) {
          motionProps[key] = rest[key];
          delete rest[key];
        }
      }
      const style = rest.style as Record<string, unknown> | undefined;
      if (style) {
        const domStyle: Record<string, unknown> = {};
        const motionStyle: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(style)) {
          if (isMotionValue(value) || key === "originX" || key === "originY") motionStyle[key] = value;
          else domStyle[key] = value;
        }
        rest.style = domStyle;
        if (Object.keys(motionStyle).length) motionProps.style = motionStyle;
      }
      if (Object.keys(motionProps).length) rest["data-motion"] = serialise(motionProps);
      const setRef = (node: HTMLElement | null) => {
        if (node) registry.set(node, motionProps);
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      };
      return React.createElement(tag, { ...rest, ref: setRef });
    });
    cache.set(tag, Comp as unknown as React.ComponentType<Record<string, unknown>>);
    return Comp;
  };

  const motion = new Proxy({}, { get: (_, key: string) => passthrough(key) });

  const AnimatePresence = vi.fn(({ children }: { children?: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
  );
  const MotionConfig = vi.fn(({ children }: { children?: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
  );

  // A working motion value: tests can read `.get()` and drive `.set()`; `current` shows up in data-motion.
  const motionValue = (initial: unknown) => {
    const listeners = new Set<(v: unknown) => void>();
    const mv = {
      __mv: "value",
      current: initial,
      get: () => mv.current,
      set: (v: unknown) => {
        mv.current = v;
        listeners.forEach((l) => l(v));
      },
      on: (_event: string, l: (v: unknown) => void) => {
        listeners.add(l);
        return () => listeners.delete(l);
      },
    };
    return mv;
  };

  const useReducedMotion = vi.fn(() => false);
  const useMotionValue = vi.fn((initial: unknown) => React.useState(() => motionValue(initial))[0]);
  const transform = (source: unknown, input?: unknown, output?: unknown, options?: unknown) => ({
    __mv: "transform",
    source,
    input,
    output,
    options,
  });
  const useTransform = vi.fn(transform);
  const useInView = vi.fn(() => false);
  const useMotionValueEvent = vi.fn();
  const animate = vi.fn(() => ({ stop: vi.fn() }));
  const useScroll = vi.fn(() => ({ scrollYProgress: { __mv: "scrollYProgress" } }));
  const useSpring = vi.fn((source: unknown, options?: unknown) => ({ __mv: "spring", source, options }));
  const usePresence = vi.fn(() => [true, vi.fn()]);
  const stagger = (value: number, options?: unknown) => ({ __stagger: [value, options ?? null] });

  afterEach(() => {
    useReducedMotion.mockImplementation(() => false);
    useScroll.mockImplementation(() => ({ scrollYProgress: { __mv: "scrollYProgress" } }));
    useSpring.mockImplementation((source: unknown, options?: unknown) => ({ __mv: "spring", source, options }));
    usePresence.mockImplementation(() => [true, vi.fn()]);
    useInView.mockImplementation(() => false);
    useTransform.mockImplementation(transform);
    animate.mockImplementation(() => ({ stop: vi.fn() }));
  });

  const __motionPropsOf = (el: Element) => registry.get(el) ?? {};

  return {
    __motionPropsOf,
    motion,
    AnimatePresence,
    MotionConfig,
    useReducedMotion,
    useScroll,
    useSpring,
    usePresence,
    stagger,
    useMotionValue,
    useTransform,
    useInView,
    useMotionValueEvent,
    animate,
  };
});

vi.mock("next/image", () => ({
  default: React.forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(
    function NextImage(props, ref) {
      return React.createElement("img", { ...props, ref });
    },
  ),
}));
