// Mock data for the Admin Panel — Documents (client/partner/case documents).

export type DocumentStatus = "Requested" | "Uploaded" | "Under Review" | "Accepted" | "Rejected";
export type DocumentOwnerType = "Client" | "Partner";

export interface AdminDocument {
  id: string;
  name: string;
  type: string;
  ownerType: DocumentOwnerType;
  ownerId: string;
  ownerName: string;
  relatedCaseId?: string;
  uploadedDate?: string;
  status: DocumentStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  expiryDate?: string;
  rejectionReason?: string;
}

export const mockAdminDocuments: AdminDocument[] = [
  { id: "DOC-3001", name: "Form 16 (FY 2025-26)", type: "Tax Document", ownerType: "Client", ownerId: "CLT-2001", ownerName: "Rohan Mehta", relatedCaseId: "AA-CASE-1042", uploadedDate: "2026-06-04", status: "Accepted", reviewedBy: "Priya Sharma", reviewedAt: "2026-06-05" },
  { id: "DOC-3002", name: "Bank Statements — May", type: "Financial Statement", ownerType: "Client", ownerId: "CLT-2001", ownerName: "Rohan Mehta", relatedCaseId: "AA-CASE-1042", uploadedDate: "2026-06-06", status: "Under Review" },
  { id: "DOC-3003", name: "PAN Card Copy", type: "Identity Proof", ownerType: "Client", ownerId: "CLT-2002", ownerName: "Deepak Sethi", relatedCaseId: "AA-CASE-1102", status: "Requested" },
  { id: "DOC-3004", name: "Business Address Proof", type: "Address Proof", ownerType: "Client", ownerId: "CLT-2002", ownerName: "Deepak Sethi", relatedCaseId: "AA-CASE-1102", status: "Requested" },
  { id: "DOC-3005", name: "Purchase Bills — April", type: "Financial Statement", ownerType: "Client", ownerId: "CLT-2005", ownerName: "Sunita Rao Textiles Pvt Ltd", uploadedDate: "2026-04-03", status: "Rejected", reviewedBy: "Arjun Nair", reviewedAt: "2026-04-04", rejectionReason: "Scanned copy is illegible — please re-upload a clearer scan." },
  { id: "DOC-3006", name: "PAN Card", type: "KYC Document", ownerType: "Partner", ownerId: "PTR-101", ownerName: "Zenith Advisors", uploadedDate: "2026-01-10", status: "Accepted", reviewedBy: "Amit Bansal", reviewedAt: "2026-01-11" },
  { id: "DOC-3007", name: "GSTIN Certificate", type: "KYC Document", ownerType: "Partner", ownerId: "PTR-101", ownerName: "Zenith Advisors", uploadedDate: "2026-01-10", status: "Accepted", reviewedBy: "Amit Bansal", reviewedAt: "2026-01-11", expiryDate: "2028-01-10" },
  { id: "DOC-3008", name: "Cancelled Cheque", type: "Bank Proof", ownerType: "Partner", ownerId: "PTR-102", ownerName: "Northgate Consulting", uploadedDate: "2026-08-09", status: "Under Review" },
  { id: "DOC-3009", name: "Partnership Agreement", type: "Identity Proof", ownerType: "Partner", ownerId: "PTR-103", ownerName: "Bluepeak Partners", uploadedDate: "2026-07-01", status: "Rejected", reviewedBy: "Amit Bansal", reviewedAt: "2026-07-03", rejectionReason: "Missing signature page — please re-upload the complete agreement." },
  { id: "DOC-3010", name: "Digital Signature Certificate", type: "Identity Proof", ownerType: "Client", ownerId: "CLT-2007", ownerName: "Amit Bansal Retail LLP", relatedCaseId: "AA-CASE-1118", uploadedDate: "2026-03-20", status: "Accepted", reviewedBy: "Sanjay Kulkarni", reviewedAt: "2026-03-21", expiryDate: "2026-09-20" },
  { id: "DOC-3011", name: "Aadhaar Card", type: "Identity Proof", ownerType: "Partner", ownerId: "PTR-104", ownerName: "Coral Compliance Co.", uploadedDate: "2026-08-05", status: "Under Review" },
  { id: "DOC-3012", name: "AIS Statement", type: "Tax Document", ownerType: "Client", ownerId: "CLT-2004", ownerName: "Farhan Ali", relatedCaseId: "AA-CASE-1121", uploadedDate: "2026-08-02", status: "Accepted", reviewedBy: "Priya Sharma", reviewedAt: "2026-08-03" },
];
