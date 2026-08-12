# A&A Platform — ER & MongoDB Database Design Brief

## Purpose

This is the working database-design brief for Claude and the development team. It defines the business entities, relationships, ownership rules, lifecycles, financial traceability, and MongoDB modeling principles for the A&A platform.

**Important:** Design the ER model first. Do not jump directly to Mongoose schemas.

---

## 1. Product Scope

The platform supports:

1. Public Website
2. Admin Backend / CMS + Operations
3. Partner Portal
4. Client Portal
5. Payment / Webhook Layer

Business domains:

- Public service catalog
- Lead capture / CRM
- Case management
- Partner management
- Client management
- Services and pricing
- Tasks and workflows
- Documents and verification
- Payments
- Invoices
- Revenue share
- Partner statements
- Partner payouts
- Partner disputes
- Notifications
- Reports
- CMS
- Audit logs
- Settings

The client requirement describes a hierarchy in which Admin has complete control, Core Team access is permission-scoped, Channel Partners manage their own referrals/clients, and Clients see only their own records. fileciteturn2file0L55-L130

---

# 2. Architecture Direction

The current implementation decision is **MongoDB + Node.js/TypeScript**.

A separate architecture document recommends PostgreSQL for financial integrity, but this project is proceeding with MongoDB. Preserve the underlying integrity principles:

- Financial records must be auditable.
- Money-related operations should be append-oriented where appropriate.
- Historical calculations must be reproducible.
- Do not overwrite configuration that is needed to explain old transactions.
- Use MongoDB transactions for operations that require atomic multi-document writes.
- Use unique indexes for business identifiers and idempotency keys.
- Store sensitive documents in object storage rather than MongoDB binary data.

---

# 3. Business Hierarchy

```text
ADMIN HEAD
│
├── CORE TEAM MEMBERS
│
├── CHANNEL PARTNER A
│   ├── CLIENT A1
│   ├── CLIENT A2
│   └── CLIENT A3
│
├── CHANNEL PARTNER B
│   └── CLIENT B1
│
└── SELF CLIENTS
```

Roles and visibility are explicitly defined in the client requirement. fileciteturn2file0L55-L150

### Admin Head

Full control over website, services, users, partners, pricing, workflows, payments, revenue share, reports and CMS.

### Core Team

Permission-scoped access to assigned modules/cases/functions.

### Channel Partner

Can create referrals/leads, onboard/manage own clients, use permitted services, upload documents, make payments, track cases and revenue share.

### Client

Can manage own profile, requirements, documents, cases, payments and communication.

### Self Client

Direct website/Admin client with no partner relationship.

---

# 4. High-Level ERD

```text
USER
│
├────────── N:1 ────────── ROLE
│
├────────── 1:1 ────────── PARTNER
│                             │
│                             ├── 1:1 PARTNER_KYC
│                             ├── 1:N PARTNER_DOCUMENT
│                             ├── 1:N BANK_ACCOUNT
│                             ├── 1:N PARTNER_AGREEMENT
│                             └── N:M SERVICE
│
└────────── 1:1 ────────── CLIENT
                              │
                              └── 1:N CASE

PARTNER ───────────────┐
                       │
CLIENT ────────────────┼──► LEAD ──► CASE
                       │               │
SERVICE ───────────────┘               ├── 1:N TASK
                                       ├── 1:N DOCUMENT
                                       ├── 1:N MESSAGE
                                       ├── 1:N ACTIVITY
                                       ├── 1:N STATUS_HISTORY
                                       ├── 1:N INVOICE
                                       └── 1:N PAYMENT
                                              │
                                              ▼
                                       REVENUE_LEDGER
                                              │
                                              ▼
                                       PARTNER_STATEMENT
                                          │          │
                                          ▼          ▼
                                       PAYOUT      DISPUTE
```

Cross-cutting:

```text
USER ──► NOTIFICATION
USER ──► AUDIT_LOG
```

CMS:

