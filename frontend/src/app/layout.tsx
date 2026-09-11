import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Aptora — Opportunities That Fit You",
  description:
    "Discover scholarships, government schemes, jobs, and opportunities you're actually eligible for.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FAF9FC] text-[#29252F] antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}