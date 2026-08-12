export interface ArticleItem {
  id: string;
  title: string;
  category: "Tax Update" | "Compliance Guide" | "Business Resource" | "Article";
  summary: string;
  date: string;
  readTime: string;
  link: string;
}

export const articlesData: ArticleItem[] = [
  {
    id: "navigating-new-compliance",
    title: "Navigating Corporate Tax Compliance: A Checklist for Small Businesses",
    category: "Compliance Guide",
    summary: "A comprehensive breakdown of key compliance filings, annual tax requirements, and document archiving guidelines to keep your business fully IRS-compliant.",
    date: "Aug 10, 2026",
    readTime: "5 min read",
    link: "#"
  },
  {
    id: "gst-input-tax-credit",
    title: "Understanding Input Tax Credit (ITC) Rules and Preventing Audits",
    category: "Tax Update",
    summary: "An in-depth explanation of recent updates to input tax credit matching, reconciling invoices with supplier returns, and avoiding audits caused by mismatched data.",
    date: "Jul 28, 2026",
    readTime: "7 min read",
    link: "#"
  },
  {
    id: "incorporation-vs-llp",
    title: "Private Limited vs. LLP: Choosing the Right Structure for Growth",
    category: "Business Resource",
    summary: "Analyzing the tax advantages, regulatory compliance loads, and investor preferences between LLCs, partnerships, and corporations to aid founders in their setup decision.",
    date: "Jun 15, 2026",
    readTime: "6 min read",
    link: "#"
  }
];