```text
CMS_PAGE
PAGE_SECTION
SERVICE_CONTENT
FAQ
RESOURCE
TESTIMONIAL
MEDIA
```

---

# 5. Entity Inventory

## Identity

- User
- Role
- Permission

## Partner

- Partner
- PartnerKyc
- PartnerDocument
- BankAccount
- PartnerAgreement
- PartnerServiceAccess

## Client

- Client
- ClientDocument

## Services

- Service
- ServicePricing
- ServiceDocumentRequirement
- ServiceWorkflow
- ServiceRevenueRule

## CRM

- Lead

## Case Management

- Case
- CaseTask
- CaseDocument
- CaseMessage
- CaseActivity
- CaseStatusHistory

## Finance

- Invoice
- Payment
- Refund
- RevenueLedgerEntry
- PartnerStatement
- PartnerPayout
- PartnerDispute

## Platform

- Notification
- AuditLog
- Settings

## CMS

- CmsPage
- PageSection
- ServiceContent
- FAQ
- Resource
- Testimonial
- Media

---

# 6. Identity & Access

## User

Represents authentication identity, not the full business profile.

```js
{
  _id,
  externalAuthId,
  email,
  phone,
  firstName,
  lastName,
  roleId,
  status,
  lastLoginAt,
  createdAt,
  updatedAt
}
```

Statuses:

- INVITED
- ACTIVE
- SUSPENDED
- DEACTIVATED

Relationships:

```text
USER N:1 ROLE
USER 1:1 PARTNER
USER 1:1 CLIENT
USER 1:N AUDIT_LOG
USER 1:N NOTIFICATION
```

## Role / Permission

Roles contain or reference granular permissions.

Example:

```js
{
  _id,
  name: "CORE_TEAM",
  permissions: [
    "case.read",
    "case.process",
    "document.review"
  ]
}
```

Do not hard-code one permission set for all Core Team members.

---

# 7. Partner Domain

## Partner

A Partner is an external agency/referrer/business entity.

Relationships:

```text
PARTNER
├── 1:1 PARTNER_KYC
├── 1:N PARTNER_DOCUMENT
├── 1:N BANK_ACCOUNT
├── 1:N PARTNER_AGREEMENT
├── N:M SERVICE
├── 1:N CLIENT
├── 1:N LEAD
├── 1:N CASE
├── 1:N PARTNER_STATEMENT
└── 1:N PARTNER_PAYOUT
```

Suggested model:

```js
{
  _id,
  userId,
  partnerCode,
  partnerType,
  legalName,
  displayName,

  contact: {
    email,
    phone
  },

  tax: {
    pan,
    gstin
  },

  status,

  onboarding: {
    submittedAt,
    verifiedAt,
    verifiedBy
  },

  createdAt,
  updatedAt
}
```

Statuses:

- DRAFT
- PENDING_VERIFICATION
- ACTIVE
- SUSPENDED
- REJECTED

The Admin Panel requirement explicitly calls for Partner onboarding, KYC/profile, permitted services, commission/revenue-share rules, payment terms, bank details, tax details, status and user access. fileciteturn2file3L463-L491

## PartnerKyc

The client requirement confirms KYC/tax information, bank proof, agreement acceptance and Admin approval, but does **not** define the complete mandatory document list. Do not invent exact mandatory documents.

Suggested:

```js
{
  _id,
  partnerId,

  legalName,
  registrationNumber,

  taxIdentifiers: {
    pan,
    gstin
  },

  address: {
    line1,
    line2,
    city,
    state,
    postalCode,
    country
  },

  verificationStatus,
  submittedAt,
  reviewedAt,
  reviewedBy,

  createdAt,
  updatedAt
}
```

## PartnerDocument

Generic verification model:

```text
REQUESTED
   ↓
UPLOADED
   ↓
UNDER_REVIEW
   ├── ACCEPTED
   └── REJECTED
          ↓
   RE_UPLOAD_REQUIRED
```

