import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rise Up Consultancy Pune | Staffing & Recruiting Services",
  description:
    "Official website of Rise Up Consultancy Pune. Talent Aligned. Futures Elevated. Pan-India and international staffing solutions specializing in BPO, Voice, Non-Voice, Back Office, and corporate recruitment.",
  keywords: [
    "Rise Up Consultancy Pune",
    "Staffing & Recruiting Services Pune",
    "BPO Recruitment Pune",
    "Non-Technical Hiring",
    "Voice Process Jobs Pune",
    "Chandan Nagar Pune Recruitment Agency",
    "Back Office Operations Staffing",
    "International Staffing Nigeria",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${inter.variable} scroll-smooth`}>
      <body className="antialiased min-h-screen flex flex-col font-sans">{children}</body>
    </html>
  );
}