// Mock data for the Admin Panel — Channel Partner Revenue Share.

export type LedgerStatus = "Pending" | "Included in Statement" | "Paid";

export interface LedgerEntry {
  id: string;
  partnerId: string;
  partnerName: string;
  caseId: string;
  serviceName: string;
  grossAmount: number;
  partnerShare: number;
  tds: number;
  adjustments: number;
  netPayable: number;
  status: LedgerStatus;
  date: string;
}

export const mockLedgerEntries: LedgerEntry[] = [
  { id: "LDG-1", partnerId: "PTR-101", partnerName: "Zenith Advisors", caseId: "AA-CASE-1102", serviceName: "GST Registration & Compliance", grossAmount: 40, partnerShare: 6, tds: 0.6, adjustments: 0, netPayable: 5.4, status: "Included in Statement", date: "2026-08-10" },
  { id: "LDG-2", partnerId: "PTR-101", partnerName: "Zenith Advisors", caseId: "AA-CASE-1134", serviceName: "Accounting & Bookkeeping", grossAmount: 120, partnerShare: 18, tds: 1.8, adjustments: 0, netPayable: 16.2, status: "Paid", date: "2026-04-01" },
  { id: "LDG-3", partnerId: "PTR-102", partnerName: "Northgate Consulting", caseId: "AA-CASE-1140", serviceName: "Company Incorporation & Registrations", grossAmount: 150, partnerShare: 18, tds: 1.8, adjustments: 0, netPayable: 16.2, status: "Pending", date: "2026-08-08" },
  { id: "LDG-4", partnerId: "PTR-103", partnerName: "Bluepeak Partners", caseId: "AA-CASE-1130", serviceName: "GST Registration & Compliance", grossAmount: 40, partnerShare: 4, tds: 0.4, adjustments: 0, netPayable: 3.6, status: "Paid", date: "2026-07-22" },
  { id: "LDG-5", partnerId: "PTR-105", partnerName: "Silverline Tax Services", caseId: "AA-CASE-1121", serviceName: "Payroll Taxes (940/941)", grossAmount: 60, partnerShare: 7.2, tds: 0.72, adjustments: -2, netPayable: 4.48, status: "Included in Statement", date: "2026-08-01" },
];

export type StatementStatus = "Draft" | "Under Review" | "Issued" | "Partner Accepted" | "T+2 Eligible" | "Scheduled" | "Paid" | "Disputed";

export interface Statement {
  id: string;
  partnerId: string;
  partnerName: string;
  weekOf: string;
  totalAmount: number;
  status: StatementStatus;
}

export const mockStatements: Statement[] = [
  { id: "STMT-2026-W31", partnerId: "PTR-101", partnerName: "Zenith Advisors", weekOf: "2026-07-27 – 2026-08-02", totalAmount: 16.2, status: "Paid" },
  { id: "STMT-2026-W32", partnerId: "PTR-103", partnerName: "Bluepeak Partners", weekOf: "2026-08-03 – 2026-08-09", totalAmount: 3.6, status: "Disputed" },
  { id: "STMT-2026-W32B", partnerId: "PTR-101", partnerName: "Zenith Advisors", weekOf: "2026-08-03 – 2026-08-09", totalAmount: 5.4, status: "Issued" },
  { id: "STMT-2026-W32C", partnerId: "PTR-105", partnerName: "Silverline Tax Services", weekOf: "2026-08-03 – 2026-08-09", totalAmount: 4.48, status: "Partner Accepted" },
  { id: "STMT-2026-W32D", partnerId: "PTR-102", partnerName: "Northgate Consulting", weekOf: "2026-08-03 – 2026-08-09", totalAmount: 16.2, status: "Draft" },
];

export type PayoutStatus = "Pending" | "Scheduled" | "Paid" | "Failed" | "On Hold";

export interface Payout {
  id: string;
  partnerId: string;
  partnerName: string;
  statementId: string;
  amount: number;
  status: PayoutStatus;
  scheduledDate?: string;
  paidDate?: string;
}

export const mockPayouts: Payout[] = [
  { id: "PYT-201", partnerId: "PTR-101", partnerName: "Zenith Advisors", statementId: "STMT-2026-W31", amount: 16.2, status: "Paid", paidDate: "2026-08-05" },
  { id: "PYT-202", partnerId: "PTR-105", partnerName: "Silverline Tax Services", statementId: "STMT-2026-W32C", amount: 4.48, status: "Scheduled", scheduledDate: "2026-08-14" },
  { id: "PYT-203", partnerId: "PTR-103", partnerName: "Bluepeak Partners", statementId: "STMT-2026-W32", amount: 3.6, status: "On Hold" },
  { id: "PYT-204", partnerId: "PTR-102", partnerName: "Northgate Consulting", statementId: "STMT-2026-W32D", amount: 16.2, status: "Pending" },
];

export type DisputeStatus = "Open" | "Resolved";

export interface Dispute {
  id: string;
  partnerId: string;
  partnerName: string;
  statementId: string;
  amount: number;
  reason: string;
  status: DisputeStatus;
  createdDate: string;
}

export const mockDisputes: Dispute[] = [
  { id: "DSP-1", partnerId: "PTR-103", partnerName: "Bluepeak Partners", statementId: "STMT-2026-W32", amount: 3.6, reason: "Partner believes the TDS deduction rate applied is incorrect for this case.", status: "Open", createdDate: "2026-08-11" },
  { id: "DSP-2", partnerId: "PTR-101", partnerName: "Zenith Advisors", statementId: "STMT-2026-W28", amount: 12.4, reason: "Case AA-CASE-0912 was cancelled after statement generation; partner requested adjustment.", status: "Resolved", createdDate: "2026-07-15" },
];

export interface RevenueShareRule {
  id: string;
  partnerId?: string;
  partnerName?: string;
  serviceId?: string;
  serviceName?: string;
  sharePct: number;
  tdsPct: number;
  effectiveDate: string;
}

export const mockRevenueShareRules: RevenueShareRule[] = [
  { id: "RULE-1", serviceId: "income-tax", serviceName: "Income Tax Return Filing", sharePct: 15, tdsPct: 10, effectiveDate: "2026-01-01" },
  { id: "RULE-2", serviceId: "gst-compliance", serviceName: "GST Registration & Compliance", sharePct: 12, tdsPct: 10, effectiveDate: "2026-01-01" },
  { id: "RULE-3", serviceId: "company-incorporation", serviceName: "Company Incorporation & Registrations", sharePct: 10, tdsPct: 10, effectiveDate: "2026-01-01" },
  { id: "RULE-14", partnerId: "PTR-101", partnerName: "Zenith Advisors", sharePct: 15, tdsPct: 10, effectiveDate: "2026-08-11" },
  { id: "RULE-15", partnerId: "PTR-103", partnerName: "Bluepeak Partners", serviceId: "gst-compliance", serviceName: "GST Registration & Compliance", sharePct: 10, tdsPct: 10, effectiveDate: "2026-06-25" },
];
