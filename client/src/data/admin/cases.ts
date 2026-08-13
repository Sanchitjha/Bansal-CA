// Mock data for the Admin Panel — Cases (the central operational module).

export type AdminCaseStatus =
  | "New"
  | "Payment Pending"
  | "Documents Pending"
  | "In Progress"
  | "Waiting for Client"
  | "Review"
  | "Completed"
  | "Closed"
  | "Cancelled";

export type CasePriority = "Low" | "Medium" | "High";
export type CasePaymentStatus = "Not Required" | "Pending" | "Paid" | "Refunded";

export interface CaseStatusEvent {
  status: AdminCaseStatus;
  date: string;
  note?: string;
}

export interface AdminCase {
  id: string;
  clientId: string;
  clientName: string;
  partnerId?: string;
  partnerName?: string;
  serviceId: string;
  serviceName: string;
  assignedTo: string;
  status: AdminCaseStatus;
  priority: CasePriority;
  createdDate: string;
  slaDueDate: string;
  paymentStatus: CasePaymentStatus;
  amount: number;
  invoiceId?: string;
  statusHistory: CaseStatusEvent[];
}

export const mockAdminCases: AdminCase[] = [
  {
    id: "AA-CASE-1042", clientId: "CLT-2001", clientName: "Rohan Mehta", serviceId: "income-tax", serviceName: "Income Tax Return Filing",
    assignedTo: "Priya Sharma", status: "In Progress", priority: "High", createdDate: "2026-06-02", slaDueDate: "2026-06-09",
    paymentStatus: "Paid", amount: 75, invoiceId: "INV-5001",
    statusHistory: [
      { status: "New", date: "2026-06-02", note: "Enquiry submitted via website." },
      { status: "Payment Pending", date: "2026-06-02" },
      { status: "Documents Pending", date: "2026-06-03", note: "Payment verified, requesting documents." },
      { status: "In Progress", date: "2026-06-05", note: "Assigned to Priya Sharma for review." },
    ],
  },
  {
    id: "AA-CASE-1102", clientId: "CLT-2002", clientName: "Deepak Sethi", partnerId: "PTR-101", partnerName: "Zenith Advisors",
    serviceId: "gst-compliance", serviceName: "GST Registration & Compliance",
    assignedTo: "Arjun Nair", status: "Documents Pending", priority: "Medium", createdDate: "2026-08-10", slaDueDate: "2026-08-13",
    paymentStatus: "Paid", amount: 40, invoiceId: "INV-5008",
    statusHistory: [
      { status: "New", date: "2026-08-10" },
      { status: "Payment Pending", date: "2026-08-10" },
      { status: "Documents Pending", date: "2026-08-11", note: "PAN card and address proof requested." },
    ],
  },
  {
    id: "AA-CASE-1118", clientId: "CLT-2007", clientName: "Amit Bansal Retail LLP", serviceId: "company-incorporation", serviceName: "Company Incorporation & Registrations",
    assignedTo: "Sanjay Kulkarni", status: "Review", priority: "Medium", createdDate: "2026-03-19", slaDueDate: "2026-03-29",
    paymentStatus: "Paid", amount: 150, invoiceId: "INV-4992",
    statusHistory: [
      { status: "New", date: "2026-03-19" },
      { status: "Documents Pending", date: "2026-03-20" },
      { status: "In Progress", date: "2026-03-24" },
      { status: "Review", date: "2026-03-27", note: "Filed with MCA, awaiting certificate of incorporation." },
    ],
  },
  {
    id: "AA-CASE-1121", clientId: "CLT-2004", clientName: "Farhan Ali", serviceId: "payroll-taxes", serviceName: "Payroll Taxes (940/941)",
    assignedTo: "Priya Sharma", status: "Completed", priority: "Low", createdDate: "2026-08-01", slaDueDate: "2026-08-06",
    paymentStatus: "Paid", amount: 60, invoiceId: "INV-5010",
    statusHistory: [
      { status: "New", date: "2026-08-01" },
      { status: "In Progress", date: "2026-08-02" },
      { status: "Review", date: "2026-08-04" },
      { status: "Completed", date: "2026-08-05", note: "Forms 940/941 filed successfully." },
    ],
  },
  {
    id: "AA-CASE-1130", clientId: "CLT-2006", clientName: "Neha Kapoor", partnerId: "PTR-103", partnerName: "Bluepeak Partners",
    serviceId: "gst-compliance", serviceName: "GST Registration & Compliance",
    assignedTo: "Arjun Nair", status: "Closed", priority: "Low", createdDate: "2026-07-22", slaDueDate: "2026-07-29",
    paymentStatus: "Paid", amount: 40, invoiceId: "INV-4980",
    statusHistory: [
      { status: "New", date: "2026-07-22" },
      { status: "In Progress", date: "2026-07-23" },
      { status: "Review", date: "2026-07-27" },
      { status: "Completed", date: "2026-07-28" },
      { status: "Closed", date: "2026-07-29", note: "Archived after client sign-off." },
    ],
  },
  {
    id: "AA-CASE-1134", clientId: "CLT-2005", clientName: "Sunita Rao Textiles Pvt Ltd", partnerId: "PTR-101", partnerName: "Zenith Advisors",
    serviceId: "accounting-bookkeeping", serviceName: "Accounting & Bookkeeping",
    assignedTo: "Priya Sharma", status: "Waiting for Client", priority: "Medium", createdDate: "2026-04-01", slaDueDate: "2026-04-16",
    paymentStatus: "Paid", amount: 120, invoiceId: "INV-4901",
    statusHistory: [
      { status: "New", date: "2026-04-01" },
      { status: "In Progress", date: "2026-04-05" },
      { status: "Waiting for Client", date: "2026-04-10", note: "Purchase bills need to be re-uploaded (previous scan illegible)." },
    ],
  },
  {
    id: "AA-CASE-1140", clientId: "CLT-2003", clientName: "Meera Iyer", partnerId: "PTR-102", partnerName: "Northgate Consulting",
    serviceId: "company-incorporation", serviceName: "Company Incorporation & Registrations",
    assignedTo: "Sanjay Kulkarni", status: "Payment Pending", priority: "Medium", createdDate: "2026-08-08", slaDueDate: "2026-08-18",
    paymentStatus: "Pending", amount: 150,
    statusHistory: [
      { status: "New", date: "2026-08-08", note: "Qualified lead converted to case." },
      { status: "Payment Pending", date: "2026-08-08", note: "100% advance required before processing." },
    ],
  },
  {
    id: "AA-CASE-1145", clientId: "CLT-2001", clientName: "Rohan Mehta", serviceId: "gst-compliance", serviceName: "GST Registration & Compliance",
    assignedTo: "Arjun Nair", status: "Cancelled", priority: "Low", createdDate: "2026-07-01", slaDueDate: "2026-07-08",
    paymentStatus: "Refunded", amount: 40,
    statusHistory: [
      { status: "New", date: "2026-07-01" },
      { status: "Payment Pending", date: "2026-07-01" },
      { status: "Cancelled", date: "2026-07-03", note: "Client cancelled before payment; no charge applied." },
    ],
  },
];

