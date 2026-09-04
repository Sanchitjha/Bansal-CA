// Mock data for the Admin Panel — Channel Partners.

export type PartnerStatus = "Pending Verification" | "Active" | "Suspended" | "Rejected";
export type KYCDocStatus = "Requested" | "Uploaded" | "Under Review" | "Accepted" | "Rejected";

export interface KYCDocument {
  id: string;
  name: string;
  uploadedDate?: string;
  status: KYCDocStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  expiryDate?: string;
  rejectionReason?: string;
}

export interface Partner {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  pan: string;
  gstin?: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankIfsc: string;
  services: string[];
  clientsCount: number;
  revenueSharePct: number;
  tdsPct: number;
  status: PartnerStatus;
  createdDate: string;
  kycDocuments: KYCDocument[];
}

export const mockPartners: Partner[] = [
  {
    id: "PTR-101", name: "Zenith Advisors", contactPerson: "Kunal Shah", email: "kunal@zenithadvisors.example.com", phone: "+91 98200 10101",
    pan: "AAZPS1234C", gstin: "27AAZPS1234C1Z8", bankAccountName: "Zenith Advisors LLP", bankAccountNumber: "XXXXXXXX4521", bankIfsc: "HDFC0000123",
    services: ["GST Registration & Compliance", "Income Tax Return Filing", "1099 Filings"], clientsCount: 12, revenueSharePct: 15, tdsPct: 10,
    status: "Active", createdDate: "2026-01-05",
    kycDocuments: [
      { id: "KYC-1", name: "PAN Card", uploadedDate: "2026-01-10", status: "Accepted", reviewedBy: "Amit Bansal", reviewedAt: "2026-01-11" },
      { id: "KYC-2", name: "GSTIN Certificate", uploadedDate: "2026-01-10", status: "Accepted", reviewedBy: "Amit Bansal", reviewedAt: "2026-01-11", expiryDate: "2028-01-10" },
      { id: "KYC-3", name: "Cancelled Cheque", uploadedDate: "2026-01-10", status: "Accepted", reviewedBy: "Amit Bansal", reviewedAt: "2026-01-11" },
      { id: "KYC-4", name: "Partnership Agreement", uploadedDate: "2026-01-10", status: "Accepted", reviewedBy: "Amit Bansal", reviewedAt: "2026-01-11" },
    ],
  },
  {
    id: "PTR-102", name: "Northgate Consulting", contactPerson: "Ishaan Kapoor", email: "ishaan@northgate.example.com", phone: "+91 98200 10102",
    pan: "AANCC5678D", gstin: "29AANCC5678D1Z2", bankAccountName: "Northgate Consulting Pvt Ltd", bankAccountNumber: "XXXXXXXX7788", bankIfsc: "ICIC0000456",
    services: ["Company Incorporation & Registrations", "Accounting & Bookkeeping"], clientsCount: 8, revenueSharePct: 12, tdsPct: 10,
    status: "Active", createdDate: "2026-02-18",
    kycDocuments: [
      { id: "KYC-5", name: "PAN Card", uploadedDate: "2026-02-20", status: "Accepted", reviewedBy: "Amit Bansal", reviewedAt: "2026-02-21" },
      { id: "KYC-6", name: "GSTIN Certificate", uploadedDate: "2026-02-20", status: "Accepted", reviewedBy: "Amit Bansal", reviewedAt: "2026-02-21", expiryDate: "2028-02-20" },
      { id: "KYC-7", name: "Cancelled Cheque", uploadedDate: "2026-08-09", status: "Under Review" },
    ],
  },
  {
    id: "PTR-103", name: "Bluepeak Partners", contactPerson: "Divya Menon", email: "divya@bluepeak.example.com", phone: "+91 98200 10103",
    pan: "AABPC9012E", bankAccountName: "Bluepeak Partners", bankAccountNumber: "XXXXXXXX3345", bankIfsc: "AXIS0000789",
    services: ["GST Registration & Compliance"], clientsCount: 3, revenueSharePct: 10, tdsPct: 10,
    status: "Active", createdDate: "2026-06-25",
    kycDocuments: [
      { id: "KYC-8", name: "PAN Card", uploadedDate: "2026-06-28", status: "Accepted", reviewedBy: "Amit Bansal", reviewedAt: "2026-06-29" },
      { id: "KYC-9", name: "Partnership Agreement", uploadedDate: "2026-07-01", status: "Rejected", reviewedBy: "Amit Bansal", reviewedAt: "2026-07-03", rejectionReason: "Missing signature page — please re-upload the complete agreement." },
    ],
  },
  {
    id: "PTR-104", name: "Coral Compliance Co.", contactPerson: "Rajat Verma", email: "rajat@coralcompliance.example.com", phone: "+91 98200 10104",
    pan: "AACCC3456F", bankAccountName: "Coral Compliance Co.", bankAccountNumber: "XXXXXXXX9012", bankIfsc: "SBIN0000321",
    services: ["Income Tax Return Filing"], clientsCount: 0, revenueSharePct: 10, tdsPct: 10,
    status: "Pending Verification", createdDate: "2026-08-04",
    kycDocuments: [
      { id: "KYC-10", name: "PAN Card", uploadedDate: "2026-08-04", status: "Under Review" },
      { id: "KYC-11", name: "Aadhaar Card", uploadedDate: "2026-08-05", status: "Under Review" },
      { id: "KYC-12", name: "Cancelled Cheque", status: "Requested" },
    ],
  },
  {
    id: "PTR-105", name: "Silverline Tax Services", contactPerson: "Manoj Pillai", email: "manoj@silverlinetax.example.com", phone: "+91 98200 10105",
    pan: "AASLT7890G", bankAccountName: "Silverline Tax Services", bankAccountNumber: "XXXXXXXX6634", bankIfsc: "KOTAK0001122",
    services: ["Payroll Taxes (940/941)"], clientsCount: 5, revenueSharePct: 12, tdsPct: 10,
    status: "Suspended", createdDate: "2025-09-11",
    kycDocuments: [
      { id: "KYC-13", name: "PAN Card", uploadedDate: "2025-09-12", status: "Accepted", reviewedBy: "Amit Bansal", reviewedAt: "2025-09-13" },
      { id: "KYC-14", name: "GSTIN Certificate", uploadedDate: "2025-09-12", status: "Accepted", reviewedBy: "Amit Bansal", reviewedAt: "2025-09-13", expiryDate: "2026-09-12" },
    ],
  },
  {
    id: "PTR-106", name: "Everest Business Solutions", contactPerson: "Tanvi Joshi", email: "tanvi@everestbiz.example.com", phone: "+91 98200 10106",
    pan: "AAEBS2233H", bankAccountName: "Everest Business Solutions", bankAccountNumber: "XXXXXXXX1187", bankIfsc: "YESB0004455",
    services: [], clientsCount: 0, revenueSharePct: 10, tdsPct: 10,
    status: "Rejected", createdDate: "2026-07-30",
    kycDocuments: [
      { id: "KYC-15", name: "PAN Card", uploadedDate: "2026-07-30", status: "Rejected", reviewedBy: "Amit Bansal", reviewedAt: "2026-07-31", rejectionReason: "PAN name does not match business registration name." },
    ],
  },
];
