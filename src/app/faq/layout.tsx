import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-wrapper">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
