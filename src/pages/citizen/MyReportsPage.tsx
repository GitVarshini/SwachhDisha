import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reportApi } from '../../services/api/reportApi';
import { WasteReport, ReportStatus } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SeverityBadge } from '../../components/ui/SeverityBadge';
import { ReportDetailsModal } from '../../components/reports/ReportDetailsModal';
import { EmptyState } from '../../components/ui/EmptyState';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';
import { WASTE_CATEGORIES, REPORT_STATUS } from '../../utils/constants';
import { Search, Filter, PlusCircle, MapPin, Eye, Calendar, Sparkles } from 'lucide-react';

export const MyReportsPage: React.FC = () => {
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<WasteReport | null>(null);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const data = await reportApi.getMyReports('usr_cit_01');
      setReports(data);
    } catch (err) {
      console.error('Failed to load my reports', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  // Filter logic
  const filteredReports = reports.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        r.id.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q) ||
        r.ward.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Citizen Grievance Ledger
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-0.5">
            My Submitted Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Track real-time municipal inspection, verification, and resolution progress for your neighborhood reports.
          </p>
        </div>

        <Link
          to="/report"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Submit New Issue</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, landmark, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1 text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Statuses</option>
            <option value={REPORT_STATUS.PENDING}>Pending</option>
            <option value={REPORT_STATUS.VERIFIED}>Verified</option>
            <option value={REPORT_STATUS.IN_PROGRESS}>In Progress</option>
            <option value={REPORT_STATUS.RESOLVED}>Resolved</option>
            <option value={REPORT_STATUS.REJECTED}>Rejected</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 capitalize"
          >
            <option value="all">All Categories</option>
            {WASTE_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setCategoryFilter('all');
              }}
              className="text-xs text-rose-600 hover:text-rose-800 font-medium px-2 py-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Reports List / Table */}
      {isLoading ? (
        <TableSkeleton rows={4} />
      ) : filteredReports.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No reports match your filters"
          description={
            reports.length === 0
              ? 'You have not submitted any waste reports yet. Notice an issue in your colony? Lodge a report in under 60 seconds.'
              : 'Try clearing your search terms or status filters to view previous submissions.'
          }
          actionLabel={reports.length === 0 ? 'Report a Waste Issue' : 'Clear Filters'}
          onAction={() => {
            if (reports.length === 0) {
              window.location.href = '/report';
            } else {
              setSearchQuery('');
              setStatusFilter('all');
              setCategoryFilter('all');
            }
          }}
        />
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs divide-y divide-slate-100">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              onClick={() => setSelectedReport(report)}
              className="p-4 sm:p-5 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-900 group-hover:text-emerald-700">
                    {report.id}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs font-semibold text-slate-700 capitalize">
                    {report.category} Waste
                  </span>
                  <SeverityBadge severity={report.severity} size="sm" />
                  <StatusBadge status={report.status} size="sm" />
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {report.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{report.address}</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>
                      {new Date(report.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <Link
                  to={`/map?reportId=${report.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>On Map</span>
                </Link>
                <button
                  type="button"
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Track Status</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details / Tracking Modal */}
      <ReportDetailsModal
        report={selectedReport}
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </div>
  );
};
