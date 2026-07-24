"use client";

import { useId } from "react";

interface JsonLdProps {
  data: object | object[];
  key?: string;
}

export function JsonLd({ data, key }: JsonLdProps) {
  const id = useId();
  const jsonLdData = Array.isArray(data) ? data : [data];

  if (typeof window === "undefined") {
    return (
      <script
        key={key || id}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
    );
  }

  return null;
}

export function JsonLdScript({ data, key }: JsonLdProps) {
  const id = useId();
  const jsonLdData = Array.isArray(data) ? data : [data];

  return (
    <script
      key={key || id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
    />
  );
}