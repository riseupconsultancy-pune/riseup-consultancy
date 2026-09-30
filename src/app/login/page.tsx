import React from "react";
import { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "CRM Portal Login | RiseUp Consultancy",
  description: "Secure authentication portal for RiseUp Consultancy Administrators, Corporate Clients, and HR Recruiters.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function LoginPage() {
  return (
    <main className="min-h-[100dvh] bg-gradient-to-b from-slate-50 via-blue-50/20 to-slate-100 flex flex-col justify-center items-center py-8 sm:py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Atmospheric Ambient Glow Orbs */}
      <div
        className="absolute -top-32 -right-24 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-gradient-to-br from-blue-400/15 via-indigo-300/10 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-28 -left-20 w-72 sm:w-[460px] h-72 sm:h-[460px] bg-gradient-to-tr from-sky-400/10 via-blue-200/10 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Precision Micro Grid Overlay */}
      <div
        className="absolute inset-0 bg-[radial-gradient(#3b82f615_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_60%,transparent_100%)] pointer-events-none opacity-60"
        aria-hidden="true"
      />

      <div className="w-full max-w-md mx-auto relative z-10">
        <LoginForm />
      </div>
    </main>
  );
}