```js
{
  _id,
  partnerId,
  documentType,
  documentCategory,

  fileId,
  storageKey,
  originalFileName,

  status,

  uploadedAt,
  reviewedBy,
  reviewedAt,
  rejectionReason,
  expiresAt,

  metadata,

  createdAt,
  updatedAt
}
```

Admin must be able to preview, accept, reject, request re-upload, record reasons, identify reviewer and track expiry.

## BankAccount

```js
{
  _id,
  partnerId,

  accountHolderName,
  accountNumberEncrypted,
  bankName,
  branchName,
  ifsc,

  verificationStatus,
  proofDocumentId,

  verifiedBy,
  verifiedAt,

  isPrimary,

  createdAt,
  updatedAt
}
```

Sensitive bank data should be protected and minimally exposed.

## PartnerAgreement

```js
{
  _id,
  partnerId,
  agreementVersion,
  documentId,
  acceptedAt,
  acceptedBy,
  status,
  createdAt
}
```

Agreement versions must remain historically identifiable.

## PartnerServiceAccess

Partner-to-Service is many-to-many.

```js
{
  _id,
  partnerId,
  serviceId,

  status,

  pricingOverrideId,
  revenueRuleId,

  enabledAt,
  disabledAt,

  createdAt,
  updatedAt
}
```

This supports Admin-controlled permitted services.

---

# 8. Client Domain

## Client

```text
CLIENT
├── 1:1 USER
├── N:1 PARTNER (nullable)
├── 1:N LEAD
├── 1:N CASE
└── 1:N CLIENT_DOCUMENT
```

Suggested:

```js
{
  _id,
  userId,
  clientCode,

  clientType,
  // INDIVIDUAL
  // BUSINESS

  acquisitionSource,
  // SELF
  // PARTNER

  partnerId,

  legalName,

  contact: {
    email,
    phone
  },

  status,

  createdAt,
  updatedAt
}
```

`partnerId` is null for Self Clients.

The client requirement explicitly distinguishes Partner Clients and Self Clients. fileciteturn2file0L135-L150

---

# 9. Service Domain

Services are central configuration entities.

Examples from the requirement:

- Income Tax Return Filing
- GST Registration & Compliance
- Company Incorporation & Registrations
- Accounting & Bookkeeping
- Foreign Accounting & Taxes
- Payroll Taxes — 940/941
- Withholding & W-2 Filings
- 1099 Filings

The public website must support Admin-controlled add/edit/hide/reorder/remove services, while service detail pages need description, eligibility, required documents, process, timeline, pricing/payment rules and FAQs. fileciteturn2file1L203-L217

## Service

```js
{
  _id,

  code,
  name,
  category,
  description,

  publicVisibility,
  clientAvailability,
  partnerAvailability,

  status,
  sortOrder,

  pricingConfig,
  paymentRuleConfig,
  revenueRuleConfig,
  slaConfig,

  createdAt,
  updatedAt
}
```

## ServicePricing

Pricing may be:

- Fixed
- Starting From
- Quote Based

Use versioning:

```js
{
  _id,
  serviceId,
  pricingType,
  amount,
  currency,
  effectiveFrom,
  effectiveTo,
  version,
  status,
  createdAt
}
```

## ServiceDocumentRequirement

This defines what a service requires. It is different from a file actually uploaded to a case.

```js
{
  _id,
  serviceId,
  documentType,
  label,
  required,
  allowedFileTypes,
  maxFileSize,
  expiryRequired,
  sortOrder,
  createdAt,
  updatedAt
}
```

## ServiceWorkflow

A service may have multiple stages/tasks.

```js
{
  _id,
  serviceId,
  version,

  stages: [
    {
      stageCode,
      name,
      sortOrder,

      tasks: [
        {
          taskCode,
          name,
          assignedRole,
          required,
          dueOffsetDays
        }
      ]
    }
  ],

  effectiveFrom,
  effectiveTo,
  createdAt
}
```