export interface CaseTask {
  id: string;
  caseId: string;
  title: string;
  assignedTo: string;
  dueDate: string;
  status: "Pending" | "Completed";
  priority: CasePriority;
}

export const mockCaseTasks: CaseTask[] = [
  { id: "CTASK-1", caseId: "AA-CASE-1042", title: "Verify Form 16 against AIS", assignedTo: "Priya Sharma", dueDate: "2026-06-07", status: "Completed", priority: "High" },
  { id: "CTASK-2", caseId: "AA-CASE-1042", title: "Prepare draft computation", assignedTo: "Priya Sharma", dueDate: "2026-06-08", status: "Pending", priority: "High" },
  { id: "CTASK-3", caseId: "AA-CASE-1102", title: "Request PAN card copy", assignedTo: "Arjun Nair", dueDate: "2026-08-12", status: "Completed", priority: "Medium" },
  { id: "CTASK-4", caseId: "AA-CASE-1102", title: "Request business address proof", assignedTo: "Arjun Nair", dueDate: "2026-08-13", status: "Pending", priority: "Medium" },
  { id: "CTASK-5", caseId: "AA-CASE-1118", title: "File incorporation documents with MCA", assignedTo: "Sanjay Kulkarni", dueDate: "2026-03-26", status: "Completed", priority: "High" },
  { id: "CTASK-6", caseId: "AA-CASE-1118", title: "Reviewer sign-off on incorporation certificate", assignedTo: "Amit Bansal", dueDate: "2026-03-29", status: "Pending", priority: "Medium" },
  { id: "CTASK-7", caseId: "AA-CASE-1134", title: "Follow up on purchase bill re-upload", assignedTo: "Priya Sharma", dueDate: "2026-08-14", status: "Pending", priority: "Medium" },
];

export interface CaseMessage {
  id: string;
  caseId: string;
  sender: "admin" | "client" | "partner";
  senderName: string;
  text: string;
  date: string;
}

export const mockCaseMessages: CaseMessage[] = [
  { id: "CMSG-1", caseId: "AA-CASE-1042", sender: "admin", senderName: "Priya Sharma", text: "Hi Rohan, we've received your Form 16 and bank statements. Reviewing now.", date: "2026-06-06T10:15:00" },
  { id: "CMSG-2", caseId: "AA-CASE-1042", sender: "client", senderName: "Rohan Mehta", text: "Thanks Priya, let me know if anything else is needed.", date: "2026-06-06T11:02:00" },
  { id: "CMSG-3", caseId: "AA-CASE-1102", sender: "admin", senderName: "Arjun Nair", text: "Please share the client's PAN card copy so we can proceed.", date: "2026-08-11T09:30:00" },
  { id: "CMSG-4", caseId: "AA-CASE-1102", sender: "partner", senderName: "Kunal Shah (Zenith Advisors)", text: "Sending it over today.", date: "2026-08-11T09:45:00" },
  { id: "CMSG-5", caseId: "AA-CASE-1134", sender: "admin", senderName: "Priya Sharma", text: "The purchase bills scan is illegible — could you re-upload a clearer copy?", date: "2026-04-10T13:00:00" },
];
