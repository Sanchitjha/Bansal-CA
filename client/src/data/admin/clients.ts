// Mock data for the Admin Panel — Clients.

export type ClientType = "Self Client" | "Partner Client";
export type ClientStatus = "Active" | "Inactive";

export interface AdminClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: ClientType;
  partnerId?: string;
  partnerName?: string;
  activeCases: number;
  services: string[];
  status: ClientStatus;
  createdDate: string;
  address?: string;
}

export const mockClients: AdminClient[] = [
  { id: "CLT-2001", name: "Rohan Mehta", email: "rohan.mehta@example.com", phone: "+91 98765 43210", type: "Self Client", activeCases: 2, services: ["Income Tax Return Filing", "GST Registration & Compliance"], status: "Active", createdDate: "2025-02-14", address: "12 MG Road, Bengaluru" },
  { id: "CLT-2002", name: "Deepak Sethi", email: "deepak.sethi@example.com", phone: "+91 90000 11002", type: "Partner Client", partnerId: "PTR-101", partnerName: "Zenith Advisors", activeCases: 1, services: ["GST Registration & Compliance"], status: "Active", createdDate: "2026-08-10" },
  { id: "CLT-2003", name: "Meera Iyer", email: "meera.iyer@example.com", phone: "+91 90000 11003", type: "Partner Client", partnerId: "PTR-102", partnerName: "Northgate Consulting", activeCases: 1, services: ["Company Incorporation & Registrations"], status: "Active", createdDate: "2026-08-08" },
  { id: "CLT-2004", name: "Farhan Ali", email: "farhan.ali@example.com", phone: "+91 90000 11004", type: "Self Client", activeCases: 1, services: ["Payroll Taxes (940/941)"], status: "Active", createdDate: "2026-08-01" },
  { id: "CLT-2005", name: "Sunita Rao Textiles Pvt Ltd", email: "accounts@sunitarao.example.com", phone: "+91 90000 22005", type: "Partner Client", partnerId: "PTR-101", partnerName: "Zenith Advisors", activeCases: 0, services: ["Accounting & Bookkeeping"], status: "Inactive", createdDate: "2025-11-02" },
  { id: "CLT-2006", name: "Neha Kapoor", email: "neha.kapoor@example.com", phone: "+91 90000 11009", type: "Partner Client", partnerId: "PTR-103", partnerName: "Bluepeak Partners", activeCases: 1, services: ["GST Registration & Compliance"], status: "Active", createdDate: "2026-07-22" },
  { id: "CLT-2007", name: "Amit Bansal Retail LLP", email: "finance@bansalretail.example.com", phone: "+91 90000 22007", type: "Self Client", activeCases: 1, services: ["Company Incorporation & Registrations"], status: "Active", createdDate: "2026-03-19" },
  { id: "CLT-2008", name: "Priyanka Ghosh", email: "priyanka.ghosh@example.com", phone: "+91 90000 22008", type: "Partner Client", partnerId: "PTR-102", partnerName: "Northgate Consulting", activeCases: 0, services: ["Income Tax Return Filing"], status: "Inactive", createdDate: "2025-06-30" },
];
