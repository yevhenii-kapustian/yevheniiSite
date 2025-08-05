"use client";

import Script from "next/script";

export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Yevhenii Fit - Online Coaching & Fitness Programs",
    url: "https://www.yevheniifit.com",
    logo: "https://www.yevheniifit.com/og-image.png",
    sameAs: ["https://www.instagram.com/_ev_ge_niii_/"],
  };

  return (
    <Script
      id="ld-json-org"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
