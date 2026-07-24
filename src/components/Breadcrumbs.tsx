import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav
      className="mb-8"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center gap-2 text-[12px]">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-2">
            {index > 0 && (
              <span className="text-white/30" aria-hidden="true">/</span>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="text-white/50 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-white font-medium" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

interface JsonLdBreadcrumbsProps {
  items: Array<{ name: string; url: string }>;
}

export function JsonLdBreadcrumbs({ items }: JsonLdBreadcrumbsProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  if (typeof window === "undefined") {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    );
  }
  return null;
}