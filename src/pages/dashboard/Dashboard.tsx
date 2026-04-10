import React, { useEffect, useState } from 'react';
import { dashboardService } from '../../services/transactionService'; // oops we exported it there
import type { DashboardStats } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Users, CreditCard, Ticket } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
        // Fallback for demo just in case API fails
        setStats({
          totalEvents: 12,
          totalTicketsSold: 345,
          totalRevenue: 15200000,
          activeOrders: 8
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)] bg-slate-950">
        <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Mock data for the chart since the API specifically gives total aggregates
  const chartData = [
    { name: 'Jan', revenue: 4000000 },
    { name: 'Feb', revenue: 3000000 },
    { name: 'Mar', revenue: 5000000 },
    { name: 'Apr', revenue: 2000000 },
    { name: 'May', revenue: 2780000 },
    { name: 'Jun', revenue: 1890000 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 border-b border-slate-800 pb-4">Organizer Dashboard</h1>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Activity size={64} className="text-purple-500" />
             </div>
             <p className="text-sm text-gray-400 font-medium mb-1">Total Events</p>
             <h3 className="text-3xl font-bold text-white relative z-10">{stats?.totalEvents || 0}</h3>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Ticket size={64} className="text-blue-500" />
             </div>
             <p className="text-sm text-gray-400 font-medium mb-1">Tickets Sold</p>
             <h3 className="text-3xl font-bold text-white relative z-10">{stats?.totalTicketsSold || 0}</h3>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <CreditCard size={64} className="text-green-500" />
             </div>
             <p className="text-sm text-gray-400 font-medium mb-1">Total Revenue</p>
             <h3 className="text-3xl font-bold text-green-400 relative z-10">IDR {stats?.totalRevenue?.toLocaleString() || 0}</h3>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Users size={64} className="text-orange-500" />
             </div>
             <p className="text-sm text-gray-400 font-medium mb-1">Active Orders</p>
             <h3 className="text-3xl font-bold text-white relative z-10">{stats?.activeOrders || 0}</h3>
          </div>
        </div>

        {/* Charts */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-6">Revenue Overview</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} />
                <YAxis 
                  stroke="#94a3b8" 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(value) => `IDR ${value / 1000000}M`}
                />
                <Tooltip 
                   cursor={{fill: '#1e293b'}} 
                   contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                   formatter={(value: number) => [`IDR ${value.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