Tasks can be assigned to Core Team, Partner or Client. Maker/checker is possible for sensitive services.

## ServiceRevenueRule

Revenue-share rules must be versioned.

```js
{
  _id,

  serviceId,
  partnerId, // null = service-wide default

  ruleType,
  // PERCENTAGE
  // FIXED_AMOUNT

  value,
  tdsConfig,

  effectiveFrom,
  effectiveTo,
  version,

  createdAt
}
```

The requirement explicitly says rules may be partner+service, partner-specific, or service-wide and must retain effective-date/version information so old cases retain the applicable rule. fileciteturn2file4L700-L708

---

# 10. CRM / Lead Domain

A Lead and Case are different entities.

```text
LEAD
  │
  └── conversion
          ↓
        CASE
```

A lead may never become a case.

Relationships:

```text
LEAD
├── N:1 PARTNER
├── N:1 CLIENT (optional)
├── N:1 SERVICE
├── N:1 USER
└── 0:1 CASE
```

Suggested:

```js
{
  _id,
  leadNumber,

  source,
  partnerId,
  clientId,

  contactSnapshot,

  serviceId,

  status,
  assignedTo,

  notes,

  convertedAt,
  convertedCaseId,

  createdAt,
  updatedAt
}
```

Typical statuses:

- NEW
- CONTACTED
- QUALIFIED
- CONVERTED
- LOST

The platform explicitly distinguishes Lead from Case. fileciteturn2file1L219-L251

---

# 11. Case Domain

Case is the central operational entity.

A Case represents a particular client's request for a particular service.

Relationships:

```text
CASE
├── N:1 LEAD
├── N:1 CLIENT
├── N:1 PARTNER
├── N:1 SERVICE
├── N:1 USER
├── 1:N CASE_TASK
├── 1:N CASE_DOCUMENT
├── 1:N CASE_MESSAGE
├── 1:N CASE_ACTIVITY
├── 1:N CASE_STATUS_HISTORY
├── 1:N INVOICE
└── 1:N PAYMENT
```

Required case data includes:

- Case ID
- Lead ID
- Source
- Partner / Self Client
- Client ID
- Service
- Assigned team
- Priority
- Dates
- Due date
- Status
- Payment status
- Invoice status
- Revenue-share status
- Notes
- Documents
- Communication history
- Audit trail

The requirement also says original lead source and partner must remain permanently available for reporting/revenue-share purposes. fileciteturn2file1L375-L379

Suggested:

```js
{
  _id,
  caseNumber,
  leadId,

  source,
  partnerId,
  clientId,
  serviceId,

  serviceSnapshot: {
    code,
    name,
    category
  },

  pricingSnapshot,
  paymentRuleSnapshot,
  revenueRuleSnapshot,
  workflowSnapshot,

  assignedTo,
  priority,

  status,
  paymentStatus,
  invoiceStatus,
  revenueShareStatus,

  openedAt,
  dueAt,
  closedAt,

  notes,

  createdAt,
  updatedAt
}
```

---

# 12. Case Status Lifecycle

The client requirement defines:

```text
NEW LEAD
   ↓
PAYMENT PENDING
   ↓
OPEN
   ↓
IN PROCESS
   ├── WAITING FOR CLIENT
   ├── WAITING FOR PARTNER
   └── REVIEW
          ↓
        CLOSED
```

Alternate terminal path:

```text
CANCELLED / REFUNDED
```

The meaning of these states is explicitly described in the requirements. fileciteturn2file1L241-L371

Do not reduce these to a single generic "active" status.

---

# 13. CaseTask

```js
{
  _id,
  caseId,
  serviceWorkflowTaskId,

  title,
  description,

  assignedToUserId,
  assignedRole,

  status,
  priority,

  dueAt,
  completedAt,

  completionRequirements: {
    requiresDocument,
    requiresNote,
    requiresApproval,
    checklist
  },

  completedBy,

  createdAt,
  updatedAt
}
```

