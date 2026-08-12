# Amit Bansal & Associates — Platform Requirements

## Objective

Build a secure, scalable website and backend platform where the Admin Head controls the complete business, Channel Partners generate/manage leads and clients, Core Team members perform assigned work, and Clients can track their own service requests and required actions.

## 1. Business Model & Hierarchy

The system must support the following ownership hierarchy:

| Level | Role | Main Responsibility | Visibility |
|---|---|---|---|
| 1 | Admin Head / Super Admin | Complete control of website, services, partners, users, pricing, workflows, payments, revenue share, reports and CMS. | All data |
| 2 | Core Team Member | Complete assigned service tasks only; access controlled by role/permission. | Assigned modules/cases |
| 3 | Channel Partner | Create referrals/leads, onboard/manage own clients, make required advance payment, monitor cases and revenue share. | Own leads + own clients + permitted services |
| 4 | Client | Submit/track service requirements, upload documents, see status, make payments where applicable and communicate with team. | Own profile/cases only |
| 5 | Self Client | Client acquired directly from website/Admin without a Channel Partner. | Own profile/cases only; Admin sees all |

Hierarchy example:

```
ADMIN HEAD
│
├── Core Team Members (permission based)
│
├── Channel Partner A
│   ├── Client A1
│   ├── Client A2
│   └── Client A3
│
├── Channel Partner B
│   └── Client B1
│
└── Self Clients (direct website clients)
```

## 2. Core Principles

- Admin Head must have full control and a complete audit trail.
- Every case/lead must have a unique Case ID and a clear status history.
- A Channel Partner must only see its own leads, clients, permitted services, payments and revenue-share records.
- A Core Team member must only access the modules/cases/functions granted by the Admin.
- Clients must only see their own profile, services, documents, payments, tasks and communication.
- Services, pricing, partner commission/revenue share, forms, website banners, images and written content must be configurable from the Admin Panel without developer intervention wherever practical.
- Payment, invoice, TDS and revenue-share calculations should be configuration-driven rather than hard-coded.
- All important actions must be recorded in an audit log.

## 3. Public Website / Home Page

The public website should follow the attached design direction: professional, clean, finance/compliance oriented, navy + orange visual identity, responsive and conversion focused.

- Hero section with headline, supporting text, CTA buttons and editable image/banner.
- Core Services cards – examples: Income Tax Return Filing, GST Registration & Compliance, Company Incorporation & Registrations, Accounting & Bookkeeping, Foreign Accounting & Taxes, Payroll Taxes (940/941), Withholding & W-2 Filings, 1099 Filings.
- Admin-controlled service list: add, edit, hide, reorder or remove services.
- Service detail pages with description, eligibility, documents required, process, expected timeline, pricing/payment rules and FAQs.
- Direct client lead form: visitors can select service(s), enter details and submit a lead.
- Partner Login CTA.
- Client Login CTA.
- About Us, Resources/Blogs, Contact Us, FAQs, Privacy Policy, Terms & Conditions and Refund/Cancellation Policy.
- Editable banners/posters/images/text blocks through Admin CMS.
- SEO fields for each page/service: title, meta description, keywords, slug, OG image.

## 4. Lead & Case Management

The platform should distinguish between a Lead and a Case.

| Stage | Meaning | Typical Action |
|---|---|---|
| New Lead | Initial referral/request received. | Validate details and service requirement. |
| Payment Pending | Required advance has not yet been received. | Send payment link/reminder. |
| Open | Payment/requirements accepted and case is ready to start. | Assign to Core Team. |
| In Process | Work is actively being completed. | Tasks, documents and communication. |
| Waiting for Client | Action/document required from client. | Client receives task/notification. |
| Waiting for Partner | Partner action/confirmation required. | Partner receives task. |
| Review | Work completed by maker and awaiting review. | Reviewer/authorized member checks. |
| Closed | Service completed and case closed. | Archive + reporting + revenue share eligible. |
| Cancelled/Refunded | Case cancelled or payment reversed. | Adjustment to partner share if applicable. |

Required case fields:

- Case ID, Lead ID, source, Channel Partner / Self Client, Client ID, service/product, assigned team, priority, dates, due date, status, payment status, invoice status, revenue-share status, notes, documents, communication history and audit trail.
- Case ownership should never be dependent only on the current user; retain the original lead source and partner permanently for reporting and revenue-share calculation.

## 5. Channel Partner Portal

