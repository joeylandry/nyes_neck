import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-main min-h-screen">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
