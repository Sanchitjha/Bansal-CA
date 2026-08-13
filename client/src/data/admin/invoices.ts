// Mock data for the Admin Panel — Invoices.

export type InvoiceStatus = "Draft" | "Issued" | "Partially Paid" | "Paid" | "Overdue" | "Cancelled";

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  caseId: string;
  amount: number;
  paidAmount: number;
  status: InvoiceStatus;
  issuedDate: string;
  dueDate: string;
}

export const mockInvoices: Invoice[] = [
  { id: "INV-5001", clientId: "CLT-2001", clientName: "Rohan Mehta", caseId: "AA-CASE-1042", amount: 75, paidAmount: 75, status: "Paid", issuedDate: "2026-06-02", dueDate: "2026-06-09" },
  { id: "INV-5008", clientId: "CLT-2002", clientName: "Deepak Sethi", caseId: "AA-CASE-1102", amount: 40, paidAmount: 40, status: "Paid", issuedDate: "2026-08-10", dueDate: "2026-08-17" },
  { id: "INV-4992", clientId: "CLT-2007", clientName: "Amit Bansal Retail LLP", caseId: "AA-CASE-1118", amount: 150, paidAmount: 150, status: "Paid", issuedDate: "2026-03-19", dueDate: "2026-03-26" },
  { id: "INV-5010", clientId: "CLT-2004", clientName: "Farhan Ali", caseId: "AA-CASE-1121", amount: 60, paidAmount: 60, status: "Paid", issuedDate: "2026-08-01", dueDate: "2026-08-08" },
  { id: "INV-4980", clientId: "CLT-2006", clientName: "Neha Kapoor", caseId: "AA-CASE-1130", amount: 40, paidAmount: 40, status: "Paid", issuedDate: "2026-07-22", dueDate: "2026-07-29" },
  { id: "INV-4901", clientId: "CLT-2005", clientName: "Sunita Rao Textiles Pvt Ltd", caseId: "AA-CASE-1134", amount: 120, paidAmount: 120, status: "Paid", issuedDate: "2026-04-01", dueDate: "2026-04-08" },
  { id: "INV-5015", clientId: "CLT-2003", clientName: "Meera Iyer", caseId: "AA-CASE-1140", amount: 150, paidAmount: 0, status: "Issued", issuedDate: "2026-08-08", dueDate: "2026-08-18" },
  { id: "INV-4950", clientId: "CLT-2008", clientName: "Priyanka Ghosh", caseId: "AA-CASE-0999", amount: 75, paidAmount: 0, status: "Overdue", issuedDate: "2026-07-01", dueDate: "2026-07-08" },
  { id: "INV-5020", clientId: "CLT-2005", clientName: "Sunita Rao Textiles Pvt Ltd", caseId: "AA-CASE-1150", amount: 90, paidAmount: 30, status: "Partially Paid", issuedDate: "2026-08-05", dueDate: "2026-08-19" },
  { id: "INV-5025", clientId: "CLT-2001", clientName: "Rohan Mehta", caseId: "AA-CASE-1145", amount: 40, paidAmount: 0, status: "Cancelled", issuedDate: "2026-07-01", dueDate: "2026-07-08" },
  { id: "INV-5030", clientId: "CLT-2002", clientName: "Deepak Sethi", caseId: "AA-CASE-1155", amount: 200, paidAmount: 200, status: "Paid", issuedDate: "2026-06-15", dueDate: "2026-06-22" },
  { id: "INV-5033", clientId: "CLT-2007", clientName: "Amit Bansal Retail LLP", caseId: "AA-CASE-1160", amount: 55, paidAmount: 0, status: "Draft", issuedDate: "2026-08-12", dueDate: "2026-08-19" },
];
