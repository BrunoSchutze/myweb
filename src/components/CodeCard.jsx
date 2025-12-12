import React, { useEffect, useRef, useState } from "react";
import "./codecard.css";

/** líneas con "span class" para colorear */
const codeLines = [
  `<span class="t-comm">// my-component.tsx</span>`,
  `<span class="t-kw">'use client'</span>;`,
  ``,
  `<span class="t-kw2">import</span> React <span class="t-kw2">from</span> <span class="t-str">'react'</span>;`,
  ``,
  `<span class="t-kw2">type</span> <span class="t-type">User</span> = {`,
  `  <span class="t-prop">name</span>: <span class="t-type">string</span>;`,
  `  <span class="t-prop">role</span>: <span class="t-type">string</span>;`,
  `  <span class="t-prop">skills</span>: <span class="t-type">string</span>[];`,
  `};`,
  ``,
  `<span class="t-kw2">export</span> <span class="t-kw2">function</span> <span class="t-fn">Hello</span>() {`,
  `  <span class="t-kw2">const</span> me: <span class="t-type">User</span> = {`,
  `    <span class="t-prop">name</span>: <span class="t-str">'Bruno'</span>,`,
  `    <span class="t-prop">role</span>: <span class="t-str">'Desarrollador Web'</span>,`,
  `    <span class="t-prop">skills</span>: [<span class="t-str">'React'</span>, <span class="t-str">'Supabase'</span>, <span class="t-str">'CSS'</span>]`,
  `  };`,
  `  <span class="t-kw2">const</span> year = <span class="t-kw2">new</span> <span class="t-fn">Date</span>().<span class="t-fn">getFullYear</span>();`,
  `  <span class="t-kw2">return</span> (`,
  `    &lt;div&gt;`,
  `      &lt;h3&gt;{me.name} — {me.role} ({year})&lt;/h3&gt;`,
  `    &lt;/div&gt;`,
  `  );`,
  `}`,
];

export default function CodeCard() {
  const bodyRef = useRef(null);
  const [displayedText, setDisplayedText] = useState("");
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);

  useEffect(() => {
    if (!bodyRef.current) return;

    // Efecto de escritura carácter por carácter
    const typingInterval = setInterval(() => {
      if (currentLine < codeLines.length) {
        const line = codeLines[currentLine];
        
        if (currentChar < line.length) {
          setDisplayedText(prev => prev + line[currentChar]);
          setCurrentChar(prev => prev + 1);
        } else {
          // Línea completada, pasar a la siguiente
          setDisplayedText(prev => prev + "<br/>");
          setCurrentLine(prev => prev + 1);
          setCurrentChar(0);
        }
      } else {
        clearInterval(typingInterval);
      }
    }, 20); // Velocidad de escritura (ms por carácter)

    return () => clearInterval(typingInterval);
  }, [currentLine, currentChar]);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.innerHTML = displayedText;
      // Auto-scroll al final
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [displayedText]);

  return (
    <div className="code-card">
      <div className="code-card__header">
        <span className="led red" />
        <span className="led yellow" />
        <span className="led green" />
        <span className="filename">my-component.tsx</span>
      </div>
      <div className="code-card__body" ref={bodyRef} />
    </div>
  );
}