"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Home() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:3001/api/tickets", formData);
      router.push(`/confirmation?ticketId=${response.data.id}`);
    } catch (err) {
      setError("Failed to submit ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>

      <div className="w-full max-w-lg animate-in">
        <div className="glass-panel p-10 rounded-3xl relative z-10 text-center">
          <div className="inline-block p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            How can we help?
          </h1>
          <p className="text-slate-400 mb-8 text-sm">
            Our AI-powered triage system will direct your request immediately.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <div className="floating-label-group">
              <input
                type="text"
                id="name"
                required
                className="glass-input w-full p-4 rounded-xl text-base"
                placeholder=" "
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <label htmlFor="name" className="floating-label">Full Name</label>
            </div>

            <div className="floating-label-group">
              <input
                type="email"
                id="email"
                required
                className="glass-input w-full p-4 rounded-xl text-base"
                placeholder=" "
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <label htmlFor="email" className="floating-label">Email Address</label>
            </div>

            <div className="floating-label-group">
              <textarea
                id="message"
                required
                rows={4}
                className="glass-input w-full p-4 rounded-xl text-base resize-none"
                placeholder=" "
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
              <label htmlFor="message" className="floating-label">Describe your issue in detail...</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium p-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(168,85,247,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                "Submit Request"
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
