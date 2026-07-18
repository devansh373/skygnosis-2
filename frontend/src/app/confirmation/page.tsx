"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const ticketId = searchParams.get("ticketId");
  const router = useRouter();

  return (
    <div className="w-full max-w-md animate-in">
      <div className="glass-panel p-8 rounded-3xl relative z-10 text-center">
        <div className="flex justify-center mb-6 animate-success">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center border-2 border-emerald-500/50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2">Request Received</h1>
        <p className="text-slate-400 text-sm mb-8">
          Thank you for reaching out! Our AI triage system has successfully processed your request.
        </p>

        <div className="bg-[#0f172a]/80 border border-slate-700/50 rounded-2xl p-6 mb-8 relative overflow-hidden">
          {/* Subtle top barcode accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#334155_2px,#334155_4px)] opacity-30"></div>
          
          <div className="flex justify-between items-center border-b border-slate-700/50 pb-4 mb-4">
            <span className="text-slate-400 text-sm">Ticket ID</span>
            <span className="font-mono text-lg font-bold text-emerald-400">#{ticketId || "---"}</span>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-slate-400 text-sm mb-1">Estimated Response Time</span>
            <span className="text-white font-medium">Under 2 hours</span>
          </div>
        </div>

        <button
          onClick={() => router.push("/")}
          className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium p-4 rounded-xl transition-all duration-300 border border-slate-700 hover:border-slate-600"
        >
          Submit Another Request
        </button>

        <div className="mt-6 text-xs text-slate-500">
          Need to speak with an agent urgently? <Link href="/admin/login" className="text-purple-400 hover:text-purple-300 underline">Admin Login</Link>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      
      <Suspense fallback={
        <div className="w-full max-w-md animate-in glass-panel p-8 rounded-3xl flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
      }>
        <ConfirmationContent />
      </Suspense>
    </main>
  );
}
