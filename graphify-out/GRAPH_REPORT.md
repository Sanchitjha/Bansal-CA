# Graph Report - .  (2026-08-12)

## Corpus Check
- 50 files · ~66,001 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 266 nodes · 349 edges · 50 communities (13 shown, 37 thin omitted)
- Extraction: 96% EXTRACTED · 3% INFERRED · 1% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.75)
- Token cost: 0 input · 289,128 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Self-Client Portal Pages|Self-Client Portal Pages]]
- [[_COMMUNITY_Business Requirements Doc|Business Requirements Doc]]
- [[_COMMUNITY_Self-Client Mock Data Types|Self-Client Mock Data Types]]
- [[_COMMUNITY_App Router Layouts & Pages|App Router Layouts & Pages]]
- [[_COMMUNITY_Marketing Landing Sections|Marketing Landing Sections]]
- [[_COMMUNITY_AGENTS.md Architecture Rules|AGENTS.md Architecture Rules]]
- [[_COMMUNITY_Root Layout & Fonts|Root Layout & Fonts]]
- [[_COMMUNITY_Marketing Components & Mock Data|Marketing Components & Mock Data]]
- [[_COMMUNITY_Next.jsVercel Boilerplate|Next.js/Vercel Boilerplate]]
- [[_COMMUNITY_CustomEvent Service Preview Pattern|CustomEvent Service Preview Pattern]]
- [[_COMMUNITY_Data-Driven Content Files|Data-Driven Content Files]]
- [[_COMMUNITY_Build & Lint Config|Build & Lint Config]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_FAQ Accordion + Data|FAQ Accordion + Data]]
- [[_COMMUNITY_Resources Section + Articles|Resources Section + Articles]]
- [[_COMMUNITY_Portal Logout Flow|Portal Logout Flow]]
- [[_COMMUNITY_Global CSS Styling Pattern|Global CSS Styling Pattern]]
- [[_COMMUNITY_MVP vs Phase 2 Scope|MVP vs Phase 2 Scope]]
- [[_COMMUNITY_FAQ Item Type|FAQ Item Type]]
- [[_COMMUNITY_Article Item Type|Article Item Type]]
- [[_COMMUNITY_Document Type|Document Type]]
- [[_COMMUNITY_Task Type|Task Type]]
- [[_COMMUNITY_Message Type|Message Type]]
- [[_COMMUNITY_Notification Type|Notification Type]]
- [[_COMMUNITY_Profile Type|Profile Type]]
- [[_COMMUNITY_Service Item Type|Service Item Type]]
- [[_COMMUNITY_Service Detail Section Type|Service Detail Section Type]]
- [[_COMMUNITY_Why Choose Us Component|Why Choose Us Component]]
- [[_COMMUNITY_Hero Component|Hero Component]]
- [[_COMMUNITY_FAQ Toggle Function|FAQ Toggle Function]]
- [[_COMMUNITY_Trust Banner Component|Trust Banner Component]]
- [[_COMMUNITY_About Section Component|About Section Component]]
- [[_COMMUNITY_Final CTA Component|Final CTA Component]]
- [[_COMMUNITY_Portal Login Function|Portal Login Function]]
- [[_COMMUNITY_Mark Task Done Function|Mark Task Done Function]]
- [[_COMMUNITY_Mark Document Uploaded Function|Mark Document Uploaded Function]]
- [[_COMMUNITY_Send Message Function|Send Message Function]]
- [[_COMMUNITY_Mark Notification Read Function|Mark Notification Read Function]]
- [[_COMMUNITY_Mark All Notifications Read Function|Mark All Notifications Read Function]]
- [[_COMMUNITY_Slugify Status Function|Slugify Status Function]]
- [[_COMMUNITY_Future Enhancements|Future Enhancements]]
- [[_COMMUNITY_Globe Icon Asset|Globe Icon Asset]]
- [[_COMMUNITY_Window Icon Asset|Window Icon Asset]]
- [[_COMMUNITY_File Icon Asset|File Icon Asset]]
- [[_COMMUNITY_Next.js Logo Asset|Next.js Logo Asset]]
- [[_COMMUNITY_Vercel Logo Asset|Vercel Logo Asset]]
- [[_COMMUNITY_Team Photo Asset|Team Photo Asset]]
- [[_COMMUNITY_Consultation Photo Asset|Consultation Photo Asset]]

