import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Corporate Talent Supply & BPO Staffing Services | Rise Up Consultancy Pune",
  description:
    "End-to-end corporate staffing and B2B manpower supply across Pune, Bengaluru, Hyderabad, Mumbai, and Delhi-NCR. High-volume BPO hiring, back office data operations, 24–48hr SLA, and 90-day replacement guarantee.",
  keywords: [
    "Corporate talent supply Pune",
    "BPO staffing agency Pune",
    "Manpower consultancy Kharadi",
    "Hinjewadi recruitment partner",
    "Viman Nagar BPO staffing",
    "Bulk hiring consultancy Pune",
    "Back office manpower supply",
    "Contract staffing agency",
    "Permanent staffing solutions",
    "RPO service provider India",
  ],
  alternates: {
    canonical: "https://riseupconsultancy.in/services",
  },
  openGraph: {
    title: "Corporate Talent Supply & BPO Staffing Services | Rise Up Consultancy",
    description:
      "Direct company payroll staffing and talent supply across Pune & Pan-India. 24–48hr shortlist turnaround and 90-day free candidate replacement warranty.",
    url: "https://riseupconsultancy.in/services",
    type: "website",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
