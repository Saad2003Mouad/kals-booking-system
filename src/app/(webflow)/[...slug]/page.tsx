import fs from "fs";
import path from "path";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string[] } }): Promise<Metadata> {
  const reqPath = params.slug.join("/");
  const filePath = path.join(process.cwd(), "public", `${reqPath}.html`);
  
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const html = fs.readFileSync(filePath, "utf-8");
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i) || 
                    html.match(/<meta[^>]*content="([^"]*)"[^>]*name="description"[^>]*>/i);
  
  return {
    title: titleMatch ? titleMatch[1] : undefined,
    description: descMatch ? descMatch[1] : undefined,
  };
}

export default async function WebflowPage({ params }: { params: { slug: string[] } }) {
  const reqPath = params.slug.join("/");
  const filePath = path.join(process.cwd(), "public", `${reqPath}.html`);
  
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const html = fs.readFileSync(filePath, "utf-8");
  
  // Extract body content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let bodyContent = bodyMatch ? bodyMatch[1] : "";

  // Remove the old Webflow header
  bodyContent = bodyContent.replace(/<header[^>]*class="header"[^>]*>[\s\S]*?<\/header>/i, "");
  // Remove the old Webflow footer
  bodyContent = bodyContent.replace(/<footer[^>]*class="footer"[^>]*>[\s\S]*?<\/footer>/i, "");

  return (
    <div className="page min-h-screen flex flex-col relative" style={{ overflowX: "hidden" }}>
      <SiteHeader />
      <div className="relative w-full z-10 flex flex-col flex-grow max-w-[100vw]">
        <div dangerouslySetInnerHTML={{ __html: bodyContent }} />
      </div>
      <SiteFooter />
    </div>
  );
}
