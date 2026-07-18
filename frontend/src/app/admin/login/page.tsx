"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:3001/api/auth/login", {
        username,
        password,
      });
      
      // Store token
      localStorage.setItem("token", response.data.token);
      router.push("/admin/dashboard");
    } catch {
      setError("Invalid credentials. Access denied.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-6 relative overflow-hidden bg-[#0a0a0f]">
      {/* SaaS Dashboard aesthetic blobs */}
      <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-blue-600/20 rounded-full filter blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[10%] right-[20%] w-[400px] h-[400px] bg-indigo-600/20 rounded-full filter blur-[100px] animate-pulse delay-700"></div>

      <div className="w-full max-w-sm animate-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 mb-6 shadow-lg shadow-indigo-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-slate-400 text-sm">Sign in to manage support tickets</p>
        </div>

        <div className="glass-panel p-8 rounded-2xl relative z-10">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <div className="floating-label-group">
              <input
                type="text"
                id="username"
                required
                className="glass-input w-full p-4 rounded-xl text-sm"
                placeholder=" "
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label htmlFor="username" className="floating-label text-sm">Username</label>
            </div>

            <div className="floating-label-group">
              <input
                type="password"
                id="password"
                required
                className="glass-input w-full p-4 rounded-xl text-sm"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="password" className="floating-label text-sm">Password</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium p-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/50 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            &larr; Back to Public Portal
          </Link>
        </div>
      </div>
    </main>
  );
}
