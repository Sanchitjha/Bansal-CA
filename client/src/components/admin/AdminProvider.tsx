"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import {
  mockAdminProfile,
  mockLeads,
  mockAdminCases,
  mockCaseTasks,
  mockCaseMessages,
  mockClients,
  mockPartners,
  mockServices,
  mockAdminPayments,
  mockInvoices,
  mockLedgerEntries,
  mockStatements,
  mockPayouts,
  mockDisputes,
  mockRevenueShareRules,
  mockAdminDocuments,
  mockCmsPages,
  mockAdminNotifications,
  mockAuditLogs,
  mockTeamUsers,
  mockRoles,
  mockOrgInfo,
  AdminProfile,
  Lead,
  LeadStatus,
  AdminCase,
  AdminCaseStatus,
  CaseTask,
  CaseMessage,
  AdminClient,
  Partner,
  PartnerStatus,
  KYCDocStatus,
  Service,
  AdminPayment,
  Invoice,
  LedgerEntry,
  Statement,
  Payout,
  PayoutStatus,
  Dispute,
  RevenueShareRule,
  AdminDocument,
  DocumentStatus,
  CMSPage,
  ContentStatus,
  AdminNotification,
  AuditLog,
  TeamUser,
  Role,
  OrgInfo,
} from "@/data/admin";

const SESSION_KEY = "aa_admin_session";

interface AdminSession {
  email: string;
  name: string;
}

interface AdminContextValue {
  isAuthenticated: boolean;
  isCheckingSession: boolean;
  profile: AdminProfile;
  login: (email: string, name?: string) => void;
  logout: () => void;

  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  leads: Lead[];
  cases: AdminCase[];
  caseTasks: CaseTask[];
  caseMessages: CaseMessage[];
  clients: AdminClient[];
  partners: Partner[];
  services: Service[];
  payments: AdminPayment[];
  invoices: Invoice[];
  ledgerEntries: LedgerEntry[];
  statements: Statement[];
  payouts: Payout[];
  disputes: Dispute[];
  revenueShareRules: RevenueShareRule[];
  documents: AdminDocument[];
  cmsPages: CMSPage[];
  notifications: AdminNotification[];
  auditLogs: AuditLog[];
  teamUsers: TeamUser[];
  roles: Role[];
  orgInfo: OrgInfo;

  updateLeadStatus: (leadId: string, status: LeadStatus) => void;
  updateCaseStatus: (caseId: string, status: AdminCaseStatus, note?: string) => void;
  assignCase: (caseId: string, assignedTo: string) => void;
  toggleCaseTask: (taskId: string) => void;
  sendCaseMessage: (caseId: string, text: string) => void;

  reviewKycDocument: (
    partnerId: string,
    documentId: string,
    status: KYCDocStatus,
    reviewedBy: string,
    reason?: string
  ) => void;
  updatePartnerStatus: (partnerId: string, status: PartnerStatus) => void;

  reviewDocument: (documentId: string, status: DocumentStatus, reviewedBy: string, reason?: string) => void;

  markPaymentReviewed: (paymentId: string) => void;
  refundPayment: (paymentId: string, amount: number) => void;

  recordInvoicePayment: (invoiceId: string, amount: number) => void;
  cancelInvoice: (invoiceId: string) => void;

  updatePayoutStatus: (payoutId: string, status: PayoutStatus) => void;
  resolveDispute: (disputeId: string) => void;

  saveCmsDraft: (pageId: string, note: string, updatedBy: string) => void;
  publishCmsPage: (pageId: string, updatedBy: string) => void;

  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;

  logAction: (action: string, entity: string, entityId: string, user?: string, role?: string) => void;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

let auditSequence = 1000;

export function AdminProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [profile] = useState<AdminProfile>(mockAdminProfile);
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [cases, setCases] = useState<AdminCase[]>(mockAdminCases);
  const [caseTasks, setCaseTasks] = useState<CaseTask[]>(mockCaseTasks);
  const [caseMessages, setCaseMessages] = useState<CaseMessage[]>(mockCaseMessages);
  const [clients] = useState<AdminClient[]>(mockClients);
  const [partners, setPartners] = useState<Partner[]>(mockPartners);
  const [services] = useState<Service[]>(mockServices);
  const [payments, setPayments] = useState<AdminPayment[]>(mockAdminPayments);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [ledgerEntries] = useState<LedgerEntry[]>(mockLedgerEntries);
  const [statements] = useState<Statement[]>(mockStatements);
  const [payouts, setPayouts] = useState<Payout[]>(mockPayouts);
  const [disputes, setDisputes] = useState<Dispute[]>(mockDisputes);
  const [revenueShareRules] = useState<RevenueShareRule[]>(mockRevenueShareRules);
  const [documents, setDocuments] = useState<AdminDocument[]>(mockAdminDocuments);
  const [cmsPages, setCmsPages] = useState<CMSPage[]>(mockCmsPages);
  const [notifications, setNotifications] = useState<AdminNotification[]>(mockAdminNotifications);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [teamUsers] = useState<TeamUser[]>(mockTeamUsers);
  const [roles] = useState<Role[]>(mockRoles);
  const [orgInfo] = useState<OrgInfo>(mockOrgInfo);

