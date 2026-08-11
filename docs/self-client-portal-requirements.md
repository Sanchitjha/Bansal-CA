# Self Client Portal — Requirements & Gap Analysis

## 1. Purpose & Scope

This document defines the tab/page structure required for the **Self Client Portal** (the authenticated area a Self Client lands in after login) and gap-analyzes it against the current codebase.

As of today, this repository contains **only the public marketing website** (`src/app/page.tsx` — a single scrolling page composed of `Hero → TrustBanner → ServiceGrid → WhyChooseUs → HowItWorks → AboutSection → ServiceDetailPreview → ResourcesSection → FAQAccordion → FinalCTA`). That public site is the front door through which a visitor becomes a **Self Client**. There is no registration/login, no authenticated portal, and no backend yet.

The backend (auth, lead/case data, payments, documents, notifications, etc.) will be built as a **separate backend service**, not inside this Next.js repo. This repo is frontend-only. Every gap below is therefore either a **frontend gap** (a route/component to build here), a **backend gap** (an API endpoint the separate service must expose), or both.

All section references (`§N`) below point to `docs/requirements.md`.

## 2. Self Client — Definition Recap

From `docs/requirements.md` §1 (hierarchy table, row 5):

> **Self Client** — "Client acquired directly from website/Admin without a Channel Partner." Visibility: "Own profile/cases only; Admin sees all."

A Self Client has the same visibility scope as any other Client (§6) — the only distinction is **acquisition source** (no Channel Partner in the chain), which must be recorded on the Client/Case record (§4, §6, BR-01).

The Self Client end-to-end flow, from §26-B:

```
Website → Service → Enquiry/Registration → Lead → Quote/Payment → Case →
Core Team → Client Tasks → Completion → Close
```

Note this flow has **no partner/revenue-share/payout steps** (unlike the Channel Partner Referral flow in §26-A) — it's a simpler, direct path from public website to closed case.

## 3. Self Client Portal — Tab/Page Structure

Once a Self Client logs in, the portal should expose the following tabs:

| Tab | Purpose | Source |
|---|---|---|
| **Dashboard** | Landing overview after login: active services, pending actions, recent notifications, quick status summary | §6 Client Portal |
| **My Services / Cases** | List of the client's own cases (Case ID, service, status, dates); drill into a case for full detail and a status timeline | §4 Lead & Case Management, §6 |
| **New Service Request** | Submit a new lead/enquiry for an additional service while already logged in, reusing the service catalog from the public site | §3 Public Website, §26-B |
| **Documents** | Upload/download documents grouped by case; visible status per document: Requested, Uploaded, Under Review, Accepted, Rejected, Re-upload Required | §16 Documents & Communication |
| **Payments & Invoices** | Payment history, a "Pay Now" action for pending advance/partial payments, invoice and receipt download | §6, §10 Payment Gateway, §11 Flexible Payment Rules |
| **Tasks / Action Required** | Tasks assigned to the client that need a response (document upload, approval, information request), with due dates | §6, §15 Tasks & Workflow Engine, §17 Notifications |
| **Messages** | Case-level communication thread with the assigned Core Team member(s) | §6, §16 |
| **Notifications** | In-app feed for new task, document request, payment, status change, and completion events | §17 Notifications |
| **My Profile / Account** | Personal details, password/security settings (optional MFA), and a read-only "Self Client" acquisition-type indicator | §1, §6, §21 Security & Audit |

### Tabs that must NOT appear for a Self Client

| Excluded tab | Reason |
|---|---|
| Revenue Share / Payout ledger, Partner statements | Channel Partner–only feature; a Self Client has no partner relationship (§5, §12–§14) |
| Other clients' cases/documents/payments | Violates client data isolation — a client sees only its own records (§6, BR-06) |
| Service/pricing/workflow configuration, CMS | Admin-only (§8, §9, §20); a client is not permitted to edit services or site content |
| Core Team task queues / internal notes | Internal notes are not client-visible unless explicitly marked shareable (§16); Core Team assignment views are role-restricted (§7) |

## 4. Gap Analysis

Everything below the public marketing shell is currently missing. Each row notes whether the gap is on the **frontend** (this repo), the **backend** (the separate service, not yet started), or both.

