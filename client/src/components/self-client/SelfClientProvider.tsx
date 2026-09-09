"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { API_URL, setToken } from "@/lib/api";
import {
  mockMessages,
  mockNotifications,
  mockCases,
  mockDocuments,
  mockPayments,
  mockTasks,
  CaseStatus,
  DocumentStatus,
  PaymentStatus,
  SelfClientCase,
  SelfClientDocument,
  SelfClientMessage,
  SelfClientNotification,
  SelfClientPayment,
  SelfClientProfile,
  SelfClientTask,
  mockProfile,
} from "@/data/selfClientMock";

const SESSION_KEY = "aa_self_client_session_v2";

interface SelfClientSession {
  token?: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roleId: string;
    status: string;
  };
  client: {
    id: string;
    userId: string;
    clientCode: string;
    clientType: "INDIVIDUAL" | "BUSINESS";
    legalName: string;
    contact: {
      email: string;
      phone: string;
    };
    status: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

interface NewCaseInput {
  serviceId: string;
  serviceName: string;
  amount: number;
  notes?: string;
}

interface SelfClientContextValue {
  isAuthenticated: boolean;
  isCheckingSession: boolean;
  profile: SelfClientProfile;
  login: (email: string, password?: string) => Promise<void>;
  signup: (data: {
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    phone?: string;
    legalName?: string;
    clientType?: "INDIVIDUAL" | "BUSINESS";
  }) => Promise<void>;
  logout: () => void;
  cases: SelfClientCase[];
  documents: SelfClientDocument[];
  payments: SelfClientPayment[];
  tasks: SelfClientTask[];
  messages: SelfClientMessage[];
  notifications: SelfClientNotification[];
  addCase: (input: NewCaseInput) => Promise<SelfClientCase>;
  markTaskDone: (taskId: string) => Promise<void>;
  markDocumentUploaded: (documentId: string) => Promise<void>;
  sendMessage: (caseId: string, text: string) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  payInvoice: (paymentId: string) => void;
}

const SelfClientContext = createContext<SelfClientContextValue | undefined>(undefined);

let messageSequence = 100;
const notificationSequence = 100;

// Mappers
function mapBackendStatusToFrontend(status: string): CaseStatus {
  switch (status) {
    case "NEW": return "New Lead";
    case "PAYMENT_PENDING": return "Payment Pending";
    case "OPEN": return "Open";
    case "IN_PROCESS": return "In Process";
    case "WAITING_FOR_CLIENT": return "Waiting for Client";
    case "REVIEW": return "Review";
    case "CLOSED": return "Closed";
    case "CANCELLED": return "Closed";
    default: return "Open";
  }
}

function mapBackendPaymentStatusToFrontend(status: string): PaymentStatus {
  switch (status) {
    case "PENDING": return "Pending";
    case "PAID": return "Paid";
    case "PARTIALLY_PAID": return "Partially Paid";
    default: return "Not Required";
  }
}

function mapBackendCaseToFrontend(c: any): SelfClientCase {
  return {
    id: c.caseNumber || c.id,
    serviceId: c.serviceId,
    serviceName: c.serviceSnapshot?.name || "Service",
    status: mapBackendStatusToFrontend(c.status),
    priority: c.priority === "HIGH" || c.priority === "URGENT" ? "High" : c.priority === "MEDIUM" ? "Medium" : "Low",
    createdDate: new Date(c.openedAt || c.createdAt).toISOString().slice(0, 10),
    dueDate: c.dueAt ? new Date(c.dueAt).toISOString().slice(0, 10) : undefined,
    amount: (c.pricingSnapshot?.amountMinor || 0) / 100,
    paymentStatus: mapBackendPaymentStatusToFrontend(c.paymentStatus),
    statusHistory: Array.isArray(c.statusHistory)
      ? c.statusHistory.map((h: any) => ({
          status: mapBackendStatusToFrontend(h.status),
          date: new Date(h.date || h.createdAt).toISOString().slice(0, 10),
          note: h.note,
        }))
      : [
          {
            status: mapBackendStatusToFrontend(c.status),
            date: new Date(c.openedAt || c.createdAt).toISOString().slice(0, 10),
            note: c.notes || "Service request received.",
          },
        ],
  };
}

function mapBackendTaskToFrontend(t: any): SelfClientTask {
  return {
    id: t.id,
    caseId: String(t.caseId),
    title: t.title,
    description: t.description || "",
    dueDate: new Date(t.dueAt).toISOString().slice(0, 10),
    status: t.status === "COMPLETED" ? "Completed" : "Pending",
    requiresUpload: t.completionRequirements?.requiresDocument || false,
  };
}

function mapBackendDocumentToFrontend(doc: any): SelfClientDocument {
  return {
    id: doc.id,
    caseId: String(doc.ownerId),
    name: doc.originalFileName || doc.documentType,
    status: mapBackendDocStatusToFrontend(doc.status),
    requestedDate: new Date(doc.createdAt).toISOString().slice(0, 10),
    uploadedDate: doc.updatedAt ? new Date(doc.updatedAt).toISOString().slice(0, 10) : undefined,
  };
}

function mapBackendDocStatusToFrontend(status: string): DocumentStatus {
  switch (status) {
    case "REQUESTED": return "Requested";
    case "UPLOADED": return "Uploaded";
    case "UNDER_REVIEW": return "Under Review";
    case "ACCEPTED": return "Accepted";
    case "REJECTED": return "Rejected";
    case "RE_UPLOAD_REQUIRED": return "Re-upload Required";
    default: return "Requested";
  }
}

export function SelfClientProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SelfClientSession | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const [profile, setProfile] = useState<SelfClientProfile>(mockProfile);
  const [cases, setCases] = useState<SelfClientCase[]>(mockCases);
  const [documents, setDocuments] = useState<SelfClientDocument[]>(mockDocuments);
  const [payments, setPayments] = useState<SelfClientPayment[]>(mockPayments);
  const [tasks, setTasks] = useState<SelfClientTask[]>(mockTasks);
  const [messages, setMessages] = useState<SelfClientMessage[]>(mockMessages);
  const [notifications, setNotifications] = useState<SelfClientNotification[]>(mockNotifications);

  const DEFAULT_CLIENT_SESSION: SelfClientSession = {
    token: "mock-client-jwt",
    user: {
      id: "u-cli-1",
      email: "rohan.mehta@example.com",
      firstName: "Rohan",
      lastName: "Mehta",
      roleId: "client",
      status: "ACTIVE",
    },
    client: {
      id: "CLT-2001",
      userId: "u-cli-1",
      clientCode: "CLT-2001",
      clientType: "INDIVIDUAL",
      legalName: "Rohan Mehta",
      contact: {
        email: "rohan.mehta@example.com",
        phone: "+91 98765 43210",
      },
      status: "ACTIVE",
      createdAt: "2026-02-14",
    },
  };

  // Load session on mount or initialize default demo client
  useEffect(() => {
    const stored = window.localStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        setSession(JSON.parse(stored));
      } catch {
        setSession(DEFAULT_CLIENT_SESSION);
        window.localStorage.setItem(SESSION_KEY, JSON.stringify(DEFAULT_CLIENT_SESSION));
      }
    } else {
      setSession(DEFAULT_CLIENT_SESSION);
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(DEFAULT_CLIENT_SESSION));
    }
    setIsCheckingSession(false);
  }, []);

  // Fetch portal data when session is established
  useEffect(() => {
    if (isCheckingSession || !session) return;

    const fetchData = async () => {
      try {
        const clientProfile = session.client;
        
        setProfile({
          name: clientProfile.legalName,
          email: clientProfile.contact.email,
          phone: clientProfile.contact.phone,
          clientType: "Self Client",
          memberSince: clientProfile.createdAt
            ? new Date(clientProfile.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })
            : "August 2026",
        });

        // 1. Fetch cases
        const casesRes = await fetch(`${API_URL}/api/cases?clientId=${clientProfile.id}`);
        if (!casesRes.ok) throw new Error("Failed to fetch cases");
        const backendCases = await casesRes.json();
        
        const mappedCases = backendCases.map(mapBackendCaseToFrontend);
        setCases(mappedCases);

        // 2. Fetch tasks and documents for each case
        const allTasks: SelfClientTask[] = [];
        const allDocs: SelfClientDocument[] = [];

        for (const c of backendCases) {
          const caseId = c.id;

          // Fetch tasks
          try {
            const tasksRes = await fetch(`${API_URL}/api/cases/${c.id}/tasks`);
            if (tasksRes.ok) {
              const backendTasks = await tasksRes.json();
              allTasks.push(...backendTasks.map(mapBackendTaskToFrontend));
            }
          } catch (err) {
            console.error(`Failed to fetch tasks for case ${caseId}`, err);
          }

          // Fetch documents
          try {
            const docsRes = await fetch(`${API_URL}/api/cases/${c.id}/documents?ownerType=CASE`);
            if (docsRes.ok) {
              const backendDocs = await docsRes.json();
              allDocs.push(...backendDocs.map(mapBackendDocumentToFrontend));
            }
          } catch (err) {
            console.error(`Failed to fetch documents for case ${caseId}`, err);
          }
        }

        setTasks(allTasks);
        setDocuments(allDocs);

        // 3. Derive invoices/payments
        const derivedPayments = backendCases
          .filter((c: any) => c.pricingSnapshot && c.pricingSnapshot.amountMinor > 0)
          .map((c: any) => ({
            id: `INV-${c.caseNumber || c.id}`,
            caseId: c.caseNumber || c.id,
            description: `${c.serviceSnapshot?.name || "Service"} Fee`,
            amount: (c.pricingSnapshot?.amountMinor || 0) / 100,
            status: c.paymentStatus === "PAID" ? "Success" : "Pending" as "Pending" | "Success" | "Failed",
            date: new Date(c.openedAt || c.createdAt).toISOString().slice(0, 10),
            invoiceAvailable: true,
          }));
        setPayments(derivedPayments);

      } catch (error) {
        console.error("Error loading portal data from backend", error);
      }
    };

    fetchData();
  }, [session, isCheckingSession]);

  const login = async (email: string, password?: string) => {
    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const responseData = await res.json();
        if (responseData.token) {
          setToken(responseData.token);
        }
        const sessionData: SelfClientSession = {
          user: responseData.user,
          client: responseData.client,
        };
        setSession(sessionData);
        window.localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
        return;
      }
    } catch (err) {
      console.warn("Backend offline, continuing with local self-client demo authentication");
    }

    // Resilient local fallback for standalone demo/frontend
    const sessionData: SelfClientSession = {
      token: "mock-client-jwt",
      user: {
        id: "u-cli-1",
        email: email || "rohan.mehta@example.com",
        firstName: "Rohan",
        lastName: "Mehta",
        roleId: "client",
        status: "ACTIVE",
      },
      client: {
        id: "CLT-2001",
        userId: "u-cli-1",
        clientCode: "CLT-2001",
        clientType: "INDIVIDUAL",
        legalName: "Rohan Mehta",
        contact: {
          email: email || "rohan.mehta@example.com",
          phone: "+91 98765 43210",
        },
        status: "ACTIVE",
        createdAt: "2026-02-14",
      },
    };
    setSession(sessionData);
    setProfile({
      name: "Rohan Mehta",
      email: email || "rohan.mehta@example.com",
      phone: "+91 98765 43210",
      clientType: "Self Client",
      memberSince: "February 2026",
    });
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  };

  const signup = async (signupData: {
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    phone?: string;
    legalName?: string;
    clientType?: "INDIVIDUAL" | "BUSINESS";
  }) => {
    const res = await fetch(`${API_URL}/api/users/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signupData),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "Failed to register. Please check details and try again.");
    }

    const responseData = await res.json();
    if (responseData.token) {
      setToken(responseData.token);
    }
    const sessionData: SelfClientSession = {
      user: responseData.user,
      client: responseData.client,
    };
    setSession(sessionData);
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  };

  const logout = () => {
    setSession(null);
    setCases([]);
    setTasks([]);
    setDocuments([]);
    setPayments([]);
    setToken(null);
    window.localStorage.removeItem(SESSION_KEY);
  };

  const addCase = async ({ serviceId, serviceName, amount, notes }: NewCaseInput): Promise<SelfClientCase> => {
    if (!session) throw new Error("Not authenticated");

    const caseNumber = `AA-CASE-${Math.floor(100000 + Math.random() * 900000)}`;
    const payload = {
      caseNumber,
      source: "WEBSITE",
      clientId: session.client.id,
      serviceId: "60d5ec49f3e46c2b188c0001", // Dummy ObjectId
      serviceSnapshot: {
        code: serviceId,
        name: serviceName,
        category: "Taxation",
      },
      pricingSnapshot: {
        pricingType: "FIXED",
        amountMinor: amount * 100,
        currency: "INR",
      },
      revenueRuleSnapshot: {
        ruleType: "FIXED_AMOUNT",
        value: 0,
        tdsPercentage: 0,
      },
      workflowSnapshot: {},
      priority: "MEDIUM",
      status: "NEW",
      paymentStatus: amount > 0 ? "PENDING" : "PAID",
      notes: notes || "",
    };

    const res = await fetch(`${API_URL}/api/cases`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "Failed to submit request.");
    }

    const createdBackendCase = await res.json();
    const mapped = mapBackendCaseToFrontend(createdBackendCase);
    setCases((prev) => [mapped, ...prev]);

    // Construct derived invoice if required
    if (amount > 0) {
      setPayments((prev) => [
        {
          id: `INV-${mapped.id}`,
          caseId: mapped.id,
          description: `${serviceName} Fee`,
          amount,
          status: "Pending",
          date: new Date().toISOString().slice(0, 10),
          invoiceAvailable: true,
        },
        ...prev,
      ],);
    }

    return mapped;
  };

  const markTaskDone = async (taskId: string) => {
    // 1. Find caseId for this task locally
    const taskObj = tasks.find((t) => t.id === taskId);
    if (!taskObj) return;

    // 2. Call PUT /api/cases/{caseId}/tasks/{taskId}
    try {
      const res = await fetch(`${API_URL}/api/cases/${taskObj.caseId}/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "COMPLETED",
          completedAt: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        setTasks((prev) =>
          prev.map((task) => (task.id === taskId ? { ...task, status: "Completed" } : task))
        );
      }
    } catch (err) {
      console.error("Failed to complete task on backend", err);
    }
  };

  const markDocumentUploaded = async (documentId: string) => {
    const docObj = documents.find((d) => d.id === documentId);
    if (!docObj) return;

    try {
      const res = await fetch(`${API_URL}/api/cases/${docObj.caseId}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerType: "CASE",
          documentType: docObj.name,
          fileId: "file_" + Math.random().toString(36).substring(7),
          storageKey: "key_" + Math.random().toString(36).substring(7),
          originalFileName: docObj.name,
          status: "UPLOADED",
        }),
      });

      if (res.ok) {
        const today = new Date().toISOString().slice(0, 10);
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === documentId ? { ...doc, status: "Uploaded", uploadedDate: today } : doc
          )
        );
      }
    } catch (err) {
      console.error("Failed to upload document on backend", err);
    }
  };

  const sendMessage = (caseId: string, text: string) => {
    if (!text.trim()) return;
    messageSequence += 1;
    setMessages((prev) => [
      ...prev,
      {
        id: `MSG-${messageSequence}`,
        caseId,
        sender: "client",
        senderName: profile.name,
        text: text.trim(),
        date: new Date().toISOString(),
      },
    ]);
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const payInvoice = (paymentId: string) => {
    const paid = payments.find((p) => p.id === paymentId);
    if (!paid) return;

    setPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, status: "Success", invoiceAvailable: true } : p))
    );

    // Locally check if we can update the status
    setCases((prev) =>
      prev.map((c) =>
        c.id === paid.caseId
          ? {
              ...c,
              paymentStatus: "Paid",
              status: c.status === "Payment Pending" ? "Open" : c.status,
              statusHistory:
                c.status === "Payment Pending"
                  ? [
                      ...c.statusHistory,
                      { status: "Open", date: new Date().toISOString().slice(0, 10), note: "Payment verified, case opened." },
                    ]
                  : c.statusHistory,
            }
          : c
      )
    );
  };

  const value = useMemo<SelfClientContextValue>(
    () => ({
      isAuthenticated: session !== null,
      isCheckingSession,
      profile,
      login,
      signup,
      logout,
      cases,
      documents,
      payments,
      tasks,
      messages,
      notifications,
      addCase,
      markTaskDone,
      markDocumentUploaded,
      sendMessage,
      markNotificationRead,
      markAllNotificationsRead,
      payInvoice,
    }),
    [session, isCheckingSession, profile, cases, documents, payments, tasks, messages, notifications]
  );

  return <SelfClientContext.Provider value={value}>{children}</SelfClientContext.Provider>;
}

export function useSelfClient() {
  const ctx = useContext(SelfClientContext);
  if (!ctx) {
    throw new Error("useSelfClient must be used within a SelfClientProvider");
  }
  return ctx;
}
