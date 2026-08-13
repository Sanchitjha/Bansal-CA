// Mock data for the Admin Panel — Settings.

export interface OrgInfo {
  name: string;
  legalName: string;
  email: string;
  phone: string;
  address: string;
  gstin: string;
  pan: string;
}

export const mockOrgInfo: OrgInfo = {
  name: "Amit Bansal & Associates",
  legalName: "Amit Bansal & Associates LLP",
  email: "contact@amitbansalassociates.example.com",
  phone: "+91 22 4000 5000",
  address: "4th Floor, Prestige Towers, Bandra Kurla Complex, Mumbai 400051",
  gstin: "27AAAAA0000A1Z5",
  pan: "AAAAA0000A",
};

export type TeamUserStatus = "Active" | "Inactive";

export interface TeamUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: TeamUserStatus;
  lastLogin: string;
}

export const mockTeamUsers: TeamUser[] = [
  { id: "USR-1", name: "Amit Bansal", email: "amit.bansal@aa.com", role: "Admin Head", status: "Active", lastLogin: "2026-08-12T09:00:00" },
  { id: "USR-2", name: "Priya Sharma", email: "priya.sharma@aa.com", role: "Core Team — Tax", status: "Active", lastLogin: "2026-08-12T08:40:00" },
  { id: "USR-3", name: "Arjun Nair", email: "arjun.nair@aa.com", role: "Core Team — GST", status: "Active", lastLogin: "2026-08-10T18:58:00" },
  { id: "USR-4", name: "Sanjay Kulkarni", role: "Core Team — Company Law", email: "sanjay.kulkarni@aa.com", status: "Active", lastLogin: "2026-08-11T16:05:00" },
  { id: "USR-5", name: "Neelam Verma", email: "neelam.verma@aa.com", role: "Core Team — Payroll", status: "Inactive", lastLogin: "2026-05-02T10:00:00" },
];

export interface Role {
  id: string;
  name: string;
  description: string;
  modules: string[];
  userCount: number;
}

export const mockRoles: Role[] = [
  { id: "ROLE-1", name: "Admin Head", description: "Full control of the platform.", modules: ["All modules"], userCount: 1 },
  { id: "ROLE-2", name: "Core Team — Tax", description: "View/process/complete Income Tax cases only.", modules: ["Cases (Income Tax)", "Clients", "Documents"], userCount: 1 },
  { id: "ROLE-3", name: "Core Team — GST", description: "View/process/complete GST cases only.", modules: ["Cases (GST)", "Clients", "Documents"], userCount: 1 },
  { id: "ROLE-4", name: "Core Team — Company Law", description: "View/process/complete incorporation cases only.", modules: ["Cases (Company Law)", "Clients", "Documents"], userCount: 1 },
  { id: "ROLE-5", name: "Finance", description: "View payments, approve refunds and revenue share.", modules: ["Payments", "Invoices", "Revenue Share"], userCount: 0 },
];
