// Mock data for the Admin Panel — Services / Product Master.

export type ServiceStatus = "Active" | "Hidden" | "Draft";
export type PricingModel = "Fixed" | "Starting From" | "Quote Based";
export type PaymentRule = "100% Advance" | "Partial Advance" | "Quote Required" | "Manual" | "Milestone";

export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  pricingModel: PricingModel;
  price?: number;
  paymentRule: PaymentRule;
  partnerSharePct: number;
  tdsPct: number;
  slaDays: number;
  requiredDocuments: string[];
  workflow: string[];
  status: ServiceStatus;
  publicVisibility: boolean;
  updatedDate: string;
}

export const mockServices: Service[] = [
  {
    id: "income-tax", name: "Income Tax Return Filing", category: "Income Tax",
    description: "End-to-end preparation and e-filing of individual/business income tax returns.",
    pricingModel: "Fixed", price: 75, paymentRule: "100% Advance", partnerSharePct: 15, tdsPct: 10, slaDays: 5,
    requiredDocuments: ["PAN Card", "Form 16", "Bank Statements", "AIS"], workflow: ["Lead", "Payment", "Assignment", "Review", "Close"],
    status: "Active", publicVisibility: true, updatedDate: "2026-07-20",
  },
  {
    id: "gst-compliance", name: "GST Registration & Compliance", category: "GST",
    description: "New GST registration and ongoing monthly/quarterly return compliance.",
    pricingModel: "Starting From", price: 40, paymentRule: "100% Advance", partnerSharePct: 12, tdsPct: 10, slaDays: 7,
    requiredDocuments: ["PAN Card", "Address Proof", "Bank Statement"], workflow: ["Lead", "Payment", "Assignment", "Review", "Close"],
    status: "Active", publicVisibility: true, updatedDate: "2026-07-18",
  },
  {
    id: "company-incorporation", name: "Company Incorporation & Registrations", category: "Company Law",
    description: "Private limited / LLP incorporation with all statutory registrations.",
    pricingModel: "Fixed", price: 150, paymentRule: "100% Advance", partnerSharePct: 10, tdsPct: 10, slaDays: 10,
    requiredDocuments: ["PAN Card", "Aadhaar", "Address Proof", "Digital Signature"], workflow: ["Lead", "Payment", "Assignment", "Review", "Close"],
    status: "Active", publicVisibility: true, updatedDate: "2026-06-30",
  },
  {
    id: "accounting-bookkeeping", name: "Accounting & Bookkeeping", category: "Accounting",
    description: "Monthly bookkeeping, ledger maintenance and financial statement preparation.",
    pricingModel: "Quote Based", paymentRule: "Quote Required", partnerSharePct: 15, tdsPct: 10, slaDays: 15,
    requiredDocuments: ["Sales Invoices", "Purchase Bills", "Bank Statements"], workflow: ["Lead", "Quote", "Payment", "Assignment", "Review", "Close"],
    status: "Active", publicVisibility: true, updatedDate: "2026-07-01",
  },
  {
    id: "foreign-accounting", name: "Foreign Accounting & Taxes", category: "International",
    description: "Cross-border accounting, compliance and tax coordination for overseas entities.",
    pricingModel: "Quote Based", paymentRule: "Quote Required", partnerSharePct: 8, tdsPct: 10, slaDays: 20,
    requiredDocuments: ["Entity Registration Docs", "Prior Year Filings"], workflow: ["Lead", "Quote", "Payment", "Assignment", "Review", "Close"],
    status: "Active", publicVisibility: true, updatedDate: "2026-05-12",
  },
  {
    id: "payroll-taxes", name: "Payroll Taxes (940/941)", category: "Payroll",
    description: "Federal payroll tax filing and deposits (Forms 940/941).",
    pricingModel: "Fixed", price: 60, paymentRule: "Partial Advance", partnerSharePct: 12, tdsPct: 10, slaDays: 5,
    requiredDocuments: ["Payroll Register", "EIN Confirmation"], workflow: ["Lead", "Payment", "Assignment", "Review", "Close"],
    status: "Active", publicVisibility: true, updatedDate: "2026-04-22",
  },
  {
    id: "w2-filings", name: "Withholding & W-2 Filings", category: "Payroll",
    description: "Annual W-2/W-3 preparation and filing for employers.",
    pricingModel: "Starting From", price: 45, paymentRule: "100% Advance", partnerSharePct: 12, tdsPct: 10, slaDays: 5,
    requiredDocuments: ["Payroll Summary", "EIN Confirmation"], workflow: ["Lead", "Payment", "Assignment", "Review", "Close"],
    status: "Draft", publicVisibility: false, updatedDate: "2026-08-02",
  },
  {
    id: "1099-filings", name: "1099 Filings", category: "Payroll",
    description: "Preparation and e-filing of 1099-NEC/MISC forms for contractors.",
    pricingModel: "Starting From", price: 35, paymentRule: "Manual", partnerSharePct: 10, tdsPct: 10, slaDays: 4,
    requiredDocuments: ["Contractor W-9s", "Payment Ledger"], workflow: ["Lead", "Assignment", "Review", "Close"],
    status: "Hidden", publicVisibility: false, updatedDate: "2026-03-15",
  },
];
