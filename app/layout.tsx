import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { LayoutContent } from "@/components/features/layout-content";

export const metadata: Metadata = {
  title: "Ingat-In Dashboard",
  description: "Real-time WhatsApp Bot Attendance Monitoring Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          <LayoutContent>{children}</LayoutContent>
        </Providers>
      </body>
    </html>
  );
}
