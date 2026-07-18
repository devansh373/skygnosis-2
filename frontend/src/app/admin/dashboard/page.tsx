"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Ticket {
  id: number;
  name: string;
  email: string;
  message: string;
  priority: string;
  category: string;
  suggested_reply: string;
  status: string;
  ai_success: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering state
  const [filterPriority, setFilterPriority] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  
  const router = useRouter();

  const fetchTickets = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      // Build query params
      const params = new URLSearchParams();
      if (filterPriority) params.append("priority", filterPriority);
      if (filterCategory) params.append("category", filterCategory);
      // Default sorting is handled by backend (newest first)

      const response = await axios.get(`http://localhost:3001/api/tickets?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(response.data.items);
    } catch {
      localStorage.removeItem("token");
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  }, [filterPriority, filterCategory, router]);

  useEffect(() => {
    const initFetch = async () => {
      await fetchTickets();
    };
    initFetch();
  }, [fetchTickets]);

  const updateStatus = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:3001/api/tickets/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTickets();
    } catch {
      alert("Failed to update status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/admin/login");
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "medium": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "low": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "open": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "in progress": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "resolved": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex text-slate-200">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-800/50 bg-[#0f172a]/50 backdrop-blur-xl hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3 font-bold text-lg text-white">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </div>
            Skygnosis Admin
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-indigo-500/10 text-indigo-400 rounded-xl font-medium border border-indigo-500/20">
            Tickets
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 rounded-xl font-medium transition-colors">
            Settings
          </a>
        </nav>
        <div className="p-4 border-t border-slate-800/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-slate-800/50 bg-[#0a0a0f]/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-20">
          <h1 className="text-xl font-bold text-white">Ticket Triage Queue</h1>
          <div className="flex items-center gap-6">
            
            {/* Filters */}
            <div className="flex gap-3">
              <select 
                className="bg-[#0f172a] border dark:border-slate-700 text-slate-300 text-sm rounded-lg dark:focus:ring-indigo-500 dark:focus:border-indigo-500 block p-2 outline-none cursor-pointer"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="">All Priorities</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>

              <select 
                className="bg-[#0f172a] border dark:border-slate-700 text-slate-300 text-sm rounded-lg dark:focus:ring-indigo-500 dark:focus:border-indigo-500 block p-2 outline-none cursor-pointer"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Billing">Billing</option>
                <option value="Technical">Technical</option>
                <option value="Sales">Sales</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="h-6 w-px bg-slate-700 hidden sm:block"></div>

            <div className="hidden sm:flex items-center gap-4">
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-medium text-slate-300">Live AI Routing</span>
            </div>
          </div>
        </header>

        <div className="p-8 flex-1 overflow-auto animate-in">
          <div className="glass-panel rounded-2xl border border-slate-800/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#0f172a] text-slate-400 uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-6 py-4">ID / Requester</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Priority</th>
                    <th className="px-6 py-4">AI Suggested Reply</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {loading ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4"><div className="h-4 bg-slate-800 rounded w-24 mb-2"></div><div className="h-3 bg-slate-800 rounded w-32"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-slate-800 rounded w-20"></div></td>
                        <td className="px-6 py-4"><div className="h-6 bg-slate-800 rounded-full w-16"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-slate-800 rounded w-full"></div></td>
                        <td className="px-6 py-4"><div className="h-8 bg-slate-800 rounded-lg w-24"></div></td>
                      </tr>
                    ))
                  ) : tickets.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        No tickets found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    tickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-slate-800/20 transition-colors group">
                        <td className="px-6 py-4 align-top">
                          <div className="font-medium text-white mb-1">#{ticket.id} {ticket.name}</div>
                          <div className="text-xs text-slate-400 mb-2">{ticket.email}</div>
                          <div className="text-xs text-slate-500 line-clamp-2 max-w-xs">{ticket.message}</div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                            {ticket.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getPriorityBadge(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <div className="p-3 bg-[#0f172a] rounded-lg text-xs text-slate-300 border border-indigo-500/20 relative">
                            {ticket.ai_success && (
                              <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-lg shadow-indigo-500/40">
                                AI
                              </div>
                            )}
                            <p className="line-clamp-3">{ticket.suggested_reply || "No suggestion generated."}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <div className="flex flex-col gap-2">
                            <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusBadge(ticket.status)} mb-2 w-max`}>
                              {ticket.status}
                            </span>
                            <select
                              className="bg-[#0f172a] border dark:border-slate-700 text-slate-300 text-xs rounded-lg dark:focus:ring-indigo-500 dark:focus:border-indigo-500 block w-full p-2 hover:bg-slate-800 transition-colors cursor-pointer outline-none"
                              value={ticket.status}
                              onChange={(e) => updateStatus(ticket.id, e.target.value)}
                            >
                              <option value="Open">Set Open</option>
                              <option value="In Progress">Set In Progress</option>
                              <option value="Resolved">Set Resolved</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
