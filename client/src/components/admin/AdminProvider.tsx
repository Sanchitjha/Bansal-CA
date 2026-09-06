"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { setToken } from "@/lib/api";
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
  login: (email: string, password?: string) => Promise<void>;
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

  const [profile, setProfile] = useState<AdminProfile>(mockAdminProfile);
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [cases, setCases] = useState<AdminCase[]>(mockAdminCases);
  const [caseTasks, setCaseTasks] = useState<CaseTask[]>(mockCaseTasks);
  const [caseMessages, setCaseMessages] = useState<CaseMessage[]>(mockCaseMessages);
  const [clients, setClients] = useState<AdminClient[]>(mockClients);
  const [partners, setPartners] = useState<Partner[]>(mockPartners);
  const [services, setServices] = useState<Service[]>(mockServices);
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
  const [teamUsers, setTeamUsers] = useState<TeamUser[]>(mockTeamUsers);
  const [roles] = useState<Role[]>(mockRoles);
  const [orgInfo] = useState<OrgInfo>(mockOrgInfo);

  // Mappers
  const mapBackendUserToFrontend = (u: any): TeamUser => ({
    id: u.id || u._id,
    name: `${u.firstName} ${u.lastName}`,
    email: u.email,
    role: u.roleName || "Team User",
    status: u.status === "ACTIVE" || u.status === "INVITED" ? "Active" : "Inactive",
    lastLogin: u.lastLoginAt ? new Date(u.lastLoginAt).toISOString() : "Never",
  });

  const mapBackendServiceToFrontend = (s: any): Service => ({
    id: s.code || s._id || s.id,
    name: s.name,
    category: s.category,
    description: s.description || "",
    pricingModel: s.pricingSnapshot?.pricingType === "FIXED" ? "Fixed" : s.pricingSnapshot?.pricingType === "STARTING_FROM" ? "Starting From" : "Quote Based",
    price: s.pricingSnapshot ? s.pricingSnapshot.amountMinor / 100 : undefined,
    paymentRule: "100% Advance",
    partnerSharePct: s.revenueRuleSnapshot?.value || 15,
    tdsPct: s.revenueRuleSnapshot?.tdsPercentage || 10,
    slaDays: s.slaDays || 15,
    requiredDocuments: s.documentRequirements ? s.documentRequirements.map((d: any) => d.label) : [],
    workflow: s.workflow ? s.workflow.map((w: any) => w.name) : ["Lead", "Payment", "Assignment", "Review", "Close"],
    status: s.status === "ACTIVE" ? "Active" : "Draft",
    publicVisibility: s.publicVisibility || false,
    updatedDate: new Date(s.updatedAt || s.createdAt || Date.now()).toISOString().slice(0, 10),
  });

  const mapBackendClientToFrontend = (c: any): AdminClient => ({
    id: c.clientCode || c.id || c._id,
    name: c.legalName,
    email: c.contact?.email || "",
    phone: c.contact?.phone || "",
    type: c.acquisitionSource === "PARTNER" ? "Partner Client" : "Self Client",
    partnerId: c.partnerId ? String(c.partnerId) : undefined,
    activeCases: 0,
    services: [],
    status: c.status === "ACTIVE" ? "Active" : "Inactive",
    createdDate: new Date(c.createdAt || Date.now()).toISOString().slice(0, 10),
    address: "",
  });

  const mapBackendPartnerToFrontend = (p: any): Partner => ({
    id: p.partnerCode || p.id || p._id,
    name: p.legalName || p.name || "",
    contactPerson: p.contactPerson || p.name || "",
    email: p.contact?.email || "",
    phone: p.contact?.phone || "",
    pan: p.pan || "",
    gstin: p.gstin || "",
    bankAccountName: p.bankAccountName || "",
    bankAccountNumber: p.bankAccountNumber || "",
    bankIfsc: p.bankIfsc || "",
    services: p.services || [],
    clientsCount: p.clientsCount || 0,
    revenueSharePct: p.revenueSharePct || 10,
    tdsPct: p.tdsPct || 10,
    status: p.status === "ACTIVE" ? "Active" : p.status === "SUSPENDED" ? "Suspended" : p.status === "PENDING" ? "Pending Verification" : "Rejected",
    createdDate: new Date(p.createdAt || Date.now()).toISOString().slice(0, 10),
    kycDocuments: p.kycDocuments || [],
  });

  const mapBackendLeadToFrontend = (l: any): Lead => ({
    id: l._id || l.id,
    name: l.name,
    email: l.email || "",
    phone: l.phone || "",
    serviceId: l.serviceId || "income-tax",
    serviceName: l.serviceName || l.service || "Income Tax Return Filing",
    source: l.source || "Website",
    assignedTo: l.assignedTo || "Priya Sharma",
    status: l.status === "NEW" ? "New" : l.status === "CONTACTED" ? "Contacted" : l.status === "QUALIFIED" ? "Qualified" : l.status === "CONVERTED" ? "Converted" : "Lost",
    createdDate: new Date(l.createdAt || Date.now()).toISOString().slice(0, 10),
  });

  const mapBackendStatusToAdminCaseStatus = (status: string): AdminCaseStatus => {
    switch (status) {
      case "NEW": return "New";
      case "PAYMENT_PENDING": return "Payment Pending";
      case "OPEN": return "In Progress";
      case "IN_PROCESS": return "In Progress";
      case "WAITING_FOR_CLIENT": return "Waiting for Client";
      case "REVIEW": return "Review";
      case "CLOSED": return "Closed";
      case "CANCELLED": return "Cancelled";
      default: return "In Progress";
    }
  };

  const mapBackendCaseToAdminCase = (c: any): AdminCase => {
    const mapped: AdminCase = {
      id: c.caseNumber || c.id || c._id,
      clientId: String(c.clientId),
      clientName: c.clientName || "Client",
      serviceId: c.serviceId || "income-tax",
      serviceName: c.serviceSnapshot?.name || "Service",
      assignedTo: c.assignedTo ? String(c.assignedTo) : "Priya Sharma",
      status: mapBackendStatusToAdminCaseStatus(c.status),
      priority: c.priority === "HIGH" || c.priority === "URGENT" ? "High" : c.priority === "LOW" ? "Low" : "Medium",
      createdDate: new Date(c.openedAt || c.createdAt || Date.now()).toISOString().slice(0, 10),
      slaDueDate: c.dueAt ? new Date(c.dueAt).toISOString().slice(0, 10) : new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
      paymentStatus: c.paymentStatus === "PAID" ? "Paid" : c.paymentStatus === "PENDING" ? "Pending" : c.paymentStatus === "REFUNDED" ? "Refunded" : "Not Required",
      amount: (c.pricingSnapshot?.amountMinor || 0) / 100,
      statusHistory: Array.isArray(c.statusHistory)
        ? c.statusHistory.map((h: any) => ({
            status: mapBackendStatusToAdminCaseStatus(h.status),
            date: new Date(h.date || h.createdAt).toISOString().slice(0, 10),
            note: h.note,
          }))
        : [
            {
              status: mapBackendStatusToAdminCaseStatus(c.status),
              date: new Date(c.openedAt || c.createdAt).toISOString().slice(0, 10),
              note: c.notes || "Case created.",
            },
          ],
    };
    (mapped as any).dbId = c._id || c.id;
    return mapped;
  };

  const mapAdminCaseStatusToBackend = (status: AdminCaseStatus): string => {
    switch (status) {
      case "New": return "NEW";
      case "Payment Pending": return "PAYMENT_PENDING";
      case "Documents Pending": return "WAITING_FOR_CLIENT";
      case "In Progress": return "IN_PROCESS";
      case "Waiting for Client": return "WAITING_FOR_CLIENT";
      case "Review": return "REVIEW";
      case "Completed": return "CLOSED";
      case "Closed": return "CLOSED";
      case "Cancelled": return "CANCELLED";
      default: return "IN_PROCESS";
    }
  };

  useEffect(() => {
    const stored = window.localStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSession(parsed);
        setProfile({
          name: parsed.name,
          email: parsed.email,
          role: "Administrator",
        });
      } catch {
        window.localStorage.removeItem(SESSION_KEY);
      }
    }
    setIsCheckingSession(false);
  }, []);

  // Fetch admin panel data
  useEffect(() => {
    if (isCheckingSession || !session) return;

    const fetchData = async () => {
      try {
        // 1. Fetch Users
        const usersRes = await fetch("http://localhost:5000/api/users");
        if (usersRes.ok) {
          const backendUsers = await usersRes.json();
          if (backendUsers.length > 0) {
            setTeamUsers(backendUsers.map(mapBackendUserToFrontend));
          }
        }

        // 2. Fetch Services
        const servicesRes = await fetch("http://localhost:5000/api/services");
        if (servicesRes.ok) {
          const backendServices = await servicesRes.json();
          if (backendServices.length > 0) {
            setServices(backendServices.map(mapBackendServiceToFrontend));
          }
        }

        // 3. Fetch Clients
        const clientsRes = await fetch("http://localhost:5000/api/clients");
        let backendClients: any[] = [];
        if (clientsRes.ok) {
          backendClients = await clientsRes.json();
        }

        // 4. Fetch Partners
        const partnersRes = await fetch("http://localhost:5000/api/partners");
        if (partnersRes.ok) {
          const backendPartners = await partnersRes.json();
          if (backendPartners.length > 0) {
            setPartners(backendPartners.map(mapBackendPartnerToFrontend));
          }
        }

        // 5. Fetch Leads
        const leadsRes = await fetch("http://localhost:5000/api/leads");
        if (leadsRes.ok) {
          const backendLeads = await leadsRes.json();
          if (backendLeads.length > 0) {
            setLeads(backendLeads.map(mapBackendLeadToFrontend));
          }
        }

        // 6. Fetch Cases
        const casesRes = await fetch("http://localhost:5000/api/cases");
        if (casesRes.ok) {
          const backendCases = await casesRes.json();
          
          const mappedCases = backendCases.map((c: any) => {
            const matchedClient = backendClients.find(cl => cl._id === c.clientId || cl.id === c.clientId);
            return mapBackendCaseToAdminCase({
              ...c,
              clientName: matchedClient ? matchedClient.legalName : "Direct Client",
            });
          });
          setCases(mappedCases);

          if (backendClients.length > 0) {
            const mappedClients = backendClients.map((cl: any) => {
              const clientCases = backendCases.filter((c: any) => c.clientId === cl._id || c.clientId === cl.id);
              const clientServices = Array.from(new Set(clientCases.map((c: any) => c.serviceSnapshot?.name || "Service"))).filter(Boolean) as string[];
              return {
                ...mapBackendClientToFrontend(cl),
                activeCases: clientCases.filter((c: any) => c.status !== "CLOSED" && c.status !== "CANCELLED").length,
                services: clientServices,
              };
            });
            setClients(mappedClients);
          }
        }
      } catch (err) {
        console.error("Failed to fetch admin dashboard details:", err);
      }
    };

    fetchData();
  }, [session, isCheckingSession]);

  const login = async (email: string, password?: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/users/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const resData = await res.json();
        const user = resData.user;
        if (resData.token) {
          setToken(resData.token);
        }
        const nextSession: AdminSession = {
          email: user.email,
          name: `${user.firstName || "Amit"} ${user.lastName || "Bansal"}`,
        };
        setSession(nextSession);
        setProfile({
          name: nextSession.name,
          email: nextSession.email,
          role: "Administrator",
        });
        window.localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
        return;
      }
    } catch (err) {
      console.warn("Backend offline, continuing with local admin demo authentication");
    }

    // Resilient local fallback for standalone demo/frontend
    const nextSession: AdminSession = {
      email: email || "amit.bansal@aa.com",
      name: "Amit Bansal",
    };
    setSession(nextSession);
    setProfile({
      name: nextSession.name,
      email: nextSession.email,
      role: "Administrator",
    });
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
  };

  const logout = () => {
    setSession(null);
    setToken(null);
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

  const updateLeadStatus = async (leadId: string, status: LeadStatus) => {
    setLeads((prev) => prev.map((lead) => (lead.id === leadId ? { ...lead, status } : lead)));
    logAction(`Lead status changed to ${status}`, "Lead", leadId);

    try {
      const backendStatus = status === "New" ? "NEW" : status === "Contacted" ? "CONTACTED" : status === "Qualified" ? "QUALIFIED" : "LOST";
      await fetch(`http://localhost:5000/api/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: backendStatus })
      });
    } catch (err) {
      console.error("Failed to update lead status on backend", err);
    }
  };

  const updateCaseStatus = async (caseId: string, status: AdminCaseStatus, note?: string) => {
    const today = new Date().toISOString().slice(0, 10);
    const matchedCase = cases.find(c => c.id === caseId);
    if (!matchedCase) return;

    const dbId = (matchedCase as any).dbId || matchedCase.id;
    const backendStatus = mapAdminCaseStatusToBackend(status);

    const updatedStatusHistory = [
      ...matchedCase.statusHistory.map(h => ({
        status: mapAdminCaseStatusToBackend(h.status),
        date: h.date,
        note: h.note
      })),
      { status: backendStatus, date: new Date().toISOString(), note }
    ];

    setCases((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? { ...c, status, statusHistory: [...c.statusHistory, { status, date: today, note }] }
          : c
      )
    );
    logAction(`Case status changed to ${status}`, "Case", caseId);

    try {
      await fetch(`http://localhost:5000/api/cases/${dbId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: backendStatus,
          statusHistory: updatedStatusHistory
        })
      });
    } catch (err) {
      console.error("Failed to update case status on backend", err);
    }
  };

  const assignCase = async (caseId: string, assignedTo: string) => {
    const matchedCase = cases.find(c => c.id === caseId);
    if (!matchedCase) return;

    const dbId = (matchedCase as any).dbId || matchedCase.id;

    setCases((prev) => prev.map((c) => (c.id === caseId ? { ...c, assignedTo } : c)));
    logAction(`Case reassigned to ${assignedTo}`, "Case", caseId);

    try {
      await fetch(`http://localhost:5000/api/cases/${dbId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedTo })
      });
    } catch (err) {
      console.error("Failed to assign case on backend", err);
    }
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