- Partner dashboard showing New Leads, Open, In Process, Waiting for Client/Partner, Closed, Payment Pending and Revenue Share.
- Create new referral/lead only for services permitted by Admin.
- Partner can select an existing client or create a new client.
- Partner can upload client documents, add notes and communicate with the Core Team as permitted.
- Partner can view service price/payment requirement before submitting.
- If a service requires 100% advance payment, the lead must move to 'Payment Pending' and cannot be processed until payment is successfully received.
- Partner must see payment receipt, invoice, case status and service timeline.
- Partner can see revenue-share ledger: eligible amount, adjustments, TDS, net payable, invoice status, acceptance status and payout status.
- Partner cannot change Admin-defined price, revenue-share percentage, TDS configuration or case ownership.
- Partner access must be limited to its own hierarchy.

## 6. Client Portal

- Client registration/login with secure authentication.
- Dashboard: active services, pending actions, documents required, payments, invoices, messages and completed services.
- Client can see only its own cases.
- Client can upload/download documents and respond to assigned tasks.
- Client can view service progress with a simple timeline.
- Client receives notifications for new task, document request, payment, status change, completion and important messages.
- Client may be linked under a Channel Partner or marked as Self Client.

## 7. Core Team / Employee Access Control

Use RBAC + case-level permissions. Admin should be able to create roles and grant individual permissions.

| Permission Type | Examples |
|---|---|
| Module | Cases, Clients, Services, Payments, Reports, Partners, Revenue, CMS, Settings |
| Action | View, Create, Edit, Assign, Approve, Close, Export, Delete/Archive |
| Scope | All records, assigned records, selected service, selected partner, selected case |
| Financial | View payments, approve refunds, view revenue share, approve payout |
| CMS | Edit banners, service descriptions, images, FAQs, pages |

Example: A Payroll team member may access only Payroll cases and only View + Process + Complete; they should not see Revenue, Partner Payouts or unrelated client cases.

## 8. Admin / Backend Panel

- Dashboard matching the attached reference: New Case, Open, In Process, Closed and other configurable KPIs.
- Filters: Channel Partner, Service/Product, Client, Team Member, Status, Date Range, Payment Status.
- Case hierarchy view: Channel Partner → Client → Service → Case → Tasks.
- Service/Product Master: create/edit/disable/reorder services; define description, documents, price, tax settings, payment rule, turnaround time, workflow and eligible partners.
- Partner Master: onboarding, KYC/profile, permitted services, commission/revenue-share rules, payment terms, bank details, tax details, status and user access.
- Client Master and self-client management.
- Team/User Master and permissions.
- CMS: homepage posters, hero images, service cards, text, FAQs, testimonials, announcements and resources.
- Workflow/Task Master.
- Payment and refund management.
- Invoice and revenue-share management.
- Reports and exports.
- Notification templates.
- Audit logs and system settings.

## 9. Service Configuration

Admin should be able to configure each service independently.

| Setting | Example |
|---|---|
| Service Name | Income Tax Return Filing |
| Category | Income Tax |
| Public Visibility | Yes/No |
| Partner Availability | All / Selected Partners |
| Client Availability | Yes/No |
| Pricing | Fixed / Starting From / Quote Based |
| Payment Rule | 100% Advance / Partial / Manual Approval |
| Partner Share | % or Fixed Amount |
| TDS Rule | Configured based on applicable tax setup |
| Documents | PAN, Aadhaar, Form 16, AIS etc. |
| SLA | e.g. 3 working days |
| Workflow | Lead → Payment → Assignment → Review → Close |

## 10. Payment Gateway & Payment Flow

Implement a payment-gateway abstraction so the system is not permanently tied to one provider. An Indian gateway such as Razorpay or Cashfree can be used initially, subject to commercial/technical approval.

1. Partner creates a lead for an eligible service.
2. System calculates the applicable price and displays the payment requirement.
3. For services marked '100% Advance', system creates a payment order/link.
4. Partner completes payment through the gateway.
5. Gateway webhook verifies success on the server; do not rely only on the browser redirect.
6. Payment receipt and transaction ID are stored against the Case/Order.
7. Case automatically moves from Payment Pending to Open after verified payment.
8. If payment fails, case remains Payment Pending and partner can retry.
9. Refund/cancellation must create a linked adjustment record and update revenue-share eligibility.

Payment gateway requirements:

- UPI, cards, net banking and other gateway-supported methods.
- Server-side webhook verification, idempotency and reconciliation.
- Payment status: Initiated, Pending, Success, Failed, Refunded, Partially Refunded.
- Automatic receipt generation.
- Admin reconciliation report against gateway settlement.
- Payment links for manual follow-up where required.
- No storage of card details on the application server.

