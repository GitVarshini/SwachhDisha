import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reportApi } from '../../services/api/reportApi';
import { analyticsApi } from '../../services/api/analyticsApi';
import { WasteReport, SummaryStats } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SeverityBadge } from '../../components/ui/SeverityBadge';
import { ReportDetailsModal } from '../../components/reports/ReportDetailsModal';
import { CardSkeleton } from '../../components/ui/LoadingSkeleton';
import {
  PlusCircle,
  MapPin,
  FileCheck,
  Flame,
  Clock,
  CheckCircle2,
  Calendar,
  Eye,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const CitizenDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<SummaryStats | null>(null);
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedReport, setSelectedReport] = useState<WasteReport | null>(null);

  useEffect(() => {
    const loadCitizenData = async () => {
      setIsLoading(true);
      try {
        const [sum, userReports] = await Promise.all([
          analyticsApi.getSummary(),
          reportApi.getMyReports(),
        ]);
        setStats(sum);
        setReports(userReports);
      } catch (err) {
        console.error('Failed to load citizen dashboard', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCitizenData();
  }, []);

  const pendingCount = reports.filter((r) => r.status === 'PENDING').length;
  const verifiedCount = reports.filter((r) => r.status === 'VERIFIED').length;
  const resolvedCount = reports.filter((r) => r.status === 'RESOLVED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Citizen Grievance Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-0.5">
            Citizen Action Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Monitor neighborhood clearance status, check ongoing reports, and review active municipal responses.
          </p>
        </div>

        <Link
          to="/report"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Waste Issue</span>
        </Link>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Total Submitted</span>
          <p className="text-2xl font-bold text-slate-900 font-display tabular-nums mt-0.5">
            {reports.length}
          </p>
          <span className="text-[11px] text-slate-400">Personal contributions</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-xs text-amber-700 font-medium">Pending Review</span>
          <p className="text-2xl font-bold text-amber-600 font-display tabular-nums mt-0.5">
            {pendingCount}
          </p>
          <span className="text-[11px] text-amber-700">Awaiting municipal inspector</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-xs text-blue-700 font-medium">Verified by Staff</span>
          <p className="text-2xl font-bold text-blue-600 font-display tabular-nums mt-0.5">
            {verifiedCount}
          </p>
          <span className="text-[11px] text-blue-700">Scheduled for pickup</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-xs text-emerald-700 font-medium">Successfully Resolved</span>
          <p className="text-2xl font-bold text-emerald-600 font-display tabular-nums mt-0.5">
            {resolvedCount}
          </p>
          <span className="text-[11px] text-emerald-700">Verified sanitized</span>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/report"
            className="p-4 bg-white border border-slate-200 hover:border-emerald-300 rounded-xl transition-colors shadow-2xs flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-900 group-hover:text-emerald-700">
                  Report Waste
                </h4>
                <p className="text-[11px] text-slate-500">Log open piles or leaks</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            to="/map"
            className="p-4 bg-white border border-slate-200 hover:border-emerald-300 rounded-xl transition-colors shadow-2xs flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-900 group-hover:text-blue-700">
                  View Map
                </h4>
                <p className="text-[11px] text-slate-500">OpenStreetMap pins</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            to="/my-reports"
            className="p-4 bg-white border border-slate-200 hover:border-emerald-300 rounded-xl transition-colors shadow-2xs flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-900 group-hover:text-indigo-700">
                  My Reports
                </h4>
                <p className="text-[11px] text-slate-500">Live progress tracking</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            to="/high-risk"
            className="p-4 bg-white border border-slate-200 hover:border-rose-300 rounded-xl transition-colors shadow-2xs flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-900 group-hover:text-rose-700">
                  High-Risk Areas
                </h4>
                <p className="text-[11px] text-slate-500">Hazard hotspots</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>
      </div>

      {/* Recent Reports Table/Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display">
            Recent Submissions
          </h3>
          <Link
            to="/my-reports"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            View all my reports
          </Link>
        </div>

        {isLoading ? (
          <CardSkeleton count={3} />
        ) : reports.length === 0 ? (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-xl text-xs text-slate-500">
            No reports logged yet. Spot a waste problem? Submit your first report now!
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs divide-y divide-slate-100">
            {reports.slice(0, 5).map((report) => (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className="p-4 sm:p-5 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-900 group-hover:text-emerald-700">
                      {report.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 capitalize">
                      {report.category} Waste
                    </span>
                    <SeverityBadge severity={report.severity} size="sm" />
                    <StatusBadge status={report.status} size="sm" />
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1">{report.description}</p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{report.address}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    type="button"
                    className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors border border-emerald-200 flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            ))}
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
