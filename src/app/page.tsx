import { permanentRedirect } from "next/navigation";

// Serve the Webflow homepage from public/index.html
// Next.js App Router needs a page.tsx to define the "/" route.
// The actual homepage content lives in public/index.html (Webflow export).
export default function HomePage() {
  permanentRedirect("/index.html");
}
