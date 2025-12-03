import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import TargetCursor from "@/components/TargetCursor";

export const metadata: Metadata = {
  title: "Ingat-In Dashboard",
  description: "Real-time WhatsApp Bot Attendance Monitoring Dashboard",
  viewport: "width=device-width, initial-scale=0.9, maximum-scale=1.0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased">
        <TargetCursor spinDuration={2} hideDefaultCursor={true} parallaxOn={true} />
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