Tasks can be assigned to Core Team, Partner or Client. The client requirement says case closure should require mandatory tasks to be completed unless Admin overrides with a reason. fileciteturn2file4L755-L769

---

# 14. CaseDocument

A CaseDocument is an actual submitted/generated file.

```js
{
  _id,

  caseId,
  clientId,
  taskId,

  documentRequirementId,
  documentType,

  fileId,
  storageKey,
  originalFileName,

  status,

  uploadedBy,
  reviewedBy,
  reviewedAt,

  rejectionReason,
  expiresAt,

  isShareable,

  createdAt,
  updatedAt
}
```

Required document statuses:

- REQUESTED
- UPLOADED
- UNDER_REVIEW
- ACCEPTED
- REJECTED
- RE_UPLOAD_REQUIRED

The document requirements and status model are specified in the client document. fileciteturn2file4L771-L781

---

# 15. CaseMessage

Case-level communication:

```js
{
  _id,
  caseId,
  senderId,
  message,
  attachments,

  visibility,
  // INTERNAL
  // CLIENT_VISIBLE
  // PARTNER_VISIBLE
  // ALL_AUTHORIZED

  createdAt
}
```

Internal notes must not become client/partner-visible unless explicitly marked shareable.

---

# 16. CaseActivity

Append-only operational timeline:

```js
{
  _id,
  caseId,
  actorId,
  eventType,
  metadata,
  createdAt
}
```

Examples:

- Case created
- Task assigned
- Document uploaded
- Document accepted
- Payment received
- Case status changed
- Invoice issued
- Case closed

---

# 17. CaseStatusHistory

Do not store only the current status.

```js
{
  _id,
  caseId,
  fromStatus,
  toStatus,
  changedBy,
  reason,
  createdAt
}
```

This is required for history, SLA reporting and auditability.

---

# 18. Invoice

Invoice and Payment are separate.

```text
INVOICE 1:N PAYMENT
```

Suggested:

```js
{
  _id,
  invoiceNumber,

  caseId,
  clientId,

  amount,
  taxAmount,
  totalAmount,
  currency,

  status,
  // DRAFT
  // ISSUED
  // PARTIALLY_PAID
  // PAID
  // OVERDUE
  // CANCELLED

  dueAt,
  issuedAt,
  paidAt,

  createdAt,
  updatedAt
}
```

---

# 19. Payment

A Payment represents a transaction attempt/result.

```js
{
  _id,

  paymentNumber,

  caseId,
  invoiceId,
  clientId,
  partnerId,

  amount,
  currency,

  method,
  gateway,

  gatewayOrderId,
  gatewayPaymentId,

  status,
  // CREATED
  // PENDING
  // SUCCESS
  // FAILED
  // REFUNDED
  // PARTIALLY_REFUNDED

  idempotencyKey,

  verifiedAt,

  metadata,

  createdAt,
  updatedAt
}
```

The client requirement says the server must verify gateway success using the webhook, not rely only on browser redirect. fileciteturn2file3L629-L647

---

# 20. Refund

```js
{
  _id,
  paymentId,
  caseId,

  amount,
  reason,

  gatewayRefundId,
  status,

  initiatedBy,
  completedAt,

  createdAt
}
```

Refunds can affect case state and revenue-share eligibility.

---

# 21. Revenue Share

Revenue share must be ledger-driven.

Do not make a mutable:

```text
partner.totalCommission
```

the financial source of truth.

Use:

```text
PAYMENT
   ↓
REVENUE_LEDGER_ENTRY
   ↓
PARTNER_STATEMENT
   ↓
PARTNER_PAYOUT
```

---

# 22. RevenueLedgerEntry

```js
{
  _id,

  partnerId,
  caseId,
  paymentId,

  entryType,
  // EARNING
  // ADJUSTMENT
  // TDS
  // PAYOUT
  // REFUND_REVERSAL

  grossAmount,
  eligibleRevenue,

  partnerShareAmount,

  tdsAmount,
  otherDeductionAmount,

  netPayable,

  ruleSnapshot,

  statementId,

  status,

  createdAt
}
```

