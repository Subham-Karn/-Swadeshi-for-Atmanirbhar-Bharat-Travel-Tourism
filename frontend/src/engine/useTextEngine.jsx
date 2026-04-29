import React from 'react';

export function parseCustomSyntax(input) {
  if (!input) return null;
  const lines = input.split("\n");

  return lines.map((line, index) => {
    const trimmedLine = line.trim();

    // 1. Headline Syntax: /h[text]
    if (trimmedLine.startsWith("/h[")) {
      // Extracts content between [ and ]
      const content = trimmedLine.match(/\/h\[(.*?)\]/)?.[1] || "";
      return <h1 key={index} className="text-2xl font-black mb-4 uppercase tracking-tighter">{content}</h1>;
    }

    // 2. Bullet Point Syntax: /b{"text"}
    if (trimmedLine.startsWith("/b{")) {
      const content = trimmedLine.match(/\/b\{"(.*?)"\}/)?.[1] || "";
      return (
        <li key={index} className="ml-6 list-disc text-slate-600 mb-2 font-medium">
          {parseInline(content)}
        </li>
      );
    }

    // 3. Alternate Bullet Point: /b"text"
    if (trimmedLine.startsWith("/b\"")) {
      const content = trimmedLine.match(/\/b"(.*?)"/)?.[1] || "";
      return (
        <li key={index} className="ml-6 list-disc text-slate-600 mb-2 font-medium">
          {parseInline(content)}
        </li>
      );
    }

    // Default Paragraph with Inline parsing
    return (
      <p key={index} className="text-slate-500 mb-4 leading-relaxed">
        {parseInline(line)}
      </p>
    );
  });
}

/**
 * Helper to handle Italic and other inline styles
 * Syntax: /I"text"
 */
function parseInline(text) {
  // Replace /I"text" with <em> element logic
  const parts = text.split(/(\/I".*?")/g);
  
  return parts.map((part, i) => {
    const italicMatch = part.match(/\/I"(.*?)"/);
    if (italicMatch) {
      return <em key={i} className="italic text-slate-800">{italicMatch[1]}</em>;
    }
    return part;
  });
}