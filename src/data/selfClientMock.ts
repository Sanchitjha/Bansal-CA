// Mock data for the Self Client Portal.
// There is no backend yet — this file stands in for the API responses
// the separate backend service will eventually provide.

export type CaseStatus =
  | "New Lead"
  | "Payment Pending"
  | "Open"
  | "In Process"
  | "Waiting for Client"
  | "Review"
  | "Closed";

export type PaymentStatus = "Not Required" | "Pending" | "Paid" | "Partially Paid";

export interface CaseStatusEvent {
  status: CaseStatus;
  date: string;
  note?: string;
}

export interface SelfClientCase {
  id: string;
  serviceId: string;
  serviceName: string;
  status: CaseStatus;
  priority: "Low" | "Medium" | "High";
  createdDate: string;
  dueDate?: string;
  assignedTeamMember?: string;
  amount: number;
  paymentStatus: PaymentStatus;
  statusHistory: CaseStatusEvent[];
}

export type DocumentStatus =
  | "Requested"
  | "Uploaded"
  | "Under Review"
  | "Accepted"
  | "Rejected"
  | "Re-upload Required";

export interface SelfClientDocument {
  id: string;
  caseId: string;
  name: string;
  status: DocumentStatus;
  requestedDate: string;
  uploadedDate?: string;
}

export interface SelfClientPayment {
  id: string;
  caseId: string;
  description: string;
  amount: number;
  status: "Pending" | "Success" | "Failed";
  date: string;
  invoiceAvailable: boolean;
}

export interface SelfClientTask {
  id: string;
  caseId: string;
  title: string;
  description: string;
  dueDate: string;
  status: "Pending" | "Completed";
  requiresUpload?: boolean;
}

export interface SelfClientMessage {
  id: string;
  caseId: string;
  sender: "client" | "team";
  senderName: string;
  text: string;
  date: string;
}

export type NotificationType = "task" | "document" | "payment" | "status" | "completion" | "message";

export interface SelfClientNotification {
  id: string;
  type: NotificationType;
  message: string;
  date: string;
  read: boolean;
  caseId?: string;
}

export interface SelfClientProfile {
  name: string;
  email: string;
  phone: string;
  clientType: "Self Client";
  memberSince: string;
}

export const mockProfile: SelfClientProfile = {
  name: "Rohan Mehta",
  email: "rohan.mehta@example.com",
  phone: "+91 98765 43210",
  clientType: "Self Client",
  memberSince: "2025-02-14",
};

export const mockCases: SelfClientCase[] = [
  {
    id: "AA-CASE-1042",
    serviceId: "income-tax",
    serviceName: "Income Tax Return Filing",
    status: "In Process",
    priority: "High",
    createdDate: "2026-06-02",
    dueDate: "2026-07-31",
    assignedTeamMember: "Priya Sharma",
    amount: 75,
    paymentStatus: "Paid",
    statusHistory: [
      { status: "New Lead", date: "2026-06-02", note: "Enquiry submitted via website." },
      { status: "Payment Pending", date: "2026-06-02", note: "Advance payment link sent." },
      { status: "Open", date: "2026-06-03", note: "Payment received, case opened." },
      { status: "In Process", date: "2026-06-05", note: "Assigned to Priya Sharma for review." },
    ],
  },
  {
    id: "AA-CASE-1051",
    serviceId: "gst-compliance",
    serviceName: "GST Registration & Compliance",
    status: "Waiting for Client",
    priority: "Medium",
    createdDate: "2026-07-10",
    dueDate: "2026-07-24",
    assignedTeamMember: "Arjun Nair",
    amount: 40,
    paymentStatus: "Paid",
    statusHistory: [
      { status: "New Lead", date: "2026-07-10" },
      { status: "Payment Pending", date: "2026-07-10" },
      { status: "Open", date: "2026-07-11" },
      { status: "In Process", date: "2026-07-12" },
      { status: "Waiting for Client", date: "2026-07-15", note: "PAN card and address proof required." },
    ],
  },
  {
    id: "AA-CASE-1063",
    serviceId: "company-incorporation",
    serviceName: "Company Incorporation & Registrations",
    status: "Payment Pending",
    priority: "Medium",
    createdDate: "2026-08-05",
    amount: 150,
    paymentStatus: "Pending",
    statusHistory: [
      { status: "New Lead", date: "2026-08-05", note: "Enquiry submitted via website." },
      { status: "Payment Pending", date: "2026-08-05", note: "100% advance required before processing." },
    ],
  },
  {
    id: "AA-CASE-0988",
    serviceId: "accounting-bookkeeping",
    serviceName: "Accounting & Bookkeeping",
    status: "Closed",
    priority: "Low",
    createdDate: "2026-04-01",
    dueDate: "2026-05-01",
    assignedTeamMember: "Priya Sharma",
    amount: 120,
    paymentStatus: "Paid",
    statusHistory: [
      { status: "New Lead", date: "2026-04-01" },
      { status: "Open", date: "2026-04-02" },
      { status: "In Process", date: "2026-04-05" },
      { status: "Review", date: "2026-04-28" },
      { status: "Closed", date: "2026-05-01", note: "Financial statement package delivered." },
    ],
  },
];