Any manual adjustment must require a reason and audit record. fileciteturn2file4L739-L753

---

# 23. PartnerStatement

The weekly statement/invoice cycle is:

```text
DRAFT
 ↓
UNDER_REVIEW
 ↓
ISSUED
 ↓
PARTNER_ACCEPTED
 ↓
T+2_ELIGIBLE
 ↓
SCHEDULED
 ↓
PAID
```

Alternate path:

```text
ISSUED
 ↓
DISPUTED
 ↓
RESOLVED / REISSUED
```

This lifecycle is defined in the requirements. fileciteturn2file4L710-L737

Suggested:

```js
{
  _id,
  statementNumber,
  partnerId,

  periodStart,
  periodEnd,

  lineItems: [
    {
      caseId,
      revenueLedgerEntryId,
      grossAmount,
      eligibleRevenue,
      partnerShare,
      adjustments,
      tds,
      netPayable
    }
  ],

  totals: {
    gross,
    eligibleRevenue,
    partnerShare,
    adjustments,
    tds,
    netPayable
  },

  status,

  reviewedBy,
  reviewedAt,
  acceptedAt,

  createdAt,
  updatedAt
}
```

If statement size becomes large, move line items into a separate collection.

---

# 24. PartnerPayout

```js
{
  _id,

  payoutNumber,

  partnerId,
  statementId,

  amount,

  status,
  // PENDING
  // SCHEDULED
  // PAID
  // FAILED
  // ON_HOLD

  scheduledAt,
  paidAt,

  paymentReference,
  utr,

  proofDocumentId,

  holdReason,

  createdAt,
  updatedAt
}
```

---

# 25. PartnerDispute

```js
{
  _id,

  partnerId,
  statementId,

  reason,
  amountDisputed,

  status,
  // OPEN
  // UNDER_REVIEW
  // RESOLVED
  // REJECTED

  raisedAt,
  resolvedAt,

  resolution,
  resolvedBy,

  createdAt,
  updatedAt
}
```

---

# 26. Notifications

```js
{
  _id,

  recipientUserId,

  type,
  title,
  message,

  entityType,
  entityId,

  channel,
  // IN_APP
  // EMAIL
  // SMS
  // WHATSAPP

  status,
  readAt,

  createdAt
}
```

Notification providers should be replaceable.

---

# 27. AuditLog

Audit logging is mandatory.

Important actions:

- Partner approval/rejection
- Document verification
- Payment changes
- Refunds
- Case status changes
- Revenue adjustments
- Payout changes
- Permission changes
- Service pricing changes
- Configuration changes

Suggested:

```js
{
  _id,

  actorUserId,

  action,

  entityType,
  entityId,

  before,
  after,

  reason,

  requestId,

  ipAddress,
  userAgent,

  createdAt
}
```

For financial/audit-sensitive events, prefer append-only records.

---

# 28. CMS

The Admin CMS manages:

- Homepage posters
- Hero images
- Service cards
- Text
- FAQs
- Testimonials
- Announcements
- Resources
- SEO metadata

Entities:

```text
CMS_PAGE
PAGE_SECTION
SERVICE_CONTENT
FAQ
RESOURCE
TESTIMONIAL
MEDIA
```

SEO fields:

```js
{
  title,
  metaDescription,
  keywords,
  slug,
  ogImage
}
```

The public website requirement explicitly calls for editable banners/images/text, service content and SEO fields. fileciteturn2file1L203-L217

---

# 29. MongoDB Modeling Principles

## Reference when

- Entity is high-volume
- Entity has an independent lifecycle
- Entity is queried independently
- Entity can grow without a practical bound
- Entity is shared by multiple parents

Examples:

```text
Case → Tasks
Case → Documents
Case → Messages
Partner → Cases
Client → Cases
Service → Cases
```

## Embed when

