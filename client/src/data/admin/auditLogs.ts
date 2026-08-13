// Mock data for the Admin Panel — Audit Logs.

export type AuditResult = "Success" | "Failed";

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  entity: string;
  entityId: string;
  ip: string;
  result: AuditResult;
}

export const mockAuditLogs: AuditLog[] = [
  { id: "AUD-1", timestamp: "2026-08-12T09:12:00", user: "Amit Bansal", role: "Admin Head", action: "Partner approved", entity: "Partner", entityId: "PTR-103", ip: "103.21.244.10", result: "Success" },
  { id: "AUD-2", timestamp: "2026-08-12T08:47:00", user: "Priya Sharma", role: "Core Team", action: "Document rejected", entity: "Document", entityId: "DOC-3005", ip: "49.207.11.202", result: "Success" },
  { id: "AUD-3", timestamp: "2026-08-11T17:30:00", user: "Amit Bansal", role: "Admin Head", action: "Payment refunded", entity: "Payment", entityId: "PAY-4021", ip: "103.21.244.10", result: "Success" },
  { id: "AUD-4", timestamp: "2026-08-11T16:05:00", user: "Sanjay Kulkarni", role: "Core Team", action: "Case reassigned", entity: "Case", entityId: "AA-CASE-1102", ip: "117.203.12.5", result: "Success" },
  { id: "AUD-5", timestamp: "2026-08-11T14:22:00", user: "Amit Bansal", role: "Admin Head", action: "Service price changed", entity: "Service", entityId: "gst-compliance", ip: "103.21.244.10", result: "Success" },
  { id: "AUD-6", timestamp: "2026-08-11T11:40:00", user: "Amit Bansal", role: "Admin Head", action: "Revenue share modified", entity: "Revenue Rule", entityId: "RULE-14", ip: "103.21.244.10", result: "Success" },
  { id: "AUD-7", timestamp: "2026-08-10T19:02:00", user: "Arjun Nair", role: "Core Team", action: "Login attempt", entity: "User", entityId: "arjun.nair@aa.com", ip: "45.114.88.3", result: "Failed" },
  { id: "AUD-8", timestamp: "2026-08-10T18:58:00", user: "Arjun Nair", role: "Core Team", action: "Login", entity: "User", entityId: "arjun.nair@aa.com", ip: "45.114.88.3", result: "Success" },
  { id: "AUD-9", timestamp: "2026-08-10T15:10:00", user: "Amit Bansal", role: "Admin Head", action: "Payout scheduled", entity: "Payout", entityId: "PYT-208", ip: "103.21.244.10", result: "Success" },
  { id: "AUD-10", timestamp: "2026-08-09T13:26:00", user: "Priya Sharma", role: "Core Team", action: "Task completed", entity: "Task", entityId: "CTASK-55", ip: "49.207.11.202", result: "Success" },
  { id: "AUD-11", timestamp: "2026-08-09T10:15:00", user: "Amit Bansal", role: "Admin Head", action: "CMS page published", entity: "CMS Page", entityId: "announcements", ip: "103.21.244.10", result: "Success" },
  { id: "AUD-12", timestamp: "2026-08-08T09:00:00", user: "Amit Bansal", role: "Admin Head", action: "Permission changed", entity: "User", entityId: "sanjay.kulkarni@aa.com", ip: "103.21.244.10", result: "Success" },
];
