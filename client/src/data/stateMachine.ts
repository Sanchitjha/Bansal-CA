export type BlueprintRequestStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "ASSIGNED"
  | "IN_REVIEW"
  | "MORE_INFO"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "EXCEPTION"
  | "CANCELLED"
  | "CLOSED";

export interface StatusTransitionEvent {
  id: string;
  fromStatus: BlueprintRequestStatus;
  toStatus: BlueprintRequestStatus;
  actor: string;
  actorRole: "SUPER_ADMIN" | "PARTNER" | "PROCESSOR" | "CUSTOMER" | "SYSTEM";
  timestamp: string;
  reason?: string;
  correlationId: string;
  isCustomerVisible: boolean;
}

export interface DualChannelNote {
  id: string;
  author: string;
  authorRole: string;
  channel: "INTERNAL" | "CUSTOMER_VISIBLE";
  content: string;
  timestamp: string;
}

export const ALLOWED_TRANSITIONS: Record<BlueprintRequestStatus, BlueprintRequestStatus[]> = {
  DRAFT: ["SUBMITTED", "CANCELLED"],
  SUBMITTED: ["ASSIGNED", "EXCEPTION", "CANCELLED"],
  ASSIGNED: ["IN_REVIEW", "EXCEPTION", "CANCELLED"],
  IN_REVIEW: ["MORE_INFO", "PROCESSING", "EXCEPTION", "CANCELLED"],
  MORE_INFO: ["IN_REVIEW", "CANCELLED"],
  PROCESSING: ["COMPLETED", "FAILED"],
  COMPLETED: ["CLOSED", "IN_REVIEW"],
  FAILED: ["PROCESSING", "EXCEPTION", "CANCELLED"],
  EXCEPTION: ["ASSIGNED", "CANCELLED"],
  CANCELLED: [],
  CLOSED: ["IN_REVIEW"],
};

export function canTransition(from: BlueprintRequestStatus, to: BlueprintRequestStatus): boolean {
  const allowed = ALLOWED_TRANSITIONS[from];
  return allowed ? allowed.includes(to) : false;
}

export const STATUS_METADATA: Record<
  BlueprintRequestStatus,
  { label: string; color: string; bg: string; description: string }
> = {
  DRAFT: {
    label: "Draft",
    color: "text-slate-600",
    bg: "bg-slate-100 border-slate-200",
    description: "Request being prepared by customer or partner",
  },
  SUBMITTED: {
    label: "Submitted",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    description: "Request received and validated, pending allocation",
  },
  ASSIGNED: {
    label: "Assigned",
    color: "text-indigo-700",
    bg: "bg-indigo-50 border-indigo-200",
    description: "Partner/processor selected by routing engine",
  },
  IN_REVIEW: {
    label: "In Review",
    color: "text-purple-700",
    bg: "bg-purple-50 border-purple-200",
    description: "Operational review underway by assigned expert",
  },
  MORE_INFO: {
    label: "More Info Required",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    description: "Waiting for additional customer documents or clarifications",
  },
  PROCESSING: {
    label: "Processing",
    color: "text-cyan-700",
    bg: "bg-cyan-50 border-cyan-200",
    description: "Compliance filing or legal paperwork being drafted",
  },
  COMPLETED: {
    label: "Completed",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    description: "Business service successfully completed & verified",
  },
  FAILED: {
    label: "Failed",
    color: "text-rose-700",
    bg: "bg-rose-50 border-rose-200",
    description: "Filing rejected by statutory portal; needs reprocessing",
  },
  EXCEPTION: {
    label: "Routing Exception",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    description: "Unroutable request requiring manual administrative intervention",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-slate-500",
    bg: "bg-slate-100 border-slate-200",
    description: "Request stopped by customer or administrator",
  },
  CLOSED: {
    label: "Closed & Archived",
    color: "text-emerald-800",
    bg: "bg-emerald-100 border-emerald-300",
    description: "Final archival state with completed commission settlement",
  },
};
