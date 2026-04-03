import { Post } from "@/types";

interface JsonLdProps {
  post: Post;
}

export default function JsonLd({ post }: JsonLdProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "토닥토닥 시니어";

  const catLabels: Record<string, string> = {
    health: "건강톡톡", subsidy: "지원금알리미", money: "돈이야기",
    travel: "어디갈까", digital: "스마트생활", food: "오늘뭐먹지",
    mind: "마음건강", legal: "생활법률",
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
      name: "마인드라",
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
