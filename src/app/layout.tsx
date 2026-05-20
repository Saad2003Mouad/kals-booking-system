import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Boston Legend Ice Cream",
  description: "Boston's premier luxury ice cream truck booking and dispatch service.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans bg-amber-50">
        <Providers>
          {children}
        </Providers>
        {/* Unified Chat & Nav Injector */}
        <Script src="/bl-widgets.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}