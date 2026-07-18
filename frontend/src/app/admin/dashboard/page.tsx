'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Search, AlertTriangle, LogOut } from 'lucide-react';

interface Ticket {
  id: number;
  name: string;
  email: string;
  message: string;
  priority: string;
  category: string;
  suggested_reply: string | null;
  status: string;
  ai_success: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters & Search
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchTickets = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });
      if (search) params.append('search', search);
      if (priority) params.append('priority', priority);
      if (category) params.append('category', category);

      const res = await axios.get(`http://localhost:3001/api/tickets?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTickets(res.data.items);
      setTotal(res.data.total);
      setLoading(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('adminToken');
          router.push('/admin/login');
        }
      }
      console.error(err);
      setLoading(false);
    }
  }, [page, search, priority, category, router]);

  useEffect(() => {
    // eslint-disable-next-line
    fetchTickets();
  }, [fetchTickets]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(`http://localhost:3001/api/tickets/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Optimistic update
      setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-900">Triage Dashboard</h1>
        <button onClick={handleLogout} className="flex items-center text-sm font-medium text-gray-600 hover:text-red-600 transition">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </header>

      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        {/* Filters Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name, email, or message..." 
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <select 
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-700"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            
            <select 
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-700"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Billing">Billing</option>
              <option value="Technical">Technical</option>
              <option value="Sales">Sales</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden text-gray-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-700">Ticket ID</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Customer</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Category</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Priority</th>
                  <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 font-semibold text-gray-700 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No tickets found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  tickets.map(ticket => (
                    <tr key={ticket.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-gray-900">#{ticket.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{ticket.name}</span>
                          <span className="text-gray-500 text-xs">{ticket.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                            {ticket.category}
                          </span>
                          {!ticket.ai_success && (
                            <span title="AI Triage Failed/Timeout" className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Manual Triage
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                          ticket.priority === 'High' ? 'bg-red-100 text-red-700' :
                          ticket.priority === 'Medium' ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5 outline-none font-medium"
                          value={ticket.status}
                          onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-500 whitespace-nowrap">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between text-sm">
            <span className="text-gray-500">
              Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of {total} tickets
            </span>
            <div className="flex gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button 
                disabled={page * 10 >= total}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