## 11. Flexible Payment Rules

Not every service needs the same commercial rule. Admin must be able to choose:

- 100% advance – mandatory before work starts.
- Partial advance – e.g. configured percentage/amount.
- Quote/approval required – partner submits lead; Admin/Core Team finalizes price.
- Manual payment – Admin records payment received outside the gateway where permitted.
- Milestone payment – optional future phase for larger assignments.

## 12. Channel Partner Revenue Share

Revenue share should be calculated at the Case/Order level, not only at the partner level, so every amount is traceable.

| Field | Description |
|---|---|
| Gross Service Amount | Amount charged to client/partner for the service. |
| Eligible Revenue | Amount on which partner share is calculated, as configured. |
| Partner Share | Percentage or fixed amount configured for the partner/service. |
| Adjustments | Refund, cancellation, discount, credit note or other approved adjustment. |
| Gross Partner Payable | Eligible share after approved adjustments. |
| TDS | Tax deduction calculated as per applicable configuration/law and partner tax profile. |
| Net Payable | Gross partner payable minus applicable TDS/other approved deductions. |
| Payout Status | Pending / Invoice Created / Partner Accepted / Scheduled / Paid / Hold. |

Admin should support different revenue-share rules by:

- Partner + Service combination.
- Partner-specific fixed amount or percentage.
- Service-wide default rule.
- Effective date/version so old cases retain the rule applicable when they were created.

## 13. Weekly Partner Invoice & Payout Cycle

Recommended workflow for the current model:

1. At the end of each week, system identifies revenue-share eligible transactions.
2. System prepares a draft partner statement/invoice showing each Case/Order, gross amount, eligible revenue, partner share, adjustments, TDS and net payable.
3. Admin reviews/approves the weekly statement.
4. System generates the partner invoice/statement and sends it to the Channel Partner for acceptance.
5. Partner can Accept, Raise Dispute, or Request Clarification.
6. Accepted invoices enter the payout queue.
7. Payout becomes eligible on T+2 business days after acceptance, provided there is no hold/dispute/refund issue and payment settlement conditions are met.
8. System generates/records the payout transaction and marks the invoice Paid.
9. Payment proof/UTR/reference is stored against the payout.

Recommended statuses:

```
Draft → Under Review → Issued → Partner Accepted → T+2 Eligible → Scheduled → Paid
                                        ↘ Disputed → Resolved / Reissued
```

**Important:** TDS rate/section and GST/tax treatment should be configurable and reviewed by the tax/compliance team. Do not hard-code a tax rate into the software.

## 14. Revenue Share Ledger

- Partner-wise opening balance, additions, adjustments, TDS and payouts.
- Case-wise drill-down from partner total to individual transaction.
- Weekly statement, monthly statement and financial-year statement.
- Downloadable PDF/Excel statement.
- Partner can see only its own ledger.
- Admin can place a payout Hold with reason and release it later.
- Any adjustment must require a reason and be audit logged.

## 15. Tasks & Workflow Engine

- Admin can create task templates per service.
- A service can have multiple stages and tasks.
- Tasks can be assigned to Core Team, Partner or Client.
- Due dates, priority, reminders and escalation rules.
- Task completion may require document upload, checklist, note or approval.
- Maker/Checker option for sensitive services.
- Case cannot be closed until mandatory tasks are completed or Admin overrides with a reason.

## 16. Documents & Communication

- Secure document upload with file type/size validation.
- Documents grouped by Client, Case and Task.
- Document status: Requested, Uploaded, Under Review, Accepted, Rejected, Re-upload Required.
- Internal notes must not be visible to clients/partners unless explicitly marked shareable.
- Case-level message thread between authorized users.
- Email/SMS/WhatsApp notification integration should be designed as a replaceable provider layer.

## 17. Notifications

| Event | Admin | Partner | Client | Core Team |
|---|---|---|---|---|
| New lead | Yes | Yes | Optional | Yes if assigned |
| Payment success | Yes | Yes | Yes | Optional |
| Document requested | Optional | Yes | Yes | Yes |
| Status changed | Yes | Yes | Yes | Yes |
| Task due/overdue | Yes | Yes | Yes | Yes |
| Invoice issued | Yes | Yes | No | No |
| Invoice accepted/disputed | Yes | Yes | No | No |
| Payout paid | Yes | Yes | No | No |

## 18. Reports

