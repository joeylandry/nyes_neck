import { SiteFooter } from "@/components/layout/SiteFooter";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-main min-h-screen">
      {children}
      <SiteFooter />
    </div>
  );
}
