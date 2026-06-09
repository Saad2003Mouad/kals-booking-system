// The /menu route serves the Webflow-exported menu.html from the public directory.
// This restores the original Menu page which was missing from the Next.js app router,
// causing the nav link to silently fall through with no matching page.
import { permanentRedirect } from "next/navigation";

export const metadata = {
  title: "Ice Cream Menu | Boston Legend Ice Cream Truck",
  description: "Explore Boston Legend's premium ice cream menu — from classic cones to specialty flavors, served straight from our truck to your event.",
};

export default function MenuPage() {
  permanentRedirect("/menu.html");
}