- Lead source report: Partner vs Self Client.
- Partner performance: leads, conversions, revenue, cases, completion rate.
- Service-wise cases and revenue.
- Case status ageing.
- Pending client documents/tasks.
- Payment collection and failed payments.
- Refund/cancellation report.
- Partner revenue-share report.
- TDS deduction report.
- Weekly invoice and payout report.
- Team member workload and productivity.
- Customer/client acquisition report.

## 19. Dashboard KPIs

The attached dashboard is a good starting point. Recommended additions:

- New Leads, Payment Pending, Open, In Process, Waiting for Client, Review, Closed.
- Self Clients vs Partner Clients.
- Partner-wise lead/case summary.
- Service-wise summary.
- Pending payments and failed payments.
- Partner payout due / pending / paid.
- Tasks due today / overdue.
- Cases approaching SLA.
- Refunds/adjustments.

Revenue/financial figures should be kept in a controlled backend financial/revenue section if the public/home dashboard is intended to remain non-financial.

## 20. Admin CMS – No Developer Required for Routine Changes

- Homepage hero text, images, CTA labels and links.
- Service cards and service order.
- Service descriptions and FAQs.
- Promotional posters/banners.
- Testimonials.
- Announcements.
- Footer content and contact information.
- SEO metadata.
- Resource/blog content.
- Enable/disable sections.

Use draft → preview → publish workflow for important website content. Keep version history so Admin can restore an earlier version.

## 21. Security & Audit Requirements

- Role-based access control and least-privilege design.
- MFA/2FA for Admin and optionally Core Team/Partners.
- Strong password policy and secure session management.
- Encryption in transit (HTTPS) and appropriate encryption at rest.
- Server-side authorization on every protected API; never rely only on frontend hiding.
- Audit log for login, user creation, permission change, payment, refund, price change, service change, case status change, revenue-share change, invoice approval and payout.
- Regular database backups and disaster recovery plan.
- Rate limiting, input validation, CSRF/XSS/SQL injection protection and secure file upload controls.
- Admin action confirmation for high-risk actions such as refund, payout and permission changes.

## 22. Suggested Technical Architecture

Technology can be finalized by the developer, but the architecture should be modular.

| Layer | Requirement |
|---|---|
| Frontend | Responsive web app; separate Public Website, Admin, Partner Portal and Client Portal experiences. |
| Backend | REST/GraphQL API with authentication, authorization, workflow, payment and business rules. |
| Database | Relational database recommended for financial/case relationships and auditability. |
| File Storage | Private object storage; signed/temporary URLs for authorized downloads. |
| Payments | Gateway abstraction + webhooks + reconciliation. |
| Notifications | Email/SMS/WhatsApp provider abstraction. |
| Jobs/Queue | Background jobs for reminders, invoice generation, weekly statements and notifications. |
| Audit | Immutable/append-only style audit records with user/time/action/reference. |
| Reporting | Database views/reporting layer with Excel/PDF export. |

## 23. Core Database Entities

Initial entity list for developer/database design:

- Users
- Roles
- Permissions
- UserRolePermissions
- ChannelPartners
- PartnerServiceAccess
- Clients
- Services
- ServiceCategories
- ServicePricing
- PartnerRevenueShareRules
- Leads
- Cases
- CaseStatusHistory
- Tasks
- TaskTemplates
- Documents
- Payments
- PaymentTransactions
- Refunds
- Invoices
- PartnerStatements
- RevenueShareEntries
- TDSRecords
- Payouts
- Notifications
- Messages
- CMSPages
- CMSBlocks
- Media
- AuditLogs
- SystemSettings

## 24. Important Business Rules

| ID | Rule |
|---|---|
| BR-01 | Every lead must have a source: Channel Partner or Self Client. |
| BR-02 | Partner can only create leads for services assigned to that partner. |
| BR-03 | 100% advance services cannot move to processing until verified payment success. |
| BR-04 | Price and revenue-share rule used for a case must be snapshotted/versioned so later Admin changes do not silently alter historical transactions. |
| BR-05 | A partner cannot access another partner's clients/cases/revenue. |
| BR-06 | A client can access only its own records. |
| BR-07 | Core Team access is permission based and may be limited by service/case. |
| BR-08 | Every refund/discount/adjustment affecting partner share requires an authorized action and audit reason. |
| BR-09 | Weekly partner statements must be reproducible from transaction-level records. |
| BR-10 | Payouts must not be released while the relevant statement is disputed or on hold. |
| BR-11 | TDS/tax rules must be configurable and reviewed by the responsible tax professional. |
| BR-12 | Admin can override workflow only with a reason; override is logged. |

