import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { analyticsApi } from '../../services/api/analyticsApi';
import {
  SummaryStats,
  CategoryStat,
  StatusStat,
  TimeSeriesStat,
  WardStat,
  REPORT_STATUS,
} from '../../types';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Calendar,
} from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  [REPORT_STATUS.PENDING]: '#f59e0b',
  [REPORT_STATUS.VERIFIED]: '#3b82f6',
  [REPORT_STATUS.IN_PROGRESS]: '#6366f1',
  [REPORT_STATUS.RESOLVED]: '#10b981',
};

const CATEGORY_COLORS = ['#0284c7', '#16a34a', '#9333ea', '#d97706', '#e11d48', '#dc2626', '#64748b'];

export const AdminAnalyticsPage: React.FC = () => {
  const [stats, setStats] = useState<SummaryStats | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryStat[]>([]);
  const [statusData, setStatusData] = useState<StatusStat[]>([]);
  const [timeData, setTimeData] = useState<TimeSeriesStat[]>([]);
  const [wardData, setWardData] = useState<WardStat[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      try {
        const [sum, cats, sts, times, wards] = await Promise.all([
          analyticsApi.getSummary(),
          analyticsApi.getCategoryStats(),
          analyticsApi.getStatusStats(),
          analyticsApi.getTimeSeries(),
          analyticsApi.getWardStats(),
        ]);
        setStats(sum);
        setCategoryData(cats);
        setStatusData(sts);
        setTimeData(times);
        setWardData(wards);
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
          Civic Intelligence & Turnaround Performance
        </span>
        <h1 className="text-2xl font-bold text-slate-900 font-display mt-0.5">
          Municipal SLA & Analytics Dashboard
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Detailed metrics evaluating neighborhood turnaround times, waste segregation composition, and zonal clearing efficiency.
        </p>
      </div>

      {/* 4 Summary Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Overall Resolution Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-emerald-600 font-display tabular-nums">
            {stats ? `${stats.resolutionRate}%` : '85%'}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+4.2% from previous month</span>
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Avg. Clearing Turnaround</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 font-display tabular-nums">
            {stats ? `${stats.averageResolutionDays} Days` : '1.8 Days'}
          </p>
          <div className="text-[11px] text-slate-500">
            Target SLA: &lt; 48 hours for municipal zones
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Daily Intake Velocity</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 font-display tabular-nums">
            11.4 <span className="text-sm font-normal text-slate-400">reports/day</span>
          </p>
          <div className="text-[11px] text-slate-500">
            Peak reporting between 7 AM – 11 AM
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>High-Severity Incidents</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-3xl font-bold text-rose-600 font-display tabular-nums">
            {stats ? stats.criticalIssues : 5}
          </p>
          <div className="text-[11px] text-rose-700 font-medium">
            Priority hazmat protocol initiated
          </div>
        </div>
      </div>

      {/* Main Charts Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Area Chart */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display">
                Weekly Intake vs Clearance Volume
              </h3>
              <p className="text-[11px] text-slate-400">Cumulative intake trend across all wards</p>
            </div>
            <span className="text-xs font-mono font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              SLA Compliant
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '11px',
                    border: 'none',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area
                  type="monotone"
                  dataKey="reported"
                  name="Grievances Logged"
                  stroke="#f59e0b"
                  fillOpacity={1}
                  fill="url(#colorReported)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  name="Sites Cleared"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorResolved)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Distribution */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display">
                Waste Category Breakdown
              </h3>
              <p className="text-[11px] text-slate-400">Total volume by physical waste type</p>
            </div>
            <span className="text-xs font-mono text-slate-400">Distribution %</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 9, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '11px',
                    border: 'none',
                  }}
                />
                <Bar dataKey="count" name="Reports" radius={[4, 4, 0, 0]}>
                  {categoryData.map((_, index) => (
                    <Cell
                      key={`cat-cell-${index}`}
                      fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Pie */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display">
                Current Operational Pipeline
              </h3>
              <p className="text-[11px] text-slate-400">Ticket allocation across triage phases</p>
            </div>
          </div>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  dataKey="count"
                  nameKey="label"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry) => (
                    <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '11px',
                    border: 'none',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Zonal Ward Performance */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display">
                Zonal Ward Triage Heat
              </h3>
              <p className="text-[11px] text-slate-400">Active backlog vs resolved counts per zone</p>
            </div>
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wardData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="ward" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '11px',
                    border: 'none',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="activeCount" name="Active Backlog" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolvedCount" name="Cleared Sites" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
