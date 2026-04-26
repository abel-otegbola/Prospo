"use client";

import { useEffect, useRef } from "react";

export default function MouseCursor() {
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const inner = innerRef.current;
    const outer = outerRef.current;
    if (!inner || !outer) return;

    let isHoveringLink = false;

    const onMouseMove = (e: MouseEvent) => {
      if (!isHoveringLink) {
        outer.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
      inner.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };

    const onMouseEnter = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest("a, .cursor-pointer")) {
        isHoveringLink = true;
        inner.classList.add("cursor-hover");
        outer.classList.add("cursor-hover");
      }
    };

    const onMouseLeave = (e: MouseEvent) => {
      const target = e.target as Element;
      const isAnchor = target.tagName === "A";
      const insideCursorPointer = target.closest(".cursor-pointer");

      if (!(isAnchor && insideCursorPointer)) {
        isHoveringLink = false;
        inner.classList.remove("cursor-hover");
        outer.classList.remove("cursor-hover");
      }
    };

    inner.style.visibility = "visible";
    outer.style.visibility = "visible";

    window.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseenter", onMouseEnter, true);
    document.body.addEventListener("mouseleave", onMouseLeave, true);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.body.removeEventListener("mouseenter", onMouseEnter, true);
      document.body.removeEventListener("mouseleave", onMouseLeave, true);
    };
  }, []);

  return (
    <>
      {/* Mouse Cursor */}
      <div ref={outerRef} className="mouse-cursor cursor-outer" style={{ visibility: "hidden" }} />
      <div ref={innerRef} className="mouse-cursor cursor-inner" style={{ visibility: "hidden" }} />
      {/* /Mouse Cursor */}
    </>
  );
}
