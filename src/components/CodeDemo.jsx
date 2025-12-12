import React, { useEffect, useMemo, useRef, useState } from "react";

const styles = {
  card: {
    width: 420,
    height: 372,
    borderRadius: 16,
    background:
      "linear-gradient(180deg, rgba(255,255,255,.06), rgba(0,0,0,.25))",
    border: "1px solid rgba(255,255,255,.12)",
    boxShadow: "0 10px 30px rgba(0,0,0,.25)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 12px",
    background: "rgba(0,0,0,.25)",
    borderBottom: "1px solid rgba(255,255,255,.08)",
    color: "#e9e9ee",
    fontWeight: 700,
    fontSize: 13,
  },
  dots: { display: "flex", gap: 6, marginRight: 8 },
  dot: (c) => ({ width: 10, height: 10, borderRadius: 999, background: c }),
  codeWrap: {
    flex: 1,
    padding: 14,
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    fontSize: 13.5,
    color: "#dfe1ff",
    overflow: "auto",
    whiteSpace: "pre-wrap",
    lineHeight: 1.45,
  },
  cursor: (visible) => ({
    display: "inline-block",
    width: 8,
    height: 18,
    background: "#dfe1ff",
    verticalAlign: "text-bottom",
    marginLeft: 2,
    opacity: visible ? 1 : 0,
    transition: "opacity .15s",
  }),
  headerIcon: { width: 16, height: 16, opacity: 0.9 },
  filename: { marginLeft: 4 },
};

const BracketsIcon = () => (
  <svg viewBox="0 0 24 24" style={styles.headerIcon} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 4L3 7l3 3M18 4l3 3-3 3M8 21l-5-5 5-5M16 21l5-5-5-5" />
  </svg>
);

export default function CodeDemo({
  duration = 4.5,
  delay = 0.3,
  writing = true,
  cursor = true,
  filename = "my-component.tsx",
  code = `'use client';

import * as React from 'react';

type MyComponentProps = {
  myProps: string;
} & React.ComponentProps<'div'>;

function MyComponent(props: MyComponentProps) {
  return (
    <div {...props}>
      <p>My Component</p>
    </div>
  );
}

export { MyComponent, type MyComponentProps };`,
}) {
  const totalChars = useMemo(() => code.length, [code]);
  const [t, setT] = useState(0);
  const [blink, setBlink] = useState(true);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!cursor) return;
    const id = setInterval(() => setBlink((b) => !b), 500);
    return () => clearInterval(id);
  }, [cursor]);

  useEffect(() => {
    if (!writing) {
      setT(1);
      return;
    }
    let raf;
    let start;
    const startAfter = delay * 1000;
    const total = duration * 1000;

    const loop = (now) => {
      if (!start) start = now;
      const elapsed = now - start;
      if (elapsed < startAfter) {
        raf = requestAnimationFrame(loop);
        return;
      }
      const k = Math.min(1, (elapsed - startAfter) / total);
      const eased = 1 / (1 + Math.exp(-10 * (k - 0.5))); // easing suave
      setT(eased);
      if (k < 1) raf = requestAnimationFrame(loop);
    };

    if (!startedRef.current) {
      startedRef.current = true;
      raf = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(raf);
  }, [writing, delay, duration]);

  const shownChars = Math.floor(totalChars * t);
  const shown = code.slice(0, shownChars);

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.dots}>
          <span style={styles.dot("#ff5f56")} />
          <span style={styles.dot("#ffbd2e")} />
          <span style={styles.dot("#27c93f")} />
        </div>
        <BracketsIcon />
        <span style={styles.filename}>{filename}</span>
      </div>

      <div style={styles.codeWrap}>
        {writing ? shown : code}
        {cursor && <span style={styles.cursor(blink)} />}
      </div>
    </div>
  );
}