export const mockDocuments: SelfClientDocument[] = [
  { id: "DOC-1", caseId: "AA-CASE-1042", name: "Form 16 (FY 2025-26)", status: "Accepted", requestedDate: "2026-06-02", uploadedDate: "2026-06-04" },
  { id: "DOC-2", caseId: "AA-CASE-1042", name: "Bank statements", status: "Under Review", requestedDate: "2026-06-02", uploadedDate: "2026-06-06" },
  { id: "DOC-3", caseId: "AA-CASE-1051", name: "PAN card copy", status: "Requested", requestedDate: "2026-07-15" },
  { id: "DOC-4", caseId: "AA-CASE-1051", name: "Business address proof", status: "Requested", requestedDate: "2026-07-15" },
  { id: "DOC-5", caseId: "AA-CASE-0988", name: "Sales invoices — April", status: "Accepted", requestedDate: "2026-04-02", uploadedDate: "2026-04-03" },
  { id: "DOC-6", caseId: "AA-CASE-0988", name: "Purchase bills — April", status: "Rejected", requestedDate: "2026-04-02", uploadedDate: "2026-04-03" },
];

export const mockPayments: SelfClientPayment[] = [
  { id: "PAY-1", caseId: "AA-CASE-1042", description: "Advance payment — Income Tax Return Filing", amount: 75, status: "Success", date: "2026-06-02", invoiceAvailable: true },
  { id: "PAY-2", caseId: "AA-CASE-1051", description: "Advance payment — GST Registration & Compliance", amount: 40, status: "Success", date: "2026-07-10", invoiceAvailable: true },
  { id: "PAY-3", caseId: "AA-CASE-1063", description: "100% advance — Company Incorporation & Registrations", amount: 150, status: "Pending", date: "2026-08-05", invoiceAvailable: false },
  { id: "PAY-4", caseId: "AA-CASE-0988", description: "Monthly retainer — Accounting & Bookkeeping", amount: 120, status: "Success", date: "2026-04-01", invoiceAvailable: true },
];

export const mockTasks: SelfClientTask[] = [
  { id: "TASK-1", caseId: "AA-CASE-1051", title: "Upload PAN card copy", description: "Required to proceed with GST registration.", dueDate: "2026-08-18", status: "Pending", requiresUpload: true },
  { id: "TASK-2", caseId: "AA-CASE-1051", title: "Upload business address proof", description: "Rent agreement or electricity bill.", dueDate: "2026-08-18", status: "Pending", requiresUpload: true },
  { id: "TASK-3", caseId: "AA-CASE-1063", title: "Complete advance payment", description: "Case cannot move to processing until the 100% advance is received.", dueDate: "2026-08-15", status: "Pending" },
  { id: "TASK-4", caseId: "AA-CASE-1042", title: "Confirm draft tax computation", description: "Review and approve the draft shared by your tax expert.", dueDate: "2026-08-20", status: "Pending" },
  { id: "TASK-5", caseId: "AA-CASE-0988", title: "Share May bank statement", description: "Needed for next month's reconciliation.", dueDate: "2026-05-05", status: "Completed" },
];

export const mockMessages: SelfClientMessage[] = [
  { id: "MSG-1", caseId: "AA-CASE-1042", sender: "team", senderName: "Priya Sharma", text: "Hi Rohan, we've received your Form 16 and bank statements. Reviewing now.", date: "2026-06-06T10:15:00" },
  { id: "MSG-2", caseId: "AA-CASE-1042", sender: "client", senderName: "Rohan Mehta", text: "Thanks Priya, let me know if anything else is needed.", date: "2026-06-06T11:02:00" },
  { id: "MSG-3", caseId: "AA-CASE-1051", sender: "team", senderName: "Arjun Nair", text: "Please upload your PAN card and address proof so we can proceed with the GST application.", date: "2026-07-15T09:30:00" },
];

export const mockNotifications: SelfClientNotification[] = [
  { id: "NOTIF-1", type: "document", message: "Document requested: PAN card copy for AA-CASE-1051.", date: "2026-07-15T09:30:00", read: false, caseId: "AA-CASE-1051" },
  { id: "NOTIF-2", type: "status", message: "AA-CASE-1042 moved to In Process.", date: "2026-06-05T14:00:00", read: true, caseId: "AA-CASE-1042" },
  { id: "NOTIF-3", type: "payment", message: "Payment of $150 pending for AA-CASE-1063.", date: "2026-08-05T16:20:00", read: false, caseId: "AA-CASE-1063" },
  { id: "NOTIF-4", type: "completion", message: "AA-CASE-0988 has been completed and closed.", date: "2026-05-01T12:00:00", read: true, caseId: "AA-CASE-0988" },
  { id: "NOTIF-5", type: "message", message: "New message from Priya Sharma on AA-CASE-1042.", date: "2026-06-06T10:15:00", read: true, caseId: "AA-CASE-1042" },
];