- Child is tightly owned
- Child is bounded in size
- Child is always read with parent
- Child has no meaningful independent lifecycle

Good candidates:

```text
Service → small configuration
Case → serviceSnapshot
Case → pricingSnapshot
Case → paymentRuleSnapshot
Case → revenueRuleSnapshot
```

Do not blindly embed all child entities.

---

# 30. Historical Snapshot Rule

This is mandatory.

Configuration can change:

- Service price
- Payment rule
- Partner share
- TDS configuration
- Workflow
- SLA

When a Case is created, retain immutable snapshots:

```text
case.serviceSnapshot
case.pricingSnapshot
case.paymentRuleSnapshot
case.revenueRuleSnapshot
case.workflowSnapshot
```

Historical cases must remain explainable even after Admin changes current configuration.

---

# 31. Ownership & Authorization

Database relationships are not authorization.

Every API must enforce ownership.

### Partner

Can access only records belonging to the authenticated Partner:

```text
partnerId = authenticatedPartnerId
```

for:

- Leads
- Clients
- Cases
- Documents
- Payments
- Revenue share
- Statements

### Client

Can access only:

```text
clientId = authenticatedClientId
```

for:

- Profile
- Cases
- Documents
- Tasks
- Payments
- Invoices
- Messages

### Core Team

Access depends on permissions and assigned scope.

### Admin

Full access.

---

# 32. Index Plan

Indexes should be finalized against real query patterns, but expected high-value indexes include:

## Users

```text
email UNIQUE
externalAuthId UNIQUE
roleId
status
```

## Partners

```text
partnerCode UNIQUE
userId UNIQUE
status
tax.gstin
```

## Clients

```text
clientCode UNIQUE
userId UNIQUE
partnerId
status
```

## Services

```text
code UNIQUE
status
publicVisibility
sortOrder
```

## Leads

```text
leadNumber UNIQUE
partnerId + status
clientId
serviceId
assignedTo
createdAt
```

## Cases

```text
caseNumber UNIQUE
clientId + status
partnerId + status
serviceId + status
assignedTo + status
status + dueAt
createdAt
```

## Payments

```text
paymentNumber UNIQUE
gatewayPaymentId UNIQUE where applicable
gatewayOrderId
caseId
invoiceId
status
createdAt
```

## Revenue Ledger

```text
partnerId + createdAt
caseId
statementId
```

## Statements

```text
statementNumber UNIQUE
partnerId + periodStart + periodEnd
status
```

## Documents

```text
partnerId + status
caseId + status
clientId + status
expiresAt
```

---

# 33. Idempotency

Payment/webhook processing must be idempotent.

Use unique identifiers such as:

- Gateway event ID
- Gateway payment ID
- Gateway order ID
- Idempotency key

A duplicate webhook must not create:

- Duplicate payment
- Duplicate invoice settlement
- Duplicate revenue ledger entry
- Duplicate notification

---

# 34. Transaction Boundaries

Consider MongoDB transactions for operations such as:

## Verified payment

```text
Payment update
+
Invoice update
+
Case status update
+
Revenue eligibility creation
+
Audit event
```

## Partner payout

```text
Payout creation
+
Statement status update
+
Ledger update
+
Audit event
```

Exact boundaries should be finalized during implementation.

---

# 35. Money Handling

Never use floating-point arithmetic for financial calculations.

Prefer minor units:

```js
{
  amountMinor: 500000,
  currency: "INR"
}
```

Representing ₹5,000.00.

Store currency and relevant:

- Gross amount
- Tax
- Discount/adjustment
- Partner share
- TDS
- Net payable

---

# 36. Current Status + History

Workflow entities should normally have:

```text
currentStatus
```

plus an append-only history.

Examples:

```text
Case.status
CaseStatusHistory[]

Document.status
DocumentVerificationHistory[]

Statement.status
StatementLifecycleHistory[]
```

Never reconstruct historical behavior only from the current state.

---

