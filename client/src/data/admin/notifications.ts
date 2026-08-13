// Mock data for the Admin Panel — Notification Center.

export type NotificationCategory = "Payments" | "Cases" | "Documents" | "Partners" | "System";

export interface AdminNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  date: string;
  read: boolean;
  actionLabel?: string;
  actionHref?: string;
}

export const mockAdminNotifications: AdminNotification[] = [
  { id: "ANOTIF-1", category: "Partners", title: "Partner KYC requires verification", message: "Coral Compliance Co. uploaded a new PAN document.", date: "2026-08-12T09:00:00", read: false, actionLabel: "Review", actionHref: "/admin/partners/PTR-104" },
  { id: "ANOTIF-2", category: "Payments", title: "Payment verification required", message: "Manual payment of $150 for AA-CASE-1063 needs review.", date: "2026-08-12T08:15:00", read: false, actionLabel: "Review", actionHref: "/admin/payments" },
  { id: "ANOTIF-3", category: "Documents", title: "Document rejected", message: "Purchase Bills — April rejected for Sunita Rao Textiles Pvt Ltd.", date: "2026-08-11T17:45:00", read: true, actionLabel: "View", actionHref: "/admin/documents" },
  { id: "ANOTIF-4", category: "Cases", title: "Case SLA approaching", message: "AA-CASE-1102 is due in 1 day and is still Documents Pending.", date: "2026-08-11T15:30:00", read: false, actionLabel: "View Case", actionHref: "/admin/cases/AA-CASE-1102" },
  { id: "ANOTIF-5", category: "Partners", title: "Partner payout dispute submitted", message: "Bluepeak Partners disputed statement STMT-2026-W32.", date: "2026-08-11T12:10:00", read: false, actionLabel: "Review", actionHref: "/admin/revenue" },
  { id: "ANOTIF-6", category: "System", title: "Weekly statements generated", message: "6 partner statements were generated for the week of Aug 3–9.", date: "2026-08-10T06:00:00", read: true },
  { id: "ANOTIF-7", category: "Cases", title: "New lead received", message: "Rahul Menon submitted a new lead for Income Tax Return Filing.", date: "2026-08-12T07:40:00", read: false, actionLabel: "View Lead", actionHref: "/admin/leads" },
  { id: "ANOTIF-8", category: "Payments", title: "Payment failed", message: "Card payment for AA-CASE-1118 failed — client notified to retry.", date: "2026-08-09T14:20:00", read: true },
  { id: "ANOTIF-9", category: "Documents", title: "Document expiring soon", message: "Zenith Advisors' GSTIN Certificate expires in 45 days.", date: "2026-08-08T09:00:00", read: true },
  { id: "ANOTIF-10", category: "System", title: "Scheduled maintenance", message: "Platform maintenance window scheduled for Aug 18, 1–2 AM IST.", date: "2026-08-07T11:00:00", read: true },
];
