import { AdminProvider } from "@/components/admin/AdminProvider";

export default function AdminSegmentLayout({ children }: { children: React.ReactNode }) {
  return <AdminProvider>{children}</AdminProvider>;
}