## God Nodes (most connected - your core abstractions)
1. `useSelfClient()` - 27 edges
2. `useSelfClient hook` - 13 edges
3. `Gap Analysis Table` - 13 edges
4. `SelfClientProvider component` - 11 edges
5. `Self Client Portal Tab/Page Structure` - 11 edges
6. `SelfClientCaseDetailPage` - 10 edges
7. `SelfClientDashboardPage` - 7 edges
8. `StatusBadge component` - 7 edges
9. `Self Client Portal — Requirements & Gap Analysis` - 7 edges
10. `servicesData` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Single Long-Scrolling Landing Page Architecture` --semantically_similar_to--> `Key Recommendation: Configurable Business Rules Platform`  [INFERRED] [semantically similar]
  CLAUDE.md → docs/requirements.md
- `Cross-Component CustomEvent Communication Pattern` --semantically_similar_to--> `Suggested Technical Architecture`  [INFERRED] [semantically similar]
  CLAUDE.md → docs/requirements.md
- `generate-agent-files.js (AGENTS.md marker source)` --conceptually_related_to--> `next.config.ts nextConfig`  [AMBIGUOUS]
  node_modules/next/dist/server/lib/generate-agent-files.js → next.config.ts
- `Gap Analysis Table` --references--> `src/data/services.ts`  [EXTRACTED]
  docs/self-client-portal-requirements.md → CLAUDE.md
- `eslint.config.mjs eslintConfig` --conceptually_related_to--> `next.config.ts nextConfig`  [INFERRED]
  eslint.config.mjs → next.config.ts

## Hyperedges (group relationships)
- **Case-centric data aggregation across portal pages** — selfclientprovider_useselfclient, page_selfclientcasedetailpage, page_documentspage, page_paymentspage, page_taskspage, page_messagespage [INFERRED 0.85]
- **Self-client authentication gating flow (provider -> login redirect -> portal layout)** — layout_selfclientsegmentlayout, page_selfclientloginpage, layout_selfclientportallayout, selfclientprovider_useselfclient [EXTRACTED 1.00]
- **Shared StatusBadge rendering across portal list pages** — statusbadge_statusbadge, page_selfclientdashboardpage, page_documentspage, page_taskspage, page_paymentspage, page_selfclientcasespage [EXTRACTED 1.00]
- **Cross-section service selection via CustomEvent** — navbar_navbar, servicegrid_servicegrid, servicedetailpreview_servicedetailpreview [EXTRACTED 1.00]
- **isActive/order filter-and-sort convention over data arrays** — servicegrid_servicegrid, navbar_navbar, footer_footer, servicedetailpreview_servicedetailpreview, faqaccordion_faqaccordion, services_servicesdata [INFERRED 0.90]
- **Self Client portal shell components sharing session/state context** — selfclientprovider_selfclientprovider, portaltopbar_portaltopbar, portalsidebar_portalsidebar, statusbadge_statusbadge [INFERRED 0.85]
- **Business Model Role Hierarchy (Admin Head, Core Team, Channel Partner, Client, Self Client)** — requirements_admin_head, requirements_core_team_member, requirements_channel_partner, requirements_client, requirements_self_client [EXTRACTED 1.00]
- **Revenue Share & Weekly Payout Cycle** — requirements_revenue_share, requirements_weekly_partner_invoice_payout_cycle, requirements_revenue_share_ledger, requirements_channel_partner_portal [EXTRACTED 1.00]
- **Self Client Portal Tab Set** — selfclient_dashboard_tab, selfclient_my_services_cases_tab, selfclient_new_service_request_tab, selfclient_documents_tab, selfclient_payments_invoices_tab, selfclient_tasks_action_required_tab, selfclient_messages_tab, selfclient_notifications_tab, selfclient_profile_account_tab [EXTRACTED 1.00]

## Communities (50 total, 37 thin omitted)

### Community 0 - "Self-Client Portal Pages"
Cohesion: 0.1
Nodes (18): SelfClientCasesPage(), DocumentsPage(), UPLOADABLE_STATUSES, SelfClientCaseDetailPage(), SelfClientLoginPage(), MessagesPage(), NotificationsPage(), PaymentsPage() (+10 more)

### Community 1 - "Business Requirements Doc"
Cohesion: 0.11
Nodes (32): src/app/page.tsx, Acceptance Criteria for Developer, Admin Head / Super Admin Role, Important Business Rules (BR-01..BR-12), Channel Partner Role, Client Role, Client Portal, Recommended Commercial Workflow End-to-End (+24 more)

### Community 2 - "Self-Client Mock Data Types"
Cohesion: 0.1
Nodes (24): CaseStatus, CaseStatusEvent, DocumentStatus, mockCases, mockDocuments, mockMessages, mockNotifications, mockPayments (+16 more)

### Community 3 - "App Router Layouts & Pages"
Cohesion: 0.15
Nodes (25): RootLayout, SelfClientPortalLayout, SelfClientSegmentLayout, DocumentsPage, downloadMockInvoice, Home (landing page), MessagesPage, NewServiceRequestPage (+17 more)

### Community 4 - "Marketing Landing Sections"
Cohesion: 0.09
Nodes (4): ArticleItem, articlesData, FAQItem, faqsData

### Community 5 - "AGENTS.md Architecture Rules"
Cohesion: 0.1
Nodes (22): AGENTS.md (Next.js Agent Rules), node_modules/next/dist/server/lib/generate-agent-files.js, node_modules/next/dist/docs/, Non-Standard Next.js Breaking-Changes Notice, CLAUDE.md (Agent Guidance), src/app/layout.tsx, Single Long-Scrolling Landing Page Architecture, tsconfig.json (@/* alias) (+14 more)

### Community 6 - "Root Layout & Fonts"
Cohesion: 0.12
Nodes (8): cormorantGaramond, metadata, plusJakartaSans, ServiceDetailSection, ServiceItem, servicesData, activeServices, NewServiceRequestPage()

### Community 7 - "Marketing Components & Mock Data"
Cohesion: 0.12
Nodes (17): Footer component, HowItWorks component, Navbar component, mockCases, mockDocuments, mockMessages, mockNotifications, mockPayments (+9 more)

### Community 8 - "Next.js/Vercel Boilerplate"
Cohesion: 0.5
Nodes (4): create-next-app, Geist Font (next/font), Next.js Framework, Vercel Deployment Platform

### Community 9 - "CustomEvent Service Preview Pattern"
Cohesion: 0.5
Nodes (5): Cross-Component CustomEvent Communication Pattern, Navbar.tsx, select-preview-service CustomEvent, ServiceDetailPreview.tsx, Suggested Technical Architecture

### Community 10 - "Data-Driven Content Files"
Cohesion: 0.5
Nodes (4): src/data/articles.ts, Content Is Data-Driven, Not Hardcoded, src/data/faqs.ts, src/data/services.ts

### Community 11 - "Build & Lint Config"
Cohesion: 0.67
Nodes (3): eslint.config.mjs eslintConfig, generate-agent-files.js (AGENTS.md marker source), next.config.ts nextConfig

## Ambiguous Edges - Review These
- `next.config.ts nextConfig` → `generate-agent-files.js (AGENTS.md marker source)`  [AMBIGUOUS]
  next.config.ts · relation: conceptually_related_to
- `Channel Partner Role` → `Self Client Role`  [AMBIGUOUS]
  docs/requirements.md · relation: conceptually_related_to

## Knowledge Gaps
- **93 isolated node(s):** `eslintConfig`, `nextConfig`, `cormorantGaramond`, `plusJakartaSans`, `metadata` (+88 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **37 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `next.config.ts nextConfig` and `generate-agent-files.js (AGENTS.md marker source)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Channel Partner Role` and `Self Client Role`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `useSelfClient()` connect `Self-Client Portal Pages` to `Self-Client Mock Data Types`, `Root Layout & Fonts`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `Gap Analysis Table` connect `Business Requirements Doc` to `CustomEvent Service Preview Pattern`, `Data-Driven Content Files`, `AGENTS.md Architecture Rules`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `SelfClientProvider component` (e.g. with `HowItWorks component` and `Navbar component`) actually correct?**
  _`SelfClientProvider component` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `eslintConfig`, `nextConfig`, `cormorantGaramond` to the rest of the system?**
  _93 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Self-Client Portal Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._