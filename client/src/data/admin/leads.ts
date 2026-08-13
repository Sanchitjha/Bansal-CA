// Mock data for the Admin Panel — Leads.
// Stands in for the API responses the backend will eventually provide.

export type LeadStatus = "New" | "Contacted" | "Qualified" | "Converted" | "Lost";

export type LeadSource = "Website" | "Partner Referral" | "Phone Enquiry" | "Walk-in" | "Referral";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceId: string;
  serviceName: string;
  source: LeadSource;
  partnerId?: string;
  partnerName?: string;
  assignedTo: string;
  status: LeadStatus;
  notes?: string;
  createdDate: string;
}

export const mockLeads: Lead[] = [
  { id: "LEAD-1001", name: "Kavita Rao", email: "kavita.rao@example.com", phone: "+91 90000 11001", serviceId: "income-tax", serviceName: "Income Tax Return Filing", source: "Website", assignedTo: "Priya Sharma", status: "New", createdDate: "2026-08-11" },
  { id: "LEAD-1002", name: "Deepak Sethi", email: "deepak.sethi@example.com", phone: "+91 90000 11002", serviceId: "gst-compliance", serviceName: "GST Registration & Compliance", source: "Partner Referral", partnerId: "PTR-101", partnerName: "Zenith Advisors", assignedTo: "Arjun Nair", status: "Contacted", notes: "Requested a callback after 5pm.", createdDate: "2026-08-10" },
  { id: "LEAD-1003", name: "Meera Iyer", email: "meera.iyer@example.com", phone: "+91 90000 11003", serviceId: "company-incorporation", serviceName: "Company Incorporation & Registrations", source: "Partner Referral", partnerId: "PTR-102", partnerName: "Northgate Consulting", assignedTo: "Sanjay Kulkarni", status: "Qualified", createdDate: "2026-08-08" },
  { id: "LEAD-1004", name: "Farhan Ali", email: "farhan.ali@example.com", phone: "+91 90000 11004", serviceId: "payroll-taxes", serviceName: "Payroll Taxes (940/941)", source: "Phone Enquiry", assignedTo: "Priya Sharma", status: "Converted", createdDate: "2026-08-01" },
  { id: "LEAD-1005", name: "Ritu Chawla", email: "ritu.chawla@example.com", phone: "+91 90000 11005", serviceId: "accounting-bookkeeping", serviceName: "Accounting & Bookkeeping", source: "Website", assignedTo: "Arjun Nair", status: "Lost", notes: "Went with a local firm.", createdDate: "2026-07-28" },
  { id: "LEAD-1006", name: "Vikram Oberoi", email: "vikram.oberoi@example.com", phone: "+91 90000 11006", serviceId: "1099-filings", serviceName: "1099 Filings", source: "Partner Referral", partnerId: "PTR-101", partnerName: "Zenith Advisors", assignedTo: "Sanjay Kulkarni", status: "New", createdDate: "2026-08-12" },
  { id: "LEAD-1007", name: "Ananya Bose", email: "ananya.bose@example.com", phone: "+91 90000 11007", serviceId: "w2-filings", serviceName: "Withholding & W-2 Filings", source: "Referral", assignedTo: "Priya Sharma", status: "Qualified", createdDate: "2026-08-06" },
  { id: "LEAD-1008", name: "Suresh Pillai", email: "suresh.pillai@example.com", phone: "+91 90000 11008", serviceId: "foreign-accounting", serviceName: "Foreign Accounting & Taxes", source: "Website", assignedTo: "Arjun Nair", status: "Contacted", createdDate: "2026-08-09" },
  { id: "LEAD-1009", name: "Neha Kapoor", email: "neha.kapoor@example.com", phone: "+91 90000 11009", serviceId: "gst-compliance", serviceName: "GST Registration & Compliance", source: "Partner Referral", partnerId: "PTR-103", partnerName: "Bluepeak Partners", assignedTo: "Sanjay Kulkarni", status: "Converted", createdDate: "2026-07-22" },
  { id: "LEAD-1010", name: "Rahul Menon", email: "rahul.menon@example.com", phone: "+91 90000 11010", serviceId: "income-tax", serviceName: "Income Tax Return Filing", source: "Website", assignedTo: "Priya Sharma", status: "New", createdDate: "2026-08-12" },
];
