import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import TargetCursor from "@/components/TargetCursor";

export const metadata: Metadata = {
  title: "Ingat-In Dashboard",
  description: "Real-time WhatsApp Bot Attendance Monitoring Dashboard",
};

export const viewport = {
  width: "device-width",
  initialScale: 0.9,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="antialiased">
        <TargetCursor spinDuration={2} hideDefaultCursor={true} parallaxOn={true} />
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