  useEffect(() => {
    // One-time hydration from localStorage on mount — there is no React state
    // to derive this from, so it cannot be computed during render.
    const stored = window.localStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSession(JSON.parse(stored));
      } catch {
        window.localStorage.removeItem(SESSION_KEY);
      }
    }
    setIsCheckingSession(false);
  }, []);

  const login = (email: string, name?: string) => {
    const nextSession: AdminSession = { email, name: name || profile.name };
    setSession(nextSession);
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
  };

  const logout = () => {
    setSession(null);
    window.localStorage.removeItem(SESSION_KEY);
  };

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  const logAction = (action: string, entity: string, entityId: string, user = profile.name, role = profile.role) => {
    auditSequence += 1;
    setAuditLogs((prev) => [
      { id: `AUD-${auditSequence}`, timestamp: new Date().toISOString(), user, role, action, entity, entityId, ip: "127.0.0.1", result: "Success" },
      ...prev,
    ]);
  };

  const updateLeadStatus = (leadId: string, status: LeadStatus) => {
    setLeads((prev) => prev.map((lead) => (lead.id === leadId ? { ...lead, status } : lead)));
    logAction(`Lead status changed to ${status}`, "Lead", leadId);
  };

  const updateCaseStatus = (caseId: string, status: AdminCaseStatus, note?: string) => {
    const today = new Date().toISOString().slice(0, 10);
    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? { ...c, status, statusHistory: [...c.statusHistory, { status, date: today, note }] }
          : c
      )
    );
    logAction(`Case status changed to ${status}`, "Case", caseId);
  };

  const assignCase = (caseId: string, assignedTo: string) => {
    setCases((prev) => prev.map((c) => (c.id === caseId ? { ...c, assignedTo } : c)));
    logAction(`Case reassigned to ${assignedTo}`, "Case", caseId);
  };

  const toggleCaseTask = (taskId: string) => {
    setCaseTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: task.status === "Completed" ? "Pending" : "Completed" } : task
      )
    );
    logAction("Task status toggled", "Task", taskId);
  };

  const sendCaseMessage = (caseId: string, text: string) => {
    if (!text.trim()) return;
    setCaseMessages((prev) => [
      ...prev,
      { id: `CMSG-${prev.length + 1}`, caseId, sender: "admin", senderName: profile.name, text: text.trim(), date: new Date().toISOString() },
    ]);
  };

  const reviewKycDocument = (
    partnerId: string,
    documentId: string,
    status: KYCDocStatus,
    reviewedBy: string,
    reason?: string
  ) => {
    const today = new Date().toISOString().slice(0, 10);
    setPartners((prev) =>
      prev.map((partner) =>
        partner.id === partnerId
          ? {
              ...partner,
              kycDocuments: partner.kycDocuments.map((doc) =>
                doc.id === documentId
                  ? { ...doc, status, reviewedBy, reviewedAt: today, rejectionReason: status === "Rejected" ? reason : undefined }
                  : doc
              ),
            }
          : partner
      )
    );
    logAction(`KYC document ${status.toLowerCase()}`, "Document", documentId);
  };

  const updatePartnerStatus = (partnerId: string, status: PartnerStatus) => {
    setPartners((prev) => prev.map((p) => (p.id === partnerId ? { ...p, status } : p)));
    logAction(`Partner status changed to ${status}`, "Partner", partnerId);
  };

  const reviewDocument = (documentId: string, status: DocumentStatus, reviewedBy: string, reason?: string) => {
    const today = new Date().toISOString().slice(0, 10);
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId
          ? { ...doc, status, reviewedBy, reviewedAt: today, rejectionReason: status === "Rejected" ? reason : undefined }
          : doc
      )
    );
    logAction(`Document ${status.toLowerCase()}`, "Document", documentId);
  };

  const markPaymentReviewed = (paymentId: string) => {
    setPayments((prev) => prev.map((p) => (p.id === paymentId ? { ...p, status: "Paid", webhookStatus: "Verified" } : p)));
    logAction("Payment marked as verified", "Payment", paymentId);
  };

  const refundPayment = (paymentId: string, amount: number) => {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? { ...p, status: amount >= p.amount ? "Refunded" : "Partially Refunded", refundAmount: amount }
          : p
      )
    );
    logAction(`Payment refunded ($${amount})`, "Payment", paymentId);
  };

  const recordInvoicePayment = (invoiceId: string, amount: number) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== invoiceId) return inv;
        const paidAmount = Math.min(inv.amount, inv.paidAmount + amount);
        return { ...inv, paidAmount, status: paidAmount >= inv.amount ? "Paid" : "Partially Paid" };
      })
    );
    logAction(`Payment of $${amount} recorded against invoice`, "Invoice", invoiceId);
  };

  const cancelInvoice = (invoiceId: string) => {
    setInvoices((prev) => prev.map((inv) => (inv.id === invoiceId ? { ...inv, status: "Cancelled" } : inv)));
    logAction("Invoice cancelled", "Invoice", invoiceId);
  };

  const updatePayoutStatus = (payoutId: string, status: PayoutStatus) => {
    setPayouts((prev) =>
      prev.map((p) =>
        p.id === payoutId
          ? { ...p, status, paidDate: status === "Paid" ? new Date().toISOString().slice(0, 10) : p.paidDate }
          : p
      )
    );
    logAction(`Payout status changed to ${status}`, "Payout", payoutId);
  };

  const resolveDispute = (disputeId: string) => {
    setDisputes((prev) => prev.map((d) => (d.id === disputeId ? { ...d, status: "Resolved" } : d)));
    logAction("Revenue share dispute resolved", "Dispute", disputeId);
  };

  const saveCmsDraft = (pageId: string, note: string, updatedBy: string) => {
    const today = new Date().toISOString().slice(0, 10);
    setCmsPages((prev) =>
      prev.map((page) =>
        page.id === pageId
          ? {
              ...page,
              status: "Draft" as ContentStatus,
              lastUpdated: today,
              updatedBy,
              version: page.version + 1,
              history: [{ version: page.version + 1, updatedBy, updatedDate: today, note }, ...page.history],
            }
          : page
      )
    );
    logAction("CMS draft saved", "CMS Page", pageId);
  };

  const publishCmsPage = (pageId: string, updatedBy: string) => {
    const today = new Date().toISOString().slice(0, 10);
    setCmsPages((prev) =>
      prev.map((page) =>
        page.id === pageId ? { ...page, status: "Published" as ContentStatus, lastUpdated: today, updatedBy } : page
      )
    );
    logAction("CMS page published", "CMS Page", pageId);
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const value = useMemo<AdminContextValue>(
    () => ({
      isAuthenticated: session !== null,
      isCheckingSession,
      profile,
      login,
      logout,
      sidebarCollapsed,
      toggleSidebar,
      leads,
      cases,
      caseTasks,
      caseMessages,
      clients,
      partners,
      services,
      payments,
      invoices,
      ledgerEntries,
      statements,
      payouts,
      disputes,
      revenueShareRules,
      documents,
      cmsPages,
      notifications,
      auditLogs,
      teamUsers,
      roles,
      orgInfo,
      updateLeadStatus,
      updateCaseStatus,
      assignCase,
      toggleCaseTask,
      sendCaseMessage,
      reviewKycDocument,
      updatePartnerStatus,
      reviewDocument,
      markPaymentReviewed,
      refundPayment,
      recordInvoicePayment,
      cancelInvoice,
      updatePayoutStatus,
      resolveDispute,
      saveCmsDraft,
      publishCmsPage,
      markNotificationRead,
      markAllNotificationsRead,
      logAction,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      session,
      isCheckingSession,
      sidebarCollapsed,
      leads,
      cases,
      caseTasks,
      caseMessages,
      partners,
      payments,
      invoices,
      payouts,
      disputes,
      documents,
      cmsPages,
      notifications,
      auditLogs,
    ]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return ctx;
}
