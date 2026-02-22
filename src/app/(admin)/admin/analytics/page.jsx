"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import {
    Activity,
    AlertTriangle,
    Calendar,
    Eye,
    Globe,
    Loader2,
    Settings,
    TrendingUp,
    Users
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    XAxis,
    YAxis
} from "recharts";

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notConfigured, setNotConfigured] = useState(false);
  const [days, setDays] = useState('7');

  useEffect(() => {
    fetchAnalyticsData();
  }, [days]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/analytics?days=${days}`);
      // Transform response to match Recharts expectations
      const rawData = response.data;
      
      const chartData = rawData.timeline.dates.map((date, index) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        Sessions: rawData.timeline.sessions[index],
        PageViews: rawData.timeline.pageViews[index],
        ActiveUsers: rawData.timeline.activeUsers[index],
      }));

      setData({
        chartData,
        totals: rawData.timeline.totals,
        topPages: rawData.topPages
      });
    } catch (err) {
      if (err.response?.data?.notConfigured) {
        setNotConfigured(true);
      } else {
        setError(err.response?.data?.error || "Failed to load analytics data.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (notConfigured) {
    return (
      <div className="min-h-screen p-6 bg-gray-50 flex flex-col items-center justify-center text-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border max-w-md w-full">
          <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Not Configured</h2>
          <p className="text-gray-600 mb-6">
            To view live visitor data, you must provide your Google Analytics 4 (GA4) Property ID and Google Service Account JSON.
          </p>
          <Link href="/admin/general-settings">
            <Button className="w-full bg-[#ff6c2f] hover:bg-[#e55a26] text-white">
              <Settings className="w-4 h-4 mr-2" />
              Go to General Settings
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50/50">
      <div className="mx-auto space-y-6">
        
        {/* Header Region */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-[#ff6c2f]" />
              Store Analytics
            </h1>
            <p className="text-gray-500 text-sm mt-1">Live data from Google Analytics 4 via Data API</p>
          </div>
          
          <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg border">
            {[
              { label: "7 Days", value: "7" },
              { label: "14 Days", value: "14" },
              { label: "30 Days", value: "30" }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setDays(option.value)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  days === option.value 
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200" 
                  : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 border border-red-100">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Loading State Skeleton */}
        {loading && !data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            <div className="h-32 bg-gray-200 rounded-2xl"></div>
            <div className="h-32 bg-gray-200 rounded-2xl"></div>
            <div className="h-32 bg-gray-200 rounded-2xl"></div>
            <div className="h-96 md:col-span-2 bg-gray-200 rounded-2xl"></div>
            <div className="h-96 bg-gray-200 rounded-2xl"></div>
          </div>
        )}

        {/* Dashboard Content */}
        {!loading && data && (
          <div className="space-y-6 animate-in fade-in duration-500 delay-100 fill-mode-both">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                  <Activity className="w-24 h-24" />
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Sessions</p>
                <div className="flex items-end gap-3">
                  <h3 className="text-3xl font-bold text-gray-900">{data.totals.sessions.toLocaleString()}</h3>
                </div>
                <div className="mt-4 flex items-center text-sm font-medium text-[#ff6c2f]">
                  <Activity className="w-4 h-4 mr-1.5" />
                  Last {days} days
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                  <Eye className="w-24 h-24" />
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">Page Views</p>
                <div className="flex items-end gap-3">
                  <h3 className="text-3xl font-bold text-gray-900">{data.totals.pageViews.toLocaleString()}</h3>
                </div>
                <div className="mt-4 flex items-center text-sm font-medium text-blue-600">
                  <Eye className="w-4 h-4 mr-1.5" />
                  Last {days} days
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                  <Users className="w-24 h-24" />
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">Active Users</p>
                <div className="flex items-end gap-3">
                  <h3 className="text-3xl font-bold text-gray-900">{data.totals.activeUsers.toLocaleString()}</h3>
                </div>
                <div className="mt-4 flex items-center text-sm font-medium text-green-600">
                  <Users className="w-4 h-4 mr-1.5" />
                  Last {days} days
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Traffic Chart */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  Traffic Overview
                  {loading && <Loader2 className="w-4 h-4 animate-spin text-[#ff6c2f] ml-auto" />}
                </h3>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 12 }} 
                        dx={-10}
                      />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        cursor={{ stroke: '#e2e8f0', strokeWidth: 1, strokeDasharray: '3 3' }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                      <Line 
                        type="monotone" 
                        dataKey="PageViews" 
                        name="Page Views"
                        stroke="#0ea5e9" 
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Sessions" 
                        name="Sessions"
                        stroke="#ff6c2f" 
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Pages */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Viewed Pages</h3>
                
                {data.topPages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                    <Globe className="w-8 h-8 mb-2 opacity-20" />
                    <p className="text-sm">No page data available</p>
                  </div>
                ) : (
                  <div className="space-y-4 flex-1">
                    {data.topPages.map((page, index) => {
                      const maxViews = data.topPages[0].views;
                      const percentage = (page.views / maxViews) * 100;
                      
                      return (
                        <div key={index} className="space-y-1.5">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-gray-700 truncate pr-4 max-w-[200px]" title={page.path}>
                              {page.path === '/' ? '/ (Home)' : page.path}
                            </span>
                            <span className="font-bold text-gray-900">{page.views.toLocaleString()}</span>
                          </div>
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#ff6c2f] rounded-full transition-all duration-1000"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-center text-gray-400">
                  Data reflects the last {days} days of tracking
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
