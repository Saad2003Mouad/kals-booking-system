import { redirect } from "next/navigation";

// Serve the Webflow homepage from public/index.html
// This avoids a 404 at "/" since Next.js App Router needs a page.tsx
// The actual homepage content is served from /index.html (public folder)
export default function HomePage() {
  redirect("/index.html");
}
