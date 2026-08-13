import { PartnerProvider } from "@/components/partner/PartnerProvider";

export default function PartnerSegmentLayout({ children }: { children: React.ReactNode }) {
  return <PartnerProvider>{children}</PartnerProvider>;
}