# 37. Open Questions — Do Not Invent

Before schema lock, confirm with the client:

## Partner KYC

- Exact mandatory KYC documents
- Individual vs agency/company requirements
- Registration certificate requirement
- Exact bank proof
- GSTIN requirement
- PAN requirement
- Document expiry
- Periodic re-verification

## Partner Agreement

- Agreement format
- E-sign vs acceptance
- Agreement versioning
- Renewal rules

## Client KYC

- Exact individual documents
- Exact business documents

## Services

- Final service catalog
- Categories
- Pricing
- Tax treatment
- SLA
- Workflow
- Required documents

## Revenue Share

- Exact share rules
- Fixed vs percentage
- Partner-specific overrides
- TDS rules
- Adjustment rules
- Refund impact

## Payments

- Final gateway
- Refund policy
- Partial payment behavior
- Milestone behavior
- Manual payment verification

## Payouts

- Weekly statement day
- Acceptance deadline
- T+2 interpretation
- Payout method
- Hold rules

Do not encode assumptions as permanent business rules.

---

# 38. Implementation Order

## Phase 1 — Identity

```text
users
roles
permissions
```

## Phase 2 — Business Masters

```text
partners
partnerKyc
partnerDocuments
bankAccounts
partnerAgreements
partnerServiceAccess

clients

services
servicePricing
serviceDocumentRequirements
serviceWorkflows
serviceRevenueRules
```

## Phase 3 — CRM

```text
leads
```

## Phase 4 — Case Management

```text
cases
caseTasks
caseDocuments
caseMessages
caseActivity
caseStatusHistory
```

## Phase 5 — Finance

```text
invoices
payments
refunds
revenueLedgerEntries
partnerStatements
partnerPayouts
partnerDisputes
```

## Phase 6 — Platform

```text
notifications
auditLogs
settings
```

## Phase 7 — CMS

```text
cmsPages
pageSections
serviceContent
faqs
resources
testimonials
media
```

---

# 39. Claude's Required Next Steps

Before writing Mongoose schemas:

### A. Review the ER model

Identify:

- Missing entities
- Redundant entities
- Missing relationships
- Incorrect cardinalities

### B. Produce the final collection map

For every entity:

```text
Collection
Purpose
References
Embedded objects
Indexes
Unique constraints
Lifecycle
```

### C. Decide embed vs reference

Explain each important decision.

### D. Produce Mongoose/TypeScript schemas

Only after the ER and collection map are coherent.

For each schema include:

- TypeScript interface/type
- Mongoose schema
- Validation
- Enums
- Indexes
- Timestamps
- Soft-delete strategy if appropriate

### E. Define APIs

For each domain:

```text
Create
Read
Update
Deactivate/Delete
Approve
Reject
State transition
```

### F. Define integrity rules

Cover:

- Transactions
- Idempotency
- Historical snapshots
- Audit logging
- Money representation
- Concurrency
- Ownership checks

### G. Seed data

Use only clearly fictional/demo data.

Do not invent real A&A clients, partners, financial figures, awards, certifications or other unsupported business claims.

---

# 40. Core Business Lifecycle

The database should ultimately represent:

```text
PROSPECT
   ↓
LEAD
   ↓
PAYMENT / REQUIREMENTS
   ↓
CASE
   ↓
TASKS + DOCUMENTS
   ↓
REVIEW
   ↓
COMPLETION
   ↓
REVENUE ELIGIBILITY
   ↓
PARTNER STATEMENT
   ↓
PARTNER ACCEPTANCE
   ↓
PAYOUT
```

With ownership:

```text
PARTNER → CLIENT → CASE → SERVICE
```

Operational accountability:

```text
USER → TASK → CASE
```

Financial traceability:

```text
PAYMENT → REVENUE LEDGER → STATEMENT → PAYOUT
```

The goal is a MongoDB model that is domain-driven, auditable, permission-safe, historically reproducible, and practical for a Node.js/TypeScript backend.