## 25. Recommended Partner Onboarding

- Partner application / Admin-created partner.
- Business and contact details.
- PAN, GSTIN where applicable, bank account details, cancelled cheque/bank proof and other required KYC/tax information.
- Agreement/terms acceptance.
- Admin approval.
- Assign services and revenue-share rules.
- Activate Partner Portal login.
- Keep verification status and document expiry/reminder where applicable.

## 26. Recommended Commercial Workflow – End to End

**A. Channel Partner Referral**

```
Partner Login → Select Client → Select Service → Create Lead → System Price/Quote →
Advance Payment → Payment Verification → Case Created → Core Team Assignment →
Tasks/Documents → Review → Completion → Case Closed → Revenue Share Eligible →
Weekly Statement → Partner Acceptance → T+2 Eligible → Payout → Paid
```

**B. Self Client**

```
Website → Service → Enquiry/Registration → Lead → Quote/Payment → Case →
Core Team → Client Tasks → Completion → Close
```

**C. Quote-Based Service**

```
Partner/Client Lead → Admin Review → Quote → Acceptance → Payment Rule Applied →
Case → Work → Completion
```

## 27. MVP vs Phase 2

| MVP – Build First | Phase 2 – Add Later |
|---|---|
| Public website + CMS | Advanced CRM/marketing automation |
| Admin dashboard | WhatsApp automation |
| Partner portal | Mobile apps |
| Client portal | AI document classification |
| Lead/case/task workflow | Advanced BI dashboards |
| RBAC permissions | Automated tax document extraction |
| Payment gateway + webhook | Multi-gateway routing |
| Invoices + partner revenue share | Milestone billing |
| Weekly statement + TDS fields | Advanced subscription/retainer billing |
| Documents + notifications | Customer satisfaction automation |
| Reports + audit log | API integrations with external accounting systems |

## 28. Acceptance Criteria for Developer

- Admin can create a service and publish it on the website without code changes.
- Admin can assign a service to selected Channel Partners.
- Partner can create a lead only for permitted services.
- 100% advance service cannot enter processing before verified payment.
- Admin/Core Team can assign tasks and track completion.
- Client can log in and see only its own work.
- Admin can grant a Core Team user access to one or more modules/services.
- Partner can see its own clients, cases and revenue-share ledger.
- System generates weekly partner statements with transaction-level detail.
- Partner can accept/dispute the statement.
- Accepted payout becomes T+2 eligible based on configured business rules.
- Admin can record/approve payout and partner can see payout status.
- TDS is calculated/stored using configurable rules and is not hard-coded.
- All financial and permission changes are audit logged.
- Admin can modify homepage content, banners, images and service information without developer support.
- Responsive design works on desktop, tablet and mobile.

## 29. Recommended Future Enhancements

- Partner referral tracking links / unique referral codes.
- Partner-specific landing pages and campaign tracking.
- Automated lead assignment based on service and workload.
- SLA escalation engine.
- Digital agreement/e-sign integration.
- Client e-signature for declarations/authorizations.
- Accounting software integration.
- Automated bank payout API, subject to bank/provider support.
- Advanced fraud/risk controls for payments.

## 30. Developer Deliverables

- UI/UX design files and responsive layouts.
- Frontend source code.
- Backend/API source code.
- Database schema and migration scripts.
- Admin, Partner and Client portals.
- Payment gateway integration and webhook documentation.
- Email/SMS/WhatsApp integration points.
- Deployment configuration and production setup.
- Role/permission matrix.
- API documentation.
- Database backup and restore procedure.
- Security checklist.
- Test cases/UAT checklist.
- Administrator/user manuals.
- Source-code ownership and deployment credentials handover as agreed in the development contract.

## 31. Key Recommendation to the Developer

Do not build this as only a normal company website. It should be designed as a combined Public Website + CRM/Lead Management + Case/Task Management + Partner Portal + Client Portal + Payment System + Revenue Share/Partner Settlement + Admin CMS platform. The most important design principle is configurable business rules: Admin should be able to add services, change prices, control partner access, change revenue-share rules, modify homepage content and control team permissions without requiring code changes for routine operations.

For financial/tax functionality, maintain transaction-level records and configurable tax parameters. The software should support the business process while the final tax/TDS treatment is confirmed by the responsible tax/compliance professional.

---

*END OF REQUIREMENT DOCUMENT*
