import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
} from 'recharts';
import { analyticsApi } from '../../services/api/analyticsApi';
import { adminApi } from '../../services/api/adminApi';
import {
  SummaryStats,
  CategoryStat,
  StatusStat,
  TimeSeriesStat,
  WardStat,
  WasteReport,
  REPORT_STATUS,
} from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SeverityBadge } from '../../components/ui/SeverityBadge';
import { ReportDetailsModal } from '../../components/reports/ReportDetailsModal';
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  TrendingUp,
  MapPin,
  ArrowRight,
  ShieldAlert,
  Flame,
  FileCheck,
} from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  [REPORT_STATUS.PENDING]: '#f59e0b',
  [REPORT_STATUS.VERIFIED]: '#3b82f6',
  [REPORT_STATUS.IN_PROGRESS]: '#6366f1',
  [REPORT_STATUS.RESOLVED]: '#10b981',
};

const CATEGORY_COLORS = ['#0284c7', '#16a34a', '#9333ea', '#d97706', '#e11d48', '#dc2626', '#64748b'];

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<SummaryStats | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryStat[]>([]);
  const [statusData, setStatusData] = useState<StatusStat[]>([]);
  const [timeData, setTimeData] = useState<TimeSeriesStat[]>([]);
  const [wardData, setWardData] = useState<WardStat[]>([]);
  const [priorityReports, setPriorityReports] = useState<WasteReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<WasteReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      try {
        const [sum, cats, sts, times, wards, reports] = await Promise.all([
          analyticsApi.getSummary(),
          analyticsApi.getCategoryStats(),
          analyticsApi.getStatusStats(),
          analyticsApi.getTimeSeries(),
          analyticsApi.getWardStats(),
          adminApi.getReports(),
        ]);

        setStats(sum);
        setCategoryData(cats);
        setStatusData(sts);
        setTimeData(times);
        setWardData(wards);

        // Filter priority issues: Critical or High that are not yet resolved
        const priority = reports.filter(
          (r) =>
            (r.severity === 'CRITICAL' || r.severity === 'HIGH') &&
            r.status !== REPORT_STATUS.RESOLVED &&
            r.status !== REPORT_STATUS.REJECTED
        );
        setPriorityReports(priority);
      } catch (err) {
        console.error('Failed to load admin dashboard metrics', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
            Municipal Sanitation Command
          </span>
          <h1 className="text-2xl font-bold text-slate-900 font-display mt-0.5">
            Operational Overview & Dispatch Metrics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time telemetry across city zones, grievance turnaround SLAs, and priority hazardous alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/reports"
            className="px-3.5 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Manage Reports Queue</span>
          </Link>
          <Link
            to="/admin/map"
            className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 flex items-center gap-1.5 bg-white"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Live Dispatch Map</span>
          </Link>
        </div>
      </div>

      {/* Top 6 KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[11px] text-slate-500 font-medium">Total Received</span>
          <p className="text-2xl font-bold text-slate-900 font-display tabular-nums mt-0.5">
            {stats?.totalReports ?? 0}
          </p>
          <span className="text-[10px] text-slate-400 font-mono">All city wards</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[11px] text-amber-700 font-medium">Pending Review</span>
          <p className="text-2xl font-bold text-amber-600 font-display tabular-nums mt-0.5">
            {stats?.pendingReports ?? 0}
          </p>
          <span className="text-[10px] text-amber-600">Requires inspection</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[11px] text-blue-700 font-medium">Verified Issues</span>
          <p className="text-2xl font-bold text-blue-600 font-display tabular-nums mt-0.5">
            {stats?.verifiedReports ?? 0}
          </p>
          <span className="text-[10px] text-blue-600">Awaiting squad</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[11px] text-indigo-700 font-medium">In Progress</span>
          <p className="text-2xl font-bold text-indigo-600 font-display tabular-nums mt-0.5">
            {stats?.inProgressReports ?? 0}
          </p>
          <span className="text-[10px] text-indigo-600">Truck dispatched</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[11px] text-emerald-700 font-medium">Resolved</span>
          <p className="text-2xl font-bold text-emerald-600 font-display tabular-nums mt-0.5">
            {stats?.resolvedReports ?? 0}
          </p>
          <span className="text-[10px] text-emerald-600 font-medium">
            {stats?.resolutionRate}% rate
          </span>
        </div>

        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl shadow-2xs">
          <span className="text-[11px] text-rose-800 font-medium flex items-center gap-1">
            <Flame className="w-3 h-3 text-rose-600" />
            <span>Critical Alerts</span>
          </span>
          <p className="text-2xl font-bold text-rose-700 font-display tabular-nums mt-0.5">
            {stats?.criticalIssues ?? 0}
          </p>
          <span className="text-[10px] text-rose-600 font-medium">Immediate SLA</span>
        </div>
      </div>

      {/* Recharts Data Visualizations Grid (4 charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Reports Over Time (Line Chart) */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display">
              Weekly Grievance Inflow vs Resolution
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Last 7 Days</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <Line
                  type="monotone"
                  dataKey="reported"
                  name="New Reports"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  name="Clearances"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Reports by Status (Pie / Donut Chart) */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display">
              Queue Breakdown by Status
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Current Distribution</span>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="label"
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
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Reports by Category (Bar Chart) */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display">
              Reports by Waste Category
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Classification</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 35, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis
                  type="category"
                  dataKey="category"
                  tick={{ fontSize: 10, fill: '#334155' }}
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '11px',
                    border: 'none',
                  }}
                />
                <Bar dataKey="count" name="Reports" radius={[0, 4, 4, 0]}>
                  {categoryData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Reports by Area / Ward (Grouped Bar Chart) */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display">
              Ward Activity & Resolution Volume
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Zonal Heat</span>
          </div>
          <div className="h-64 w-full">
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
                <Bar dataKey="activeCount" name="Active / In Queue" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolvedCount" name="Cleared" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Priority Issues Section */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-display">
                Priority & Critical Alerts ({priorityReports.length})
              </h2>
              <p className="text-[11px] text-slate-500">
                Reports marked High or Critical severity that require urgent inspection or biohazard clearance.
              </p>
            </div>
          </div>
          <Link
            to="/admin/reports"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View Full Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {priorityReports.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No active critical issues currently pending. All high-severity incidents resolved!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="px-5 py-3">Report ID</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Location & Ward</th>
                  <th className="px-5 py-3">Severity</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {priorityReports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    onClick={() => setSelectedReport(report)}
                  >
                    <td className="px-5 py-3 font-mono font-bold text-slate-900">
                      {report.id}
                    </td>
                    <td className="px-5 py-3 font-medium capitalize text-slate-800">
                      {report.category}
                    </td>
                    <td className="px-5 py-3 text-slate-600 max-w-xs truncate">
                      {report.address}
                      <span className="block text-[10px] text-slate-400 font-mono">
                        {report.ward.split(' - ')[0]}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <SeverityBadge severity={report.severity} size="sm" />
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={report.status} size="sm" />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReport(report);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors border border-emerald-200"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details modal */}
      <ReportDetailsModal
        report={selectedReport}
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </div>
  );
};
