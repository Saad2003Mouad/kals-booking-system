import fs from "fs";
import path from "path";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function HomePage() {
  const filePath = path.join(process.cwd(), "public", "index.html");
  let bodyContent = "";

  if (fs.existsSync(filePath)) {
    const html = fs.readFileSync(filePath, "utf-8");
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    bodyContent = bodyMatch ? bodyMatch[1] : "";

    bodyContent = bodyContent.replace(/<header[^>]*class="header"[^>]*>[\s\S]*?<\/header>/i, "");
    bodyContent = bodyContent.replace(/<footer[^>]*class="footer"[^>]*>[\s\S]*?<\/footer>/i, "");
  }

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
