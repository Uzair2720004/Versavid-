import type { Metadata } from "next";

const SITE_URL = "https://versavid.com";
const SITE_NAME = "VersaVid";

export const structuredData = {
  organization: () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "VersaVid",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo-light.png`,
    sameAs: [
      "https://twitter.com/VersavidAi",
      "https://www.linkedin.com/company/versavid",
      "https://github.com/versavid",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-555-VERSVID",
      contactType: "customer service",
      availableLanguage: "English",
    },
    founder: {
      "@type": "Person",
      name: "VersaVid Team",
    },
  }),

  softwareApplication: () => ({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "VersaVid",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Cloud",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/pricing`,
    },
    description:
      "AI video studio for YouTube creators. Turn any topic into a ready-to-upload video with AI scripts, visuals, voiceover, and captions — fully automated.",
    featureList: [
      "AI Script Generation",
      "AI Images & Video Clips",
      "AI Voiceover",
      "Auto Captions",
      "Shorts & Standard Support",
    ],
    author: {
      "@type": "Organization",
      name: "VersaVid",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "127",
      bestRating: "5",
      worstRating: "1",
    },
    review: [
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Sarah Chen" },
        datePublished: "2024-01-15",
        reviewBody:
          "VersaVid cut my video production time from 6 hours to 20 minutes. The AI voiceovers sound incredibly natural.",
        reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Marcus Johnson" },
        datePublished: "2024-02-03",
        reviewBody:
          "Best investment for my faceless channel. The auto-captions alone are worth the price.",
        reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      },
    ],
  }),

  service: () => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: "VersaVid AI Video Generation",
    description:
      "Automated video creation service for YouTube creators. Generate scripts, visuals, voiceovers, and captions from a single topic.",
    provider: {
      "@type": "Organization",
      name: "VersaVid",
      url: SITE_URL,
    },
    areaServed: "Worldwide",
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${SITE_URL}/signup`,
      servicePhone: "+1-555-VERSVID",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "VersaVid Plans",
      itemListElement: [
        {
          "@type": "Offer",
          name: "Free",
          description: "3 free videos every month",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/pricing#free`,
        },
        {
          "@type": "Offer",
          name: "Pro",
          description: "100 credits/month for regular creators",
          price: "29",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/pricing#pro`,
        },
        {
          "@type": "Offer",
          name: "Studio",
          description: "500 credits/month for power users",
          price: "99",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/pricing#studio`,
        },
      ],
    },
  }),

  faq: (faqs: Array<{ question: string; answer: string }>) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }),

  breadcrumb: (items: Array<{ name: string; url: string }>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }),

  videoObject: (video: {
    name: string;
    description: string;
    thumbnailUrl: string[];
    uploadDate: string;
    duration: string;
    contentUrl?: string;
    embedUrl?: string;
    hasPart?: Array<{
      "@type": "Clip";
      name: string;
      startOffset: string;
      endOffset: string;
      url: string;
    }>;
  }) => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.name,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.uploadDate,
    duration: video.duration,
    contentUrl: video.contentUrl,
    embedUrl: video.embedUrl,
    hasPart: video.hasPart,
    publisher: {
      "@type": "Organization",
      name: "VersaVid",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo-light.png`,
      },
    },
  }),

  webSite: () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }),

  pricingTable: () => ({
    "@context": "https://schema.org",
    "@type": "PriceSpecification",
    priceCurrency: "USD",
    minPrice: "0",
    maxPrice: "99",
    valueAddedTaxIncluded: false,
  }),

  productSchema: (product: {
    name: string;
    description: string;
    price: number;
    currency: string;
    billingPeriod?: string;
    features: string[];
  }) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: {
      "@id": `${SITE_URL}#organization`,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/pricing`,
      priceCurrency: product.currency,
      price: product.price,
      availability: "https://schema.org/InStock",
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      ...(product.billingPeriod && {
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: product.price,
          priceCurrency: product.currency,
          billingDuration: product.billingPeriod,
        },
      }),
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127",
      bestRating: "5",
      worstRating: "1",
    },
    featureList: product.features,
  }),
};

export const pricingFaqs = [
  {
    question: "What is VersaVid?",
    answer:
      "VersaVid is an AI video studio that helps YouTube creators turn any topic into a fully produced video — script, visuals, voiceover, and captions — in minutes.",
  },
  {
    question: "Do I need video editing skills?",
    answer:
      "No. VersaVid handles everything from script writing to final render. You just provide a topic.",
  },
  {
    question: "Can I create YouTube Shorts?",
    answer:
      "Yes. VersaVid generates both standard 16:9 videos and 9:16 Shorts from the same topic automatically.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes. Start free with 3 videos every month — enough to create several videos and test the full pipeline.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards via Stripe. Annual plans get 20% off.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes. Cancel anytime from your dashboard. You keep access until the end of your billing period.",
  },
];

