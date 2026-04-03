import { Post } from "@/types";

interface JsonLdProps {
  post: Post;
}

export default function JsonLd({ post }: JsonLdProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "부놈의 경매이야기";

  const catLabels: Record<string, string> = {
    before: "입찰준비", bidding: "입찰·낙찰", after: "명도·출구",
    tax: "세금·대출", law: "권리분석", ai: "AI활용",
  };

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.meta_description || "",
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    author: {
      "@type": "Person",
      name: "부놈",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
      logo: { "@type": "ImageObject", url: `${siteUrl}/og-image.png` },
    },
    url: `${siteUrl}/posts/${post.slug}`,
    image: post.thumbnail_url || `${siteUrl}/og-image.png`,
    keywords: post.keywords || "",
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: siteName, item: siteUrl },
      { "@type": "ListItem", position: 2, name: catLabels[post.category] || post.category, item: `${siteUrl}/?category=${post.category}` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${siteUrl}/posts/${post.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
