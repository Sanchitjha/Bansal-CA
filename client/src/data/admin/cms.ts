// Mock data for the Admin Panel — CMS.

export type ContentStatus = "Draft" | "Preview" | "Published";

export interface CMSVersion {
  version: number;
  updatedBy: string;
  updatedDate: string;
  note: string;
}

export interface CMSPage {
  id: string;
  name: string;
  status: ContentStatus;
  lastUpdated: string;
  updatedBy: string;
  version: number;
  summary: string;
  history: CMSVersion[];
}

export const mockCmsPages: CMSPage[] = [
  { id: "homepage", name: "Homepage", status: "Published", lastUpdated: "2026-08-05", updatedBy: "Amit Bansal", version: 6, summary: "Hero headline, supporting text, CTA buttons and banner image.", history: [
    { version: 6, updatedBy: "Amit Bansal", updatedDate: "2026-08-05", note: "Updated hero headline for tax season." },
    { version: 5, updatedBy: "Priya Sharma", updatedDate: "2026-06-01", note: "Refreshed banner image." },
  ] },
  { id: "services", name: "Services", status: "Published", lastUpdated: "2026-07-20", updatedBy: "Amit Bansal", version: 9, summary: "Public service cards, order and descriptions.", history: [
    { version: 9, updatedBy: "Amit Bansal", updatedDate: "2026-07-20", note: "Added Foreign Accounting & Taxes card." },
  ] },
  { id: "about", name: "About", status: "Published", lastUpdated: "2026-05-11", updatedBy: "Amit Bansal", version: 3, summary: "Firm history, leadership and mission statement.", history: [
    { version: 3, updatedBy: "Amit Bansal", updatedDate: "2026-05-11", note: "Updated leadership bios." },
  ] },
  { id: "faqs", name: "FAQs", status: "Draft", lastUpdated: "2026-08-10", updatedBy: "Sanjay Kulkarni", version: 4, summary: "Frequently asked questions across services.", history: [
    { version: 4, updatedBy: "Sanjay Kulkarni", updatedDate: "2026-08-10", note: "Drafted new GST FAQ section, pending review." },
  ] },
  { id: "resources", name: "Resources", status: "Published", lastUpdated: "2026-06-28", updatedBy: "Arjun Nair", version: 5, summary: "Blog/resource articles for clients and prospects.", history: [
    { version: 5, updatedBy: "Arjun Nair", updatedDate: "2026-06-28", note: "Published new article on GST filing deadlines." },
  ] },
  { id: "testimonials", name: "Testimonials", status: "Preview", lastUpdated: "2026-08-09", updatedBy: "Priya Sharma", version: 2, summary: "Client testimonials shown on homepage and services pages.", history: [
    { version: 2, updatedBy: "Priya Sharma", updatedDate: "2026-08-09", note: "Added two new testimonials, awaiting publish." },
  ] },
  { id: "announcements", name: "Announcements", status: "Published", lastUpdated: "2026-08-01", updatedBy: "Amit Bansal", version: 7, summary: "Site-wide banner announcements.", history: [
    { version: 7, updatedBy: "Amit Bansal", updatedDate: "2026-08-01", note: "Posted tax filing deadline reminder." },
  ] },
  { id: "media", name: "Media", status: "Published", lastUpdated: "2026-07-15", updatedBy: "Arjun Nair", version: 12, summary: "Image and asset library used across the site.", history: [
    { version: 12, updatedBy: "Arjun Nair", updatedDate: "2026-07-15", note: "Uploaded new hero and team photos." },
  ] },
  { id: "seo", name: "SEO", status: "Published", lastUpdated: "2026-06-10", updatedBy: "Amit Bansal", version: 4, summary: "Per-page SEO metadata: title, description, keywords, OG image.", history: [
    { version: 4, updatedBy: "Amit Bansal", updatedDate: "2026-06-10", note: "Updated meta descriptions for service pages." },
  ] },
];
