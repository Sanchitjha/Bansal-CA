"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import {
  mockCases,
  mockDocuments,
  mockMessages,
  mockNotifications,
  mockPayments,
  mockProfile,
  mockTasks,
  CaseStatus,
  SelfClientCase,
  SelfClientDocument,
  SelfClientMessage,
  SelfClientNotification,
  SelfClientPayment,
  SelfClientProfile,
  SelfClientTask,
} from "@/data/selfClientMock";

const SESSION_KEY = "aa_self_client_session";

interface SelfClientSession {
  name: string;
  email: string;
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
  login: (email: string, name?: string) => void;
  logout: () => void;
  cases: SelfClientCase[];
  documents: SelfClientDocument[];
  payments: SelfClientPayment[];
  tasks: SelfClientTask[];
  messages: SelfClientMessage[];
  notifications: SelfClientNotification[];
  addCase: (input: NewCaseInput) => SelfClientCase;
  markTaskDone: (taskId: string) => void;
  markDocumentUploaded: (documentId: string) => void;
  sendMessage: (caseId: string, text: string) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  payInvoice: (paymentId: string) => void;
}

const SelfClientContext = createContext<SelfClientContextValue | undefined>(undefined);

let caseSequence = 1064;
let messageSequence = 100;
let notificationSequence = 100;

function nextCaseId() {
  caseSequence += 1;
  return `AA-CASE-${caseSequence}`;
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
    const nextSession: SelfClientSession = {
      email,
      name: name || profile.name,
    };
    setSession(nextSession);
    setProfile((prev) => ({ ...prev, email, name: nextSession.name }));
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
  };

  const logout = () => {
    setSession(null);
    window.localStorage.removeItem(SESSION_KEY);
  };

  const addCase: SelfClientContextValue["addCase"] = ({ serviceId, serviceName, amount, notes }) => {
    const today = new Date().toISOString().slice(0, 10);
    const newCase: SelfClientCase = {
      id: nextCaseId(),
      serviceId,
      serviceName,
      status: "New Lead" as CaseStatus,
      priority: "Medium",
      createdDate: today,
      amount,
      paymentStatus: amount > 0 ? "Pending" : "Not Required",
      statusHistory: [
        { status: "New Lead", date: today, note: notes || "Submitted via Self Client Portal." },
      ],
    };
    setCases((prev) => [newCase, ...prev]);
    notificationSequence += 1;
    setNotifications((prev) => [
      {
        id: `NOTIF-${notificationSequence}`,
        type: "status",
        message: `${newCase.id} (${serviceName}) created — new lead received.`,
        date: new Date().toISOString(),
        read: false,
        caseId: newCase.id,
      },
      ...prev,
    ]);
    return newCase;
  };

  const markTaskDone = (taskId: string) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: "Completed" } : task)));
  };

  const markDocumentUploaded = (documentId: string) => {
    const today = new Date().toISOString().slice(0, 10);
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === documentId ? { ...doc, status: "Uploaded", uploadedDate: today } : doc))
    );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