| Capability | Required by | Current status | Gap type | Notes |
|---|---|---|---|---|
| Client registration/login with secure auth | §6 | ❌ Missing | Frontend + Backend | No auth library in `package.json`, no `/login` or `/register` route under `src/app/`, no `middleware.ts`. The two "Login" links in `src/components/Navbar.tsx` (desktop link, mobile menu link) are dead `href="#"` placeholders with no handler |
| Lead capture form on the public website | §3, §26-B | ❌ Missing | Frontend | `Hero.tsx`'s "Get a Free Consultation" CTA links to the `#final-cta` anchor; `FinalCTA.tsx`'s CTA links to a `mailto:info@bansalassociates.com` address. Neither renders an actual form that captures service selection + visitor details + creates a lead |
| Lead/Case data model + unique Case ID | §2, §4 | ❌ Missing | Backend | No database or API exists. `src/data/*.ts` (`services.ts`, `faqs.ts`, `articles.ts`) is static marketing content only — there is no `Lead`, `Case`, or `Client` entity anywhere in the repo |
| Case status workflow (New Lead → Payment Pending → Open → In Process → ... → Closed) | §4 | ❌ Missing | Backend | No case entity or status machine exists to track this |
| Self Client Portal routes (dashboard, cases, documents, etc.) | §6 | ❌ Missing | Frontend | `src/app/` contains only the root `page.tsx`; no portal route group exists |
| Document upload/download + status tracking | §16 | ❌ Missing | Frontend + Backend | No file storage integration, no upload UI, no document entity |
| Payment gateway + webhook verification | §10 | ❌ Missing | Backend | No payment dependency (e.g. Razorpay/Cashfree SDK) in `package.json`; no webhook endpoint |
| "Pay Now" / invoice / receipt UI | §6, §10, §11 | ❌ Missing | Frontend | Depends on the payment gateway backend gap above |
| Tasks assigned to client + due dates/reminders | §6, §15 | ❌ Missing | Backend + Frontend | No task entity, no task templates, no reminder/escalation logic |
| Case-level messaging thread | §6, §16 | ❌ Missing | Backend + Frontend | No messaging data model or UI |
| Notifications (in-app + email/SMS/WhatsApp) | §17 | ❌ Missing | Backend + Frontend | No notification provider integration or in-app notification model |
| Self Client vs. Channel-Partner-linked flag on the client record | §1, §6, BR-01 | ❌ Missing | Backend | No client entity exists yet to hold this flag; every lead must record its source per BR-01 |
| Audit log of client-initiated actions | §21 | ❌ Missing | Backend | No audit mechanism exists anywhere in the repo |
| Client data isolation (a client sees only its own records) | §6, BR-06 | ❌ Not applicable yet | Backend | Cannot be implemented/tested without auth and a data model first |
| Public marketing pages (services, about, FAQ, resources, contact) | §3 | ✅ Present | — | Existing landing-page sections (`ServiceGrid`, `AboutSection`, `FAQAccordion`, `ResourcesSection`, `Footer`) |
| Service detail content (description, docs required, process, timeline, pricing, FAQs) | §3 | ✅ Present | — | `src/data/services.ts` already models this per-service (`ServiceDetailSection`), rendered by `ServiceDetailPreview.tsx` |

## 5. Recommended Immediate Next Steps

1. **Define the frontend↔backend API contract first** — auth endpoints (register/login/session), and case/lead/document/payment/notification endpoints — since every tab in §3 above depends on it. This lets frontend and backend work in parallel once agreed.
2. **Build the real lead-capture form** on the public site (§3 gap) — this is the entry point that creates the first Lead/Case for a Self Client and is needed regardless of which backend endpoint order is chosen.
3. **Stand up auth** (registration/login) as the first portal capability, since every other tab in §3 requires a logged-in, identified Self Client.
4. Once auth + a minimal Case/Lead endpoint exist, build the **Dashboard** and **My Services/Cases** tabs first (highest-value, lowest-dependency), then layer in Documents, Payments, Tasks, Messages, and Notifications as their respective backend endpoints become available.