export const compareFaqs = [
  {
    question: "How is VersaVid different from video hosting platforms like Wistia or Vimeo?",
    answer:
      "Wistia and Vimeo are for hosting and distributing videos you've already created. VersaVid creates the videos for you — from script to final render — using AI. You can use VersaVid to create videos, then host them anywhere.",
  },
  {
    question: "How does VersaVid compare to AI avatar tools like Synthesia or HeyGen?",
    answer:
      "Synthesia and HeyGen specialize in talking-head avatar videos for training and corporate use. VersaVid creates faceless YouTube content with AI-generated B-roll, custom voiceovers, and dynamic editing — purpose-built for YouTube creators who want to stay off-camera.",
  },
  {
    question: "Can I use VersaVid alongside Mux?",
    answer:
      "Absolutely. Mux provides video infrastructure (encoding, delivery, analytics). VersaVid creates the content. Many developers use VersaVid's API to generate videos, then deliver them via Mux.",
  },
  {
    question: "Is VersaVid cheaper than hiring a video editor?",
    answer:
      "Yes. A professional editor charges $50–$200+ per video. VersaVid's Pro plan at $29/month gives you 100 credits (roughly 20–50 videos). That's under $1.50 per video — plus you get scripts, visuals, voice, and captions all included.",
  },
  {
    question: "Do I own the videos I create with VersaVid?",
    answer:
      "Yes. All videos created on paid plans include a commercial license. You own the output and can monetize it on YouTube, use in ads, sell courses, or anything else.",
  },
];

export const howItWorksFaqs = [
  {
    question: "How long does it take to create a video?",
    answer:
      "Most videos are ready in 2–5 minutes. Script generation takes ~30 seconds, visual/voice generation ~1–2 minutes, and rendering ~30–90 seconds depending on length and resolution.",
  },
  {
    question: "Can I edit the script or visuals before rendering?",
    answer:
      "Yes. You have full control to edit the script, regenerate specific visuals, swap voiceovers, and adjust caption styling before committing credits to render.",
  },
  {
    question: "What video formats and resolutions are supported?",
    answer:
      "Standard 16:9 (1920x1080, up to 4K) and vertical 9:16 for Shorts (1080x1920). MP4 output with H.264 encoding. MOV available on Studio plan.",
  },
  {
    question: "Do I own the videos I create?",
    answer:
      "Yes. All videos created on paid plans include a commercial license. You own the output and can monetize on YouTube, use in ads, sell courses, or anything else.",
  },
  {
    question: "Can I use my own voice or brand voice?",
    answer:
      "Studio plan includes custom AI voice cloning. Upload a sample and VersaVid will generate voiceovers in your voice. Pro plan includes 10+ built-in voices.",
  },
];

export const featureFaqs = [
  {
    question: "Can I edit the AI-generated script before creating the video?",
    answer:
      "Yes! You can review and edit the script at any point before generating visuals or voiceover. Full creative control.",
  },
  {
    question: "Do the AI voices sound robotic?",
    answer:
      "No. We use state-of-the-art neural voices that sound remarkably natural. Most viewers can't distinguish them from human narrators.",
  },
  {
    question: "Can I use my own images or video clips?",
    answer:
      "Absolutely. Upload your own assets and VersaVid will incorporate them alongside AI-generated content.",
  },
  {
    question: "What languages are supported for voiceover and captions?",
    answer:
      "We support 20+ languages including English, Spanish, French, German, Portuguese, Japanese, Korean, and more.",
  },
  {
    question: "Is there a limit on video length?",
    answer:
      "Standard plans support up to 10-minute videos. Enterprise plans support longer formats. Shorts are optimized for 60 seconds.",
  },
];

export function generateMetadata(page: {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogType?: "website" | "article" | "video.other";
  noIndex?: boolean;
  noFollow?: boolean;
}): Metadata {
  const url = `${SITE_URL}${page.path}`;
  const image = page.ogImage || `${SITE_URL}/images/og-default.jpg`;

  return {
    title: {
      default: page.title,
      template: `%s | ${SITE_NAME}`,
    },
    description: page.description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      siteName: SITE_NAME,
      type: page.ogType || "website",
      locale: "en_US",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [image],
      creator: "@VersavidAi",
      site: "@VersavidAi",
    },
    robots: {
      index: !page.noIndex,
      follow: !page.noFollow,
      googleBot: {
        index: !page.noIndex,
        follow: !page.noFollow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other: {
      "theme-color": "#000000",
    },
  };
}

export const defaultJsonLd = [
  structuredData.organization(),
  structuredData.webSite(),
  structuredData.softwareApplication(),
];