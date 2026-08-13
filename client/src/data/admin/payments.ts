// Mock data for the Admin Panel — Payments.

export type AdminPaymentStatus = "Pending" | "Paid" | "Failed" | "Refunded" | "Partially Refunded" | "Manual Verification";
export type PaymentMethod = "Card" | "UPI" | "Net Banking" | "Manual";

export interface AdminPayment {
  id: string;
  clientId: string;
  clientName: string;
  caseId: string;
  invoiceId?: string;
  amount: number;
  method: PaymentMethod;
  status: AdminPaymentStatus;
  date: string;
  gatewayRef?: string;
  webhookStatus?: "Verified" | "Pending" | "Not Applicable";
  refundAmount?: number;
}

export const mockAdminPayments: AdminPayment[] = [
  { id: "PAY-4001", clientId: "CLT-2001", clientName: "Rohan Mehta", caseId: "AA-CASE-1042", invoiceId: "INV-5001", amount: 75, method: "UPI", status: "Paid", date: "2026-06-02T10:05:00", gatewayRef: "rzp_pay_8k2j91", webhookStatus: "Verified" },
  { id: "PAY-4002", clientId: "CLT-2002", clientName: "Deepak Sethi", caseId: "AA-CASE-1102", invoiceId: "INV-5008", amount: 40, method: "Card", status: "Paid", date: "2026-08-10T11:20:00", gatewayRef: "rzp_pay_9m3k02", webhookStatus: "Verified" },
  { id: "PAY-4003", clientId: "CLT-2007", clientName: "Amit Bansal Retail LLP", caseId: "AA-CASE-1118", invoiceId: "INV-4992", amount: 150, method: "Net Banking", status: "Paid", date: "2026-03-19T09:40:00", gatewayRef: "rzp_pay_2p9x71", webhookStatus: "Verified" },
  { id: "PAY-4004", clientId: "CLT-2004", clientName: "Farhan Ali", caseId: "AA-CASE-1121", invoiceId: "INV-5010", amount: 60, method: "UPI", status: "Paid", date: "2026-08-01T14:10:00", gatewayRef: "rzp_pay_7d1n55", webhookStatus: "Verified" },
  { id: "PAY-4005", clientId: "CLT-2006", clientName: "Neha Kapoor", caseId: "AA-CASE-1130", invoiceId: "INV-4980", amount: 40, method: "Card", status: "Paid", date: "2026-07-22T08:55:00", gatewayRef: "rzp_pay_4q7w88", webhookStatus: "Verified" },
  { id: "PAY-4006", clientId: "CLT-2005", clientName: "Sunita Rao Textiles Pvt Ltd", caseId: "AA-CASE-1134", invoiceId: "INV-4901", amount: 120, method: "Net Banking", status: "Paid", date: "2026-04-01T09:00:00", gatewayRef: "rzp_pay_1a5t44", webhookStatus: "Verified" },
  { id: "PAY-4007", clientId: "CLT-2003", clientName: "Meera Iyer", caseId: "AA-CASE-1140", amount: 150, method: "UPI", status: "Pending", date: "2026-08-08T16:00:00", webhookStatus: "Pending" },
  { id: "PAY-4008", clientId: "CLT-2001", clientName: "Rohan Mehta", caseId: "AA-CASE-1145", amount: 40, method: "Card", status: "Refunded", date: "2026-07-01T10:30:00", gatewayRef: "rzp_pay_6h2c19", webhookStatus: "Verified", refundAmount: 40 },
  { id: "PAY-4009", clientId: "CLT-2008", clientName: "Priyanka Ghosh", caseId: "AA-CASE-0999", amount: 75, method: "Card", status: "Failed", date: "2026-08-09T13:45:00", gatewayRef: "rzp_pay_3z8y02", webhookStatus: "Verified" },
  { id: "PAY-4010", clientId: "CLT-2005", clientName: "Sunita Rao Textiles Pvt Ltd", caseId: "AA-CASE-1150", amount: 90, method: "Manual", status: "Manual Verification", date: "2026-08-11T12:00:00", webhookStatus: "Not Applicable" },
  { id: "PAY-4011", clientId: "CLT-2002", clientName: "Deepak Sethi", caseId: "AA-CASE-1155", amount: 200, method: "Card", status: "Partially Refunded", date: "2026-06-15T09:15:00", gatewayRef: "rzp_pay_5v0m37", webhookStatus: "Verified", refundAmount: 60 },
];
