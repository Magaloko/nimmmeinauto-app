import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "../../../components/navbar";
import { ARTICLES, getArticle } from "@/lib/articles";

export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: `${article.title} · NimmMeinAuto Ratgeber`,
    description: article.description,
    alternates: { canonical: `https://nimmmeinauto.at/ratgeber/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `https://nimmmeinauto.at/ratgeber/${article.slug}`,
      type: "article",
      publishedTime: article.publishedAt,
      locale: "de_AT",
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    author: { "@type": "Organization", name: "NimmMeinAuto" },
    publisher: {
      "@type": "Organization",
      name: "NimmMeinAuto",
      logo: { "@type": "ImageObject", url: "https://nimmmeinauto.at/og-image.svg" },
    },
    mainEntityOfPage: `https://nimmmeinauto.at/ratgeber/${article.slug}`,
  };

  // Render simple markdown-lite: **bold** and paragraphs
  const paragraphs = article.body.split(/\n\n+/).map((block, i) => {
    if (block.startsWith("**") && block.endsWith("**")) {
      return (
        <h2 key={i} className="text-xl font-semibold text-foreground mt-8 mb-3">
          {block.replace(/\*\*/g, "")}
        </h2>
      );
    }
    return (
      <p key={i} className="text-foreground-muted leading-relaxed mb-4">
        {block}
      </p>
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="max-w-3xl mx-auto px-4 py-16">
        <nav aria-label="Brotkrume" className="text-sm text-foreground-muted mb-6">
          <Link href="/" className="hover:text-foreground">Startseite</Link>
          <span className="mx-2">/</span>
          <Link href="/ratgeber" className="hover:text-foreground">Ratgeber</Link>
        </nav>

        <div className="flex items-center gap-2 text-xs font-semibold mb-4">
          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">{article.category}</span>
          <span className="text-foreground-muted">· {article.readMinutes} min Lesezeit</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
          {article.title}
        </h1>
        <p className="text-foreground-muted text-lg mb-2">{article.description}</p>
        <time
          dateTime={article.publishedAt}
          className="text-sm text-foreground-muted"
        >
          {new Date(article.publishedAt).toLocaleDateString("de-AT", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>

        <article className="mt-10">{paragraphs}</article>

        <div className="mt-16 pt-8 border-t border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Weitere Artikel</h2>
          <div className="space-y-3">
            {ARTICLES.filter((a) => a.slug !== article.slug)
              .slice(0, 3)
              .map((a) => (
                <Link
                  key={a.slug}
                  href={`/ratgeber/${a.slug}`}
                  className="block p-4 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors"
                >
                  <div className="font-semibold text-foreground">{a.title}</div>
                  <div className="text-sm text-foreground-muted mt-1">{a.description}</div>
                </Link>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}
