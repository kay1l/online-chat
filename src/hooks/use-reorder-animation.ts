"use client";

import { useCallback, useLayoutEffect, useRef } from "react";

const MOVE_MS = 340;
const ENTER_MS = 260;
const EASING = "cubic-bezier(0.2, 0.8, 0.2, 1)";

type Key = string | number;

/**
 * FLIP reordering for a list.
 *
 * Remembers where each row sat, then after the list re-renders puts it back
 * where it was and lets it transition to its new position — so a chat that
 * jumps to the top visibly travels there. Rows that appear later fade in.
 *
 * Returns a ref callback to attach to each row: `ref={register(item.id)}`.
 */
export function useReorderAnimation(keys: Key[]) {
  const nodes = useRef(new Map<Key, HTMLElement>());
  const offsets = useRef(new Map<Key, number>());
  const initialised = useRef(false);

  const register = useCallback(
    (key: Key) => (node: HTMLElement | null) => {
      if (node) {
        nodes.current.set(key, node);
      } else {
        nodes.current.delete(key);
      }
    },
    []
  );

  // Re-run whenever the order or membership changes, not on every poll.
  const signature = keys.join("|");

  useLayoutEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const previous = offsets.current;
    const next = new Map<Key, number>();
    const firstPass = !initialised.current;

    nodes.current.forEach((node, key) => {
      // offsetTop is measured against the list, so scrolling cannot skew it the
      // way getBoundingClientRect would.
      const top = node.offsetTop;
      next.set(key, top);

      if (reduceMotion) return;

      const before = previous.get(key);

      // A row that was not here before: fade it in rather than slide it.
      if (before === undefined) {
        if (firstPass) return;

        node.style.transition = "none";
        node.style.opacity = "0";
        requestAnimationFrame(() => {
          node.style.transition = `opacity ${ENTER_MS}ms ease-out`;
          node.style.opacity = "";
        });
        return;
      }

      if (before === top) return;

      // Start from the old position, then release to the new one.
      node.style.transition = "none";
      node.style.transform = `translateY(${before - top}px)`;
      requestAnimationFrame(() => {
        node.style.transition = `transform ${MOVE_MS}ms ${EASING}`;
        node.style.transform = "";
      });
    });

    offsets.current = next;
    initialised.current = true;
  }, [signature]);

  return register;
}
