import * as React from "react";

export function LandingJsonLd() {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": "https://mc-mathamatics-web.vercel.app/#organization",
        "name": "MC Mathematics",
        "url": "https://mc-mathamatics-web.vercel.app",
        "slogan": "Maths is the question. MC is the answer.",
        "description": "Premier mathematics academy in Kurunegala, Sri Lanka led by Malinga C Dissanayake.",
        "founder": {
          "@type": "Person",
          "name": "Malinga C Dissanayake",
          "jobTitle": "Mathematics Specialist",
        },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Kurunegala",
          "addressRegion": "North Western Province",
          "addressCountry": "LK",
        },
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://mc-mathamatics-web.vercel.app/#localbusiness",
        "name": "MC Mathematics Kurunegala",
        "image": "https://mc-mathamatics-web.vercel.app/og-image.png",
        "telephone": "+94771234567",
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Kurunegala",
          "addressRegion": "North Western Province",
          "addressCountry": "LK",
        },
      },
      {
        "@type": "Course",
        "name": "Combined Mathematics (A/L) & Mathematics (O/L)",
        "description": "Comprehensive mathematics curriculum with timed paper examinations and automated diagnostic analysis.",
        "provider": {
          "@id": "https://mc-mathamatics-web.vercel.app/#organization",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
    />
  );
}
