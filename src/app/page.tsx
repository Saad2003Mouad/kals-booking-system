import { permanentRedirect } from "next/navigation";

// Serve the Webflow homepage from public/index.html
export default function HomePage() {
  permanentRedirect("/index.html");
}
