import { SelfClientProvider } from "@/components/self-client/SelfClientProvider";

export default function SelfClientSegmentLayout({ children }: { children: React.ReactNode }) {
  return <SelfClientProvider>{children}</SelfClientProvider>;
}
