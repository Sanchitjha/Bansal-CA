import { articlesData } from "@/data/articles";
import Link from "next/link";

export default function ResourcesSection() {
  return (
    <section className="section" id="resources">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Knowledge Center</span>
          <h2>Latest resources & insights.</h2>
          <p>
            Stay informed with our regular compliance updates, business tax guides, and legal structures analyses.
          </p>
        </div>

        <div className="resources-grid">
          {articlesData.map((article) => (
            <article key={article.id} className="resource-card">
              <span className="resource-category">{article.category}</span>
              <h3 className="resource-title">
                <Link href={article.link}>{article.title}</Link>
              </h3>
              <p className="resource-summary">{article.summary}</p>
              <div className="resource-meta">
                <time dateTime={article.date}>{article.date}</time>
                <span>{article.readTime}</span>
              </div>
            </article>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "4.5rem" }}>
          <Link href="#final-cta" className="btn btn-secondary">
            Explore All Resources
          </Link>
        </div>
      </div>
    </section>
  );
}
