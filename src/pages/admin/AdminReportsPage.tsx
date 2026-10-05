import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api/adminApi';
import { WasteReport, ReportStatus } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SeverityBadge } from '../../components/ui/SeverityBadge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { ReportDetailsModal } from '../../components/reports/ReportDetailsModal';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { WASTE_CATEGORIES, CITY_WARDS, REPORT_STATUS } from '../../utils/constants';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  CheckCheck,
  MapPin,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [wardFilter, setWardFilter] = useState<string>('all');

  // Modal & Dialog state
  const [selectedReport, setSelectedReport] = useState<WasteReport | null>(null);
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    action: 'VERIFY' | 'REJECT' | 'IN_PROGRESS' | 'RESOLVE' | null;
    report: WasteReport | null;
    isProcessing: boolean;
  }>({
    isOpen: false,
    action: null,
    report: null,
    isProcessing: false,
  });

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getReports();
      setReports(data);
    } catch (err) {
      console.error('Failed to load admin reports', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  // Filter list
  const filteredReports = reports.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
    if (severityFilter !== 'all' && r.severity !== severityFilter) return false;
    if (wardFilter !== 'all' && r.ward !== wardFilter) return false;
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

  // Action Dialog Handler
  const handleOpenDialog = (
    report: WasteReport,
    action: 'VERIFY' | 'REJECT' | 'IN_PROGRESS' | 'RESOLVE',
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation();
    setDialogState({
      isOpen: true,
      action,
      report,
      isProcessing: false,
    });
  };

  const handleExecuteAction = async () => {
    if (!dialogState.report || !dialogState.action) return;

    setDialogState((prev) => ({ ...prev, isProcessing: true }));
    const id = dialogState.report.id;

    try {
      let updated: WasteReport;
      switch (dialogState.action) {
        case 'VERIFY':
          updated = await adminApi.verifyReport(id, 'Officially verified by municipal admin supervisor.');
          break;
        case 'REJECT':
          updated = await adminApi.rejectReport(id, 'Rejected: Invalid submission or duplicate alert.');
          break;
        case 'IN_PROGRESS':
          updated = await adminApi.markInProgress(id, 'Sanitation truck and labor team dispatched on-site.');
          break;
        case 'RESOLVE':
          updated = await adminApi.resolveReport(id, 'Site completely cleared and lime disinfected.');
          break;
      }

      // Update state locally
      setReports((prev) => prev.map((r) => (r.id === id ? updated : r)));
      if (selectedReport?.id === id) {
        setSelectedReport(updated);
      }
      setDialogState({ isOpen: false, action: null, report: null, isProcessing: false });
    } catch (err) {
      console.error('Failed to update status', err);
      setDialogState((prev) => ({ ...prev, isProcessing: false }));
    }
  };

  const getDialogDetails = () => {
    if (!dialogState.action || !dialogState.report) return { title: '', message: '', variant: 'primary' as const, label: '' };

    switch (dialogState.action) {
      case 'VERIFY':
        return {
          title: `Verify Report #${dialogState.report.id}`,
          message: `Are you sure you want to verify this report? It will move into the active municipal dispatch queue.`,
          variant: 'primary' as const,
          label: 'Confirm Verification',
        };
      case 'REJECT':
        return {
          title: `Reject Report #${dialogState.report.id}`,
          message: `Are you sure you want to reject this report? This will mark it as duplicate or non-compliant and close the ticket.`,
          variant: 'danger' as const,
          label: 'Reject Submission',
        };
      case 'IN_PROGRESS':
        return {
          title: `Dispatch Clean-Up #${dialogState.report.id}`,
          message: `Confirm dispatching municipal sanitation vehicles and crews to this location?`,
          variant: 'warning' as const,
          label: 'Mark In Progress',
        };
      case 'RESOLVE':
        return {
          title: `Mark #${dialogState.report.id} as Resolved`,
          message: `Confirm that waste has been completely cleared, site disinfected, and verified by zonal sanitation staff?`,
          variant: 'success' as const,
          label: 'Mark Resolved',
        };
    }
  };

  const dialogDetails = getDialogDetails();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
            Grievance Queue
          </span>
          <h1 className="text-2xl font-bold text-slate-900 font-display mt-0.5">
            Municipal Report Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review, verify, reject, and transition reports from citizens across municipal wards.
          </p>
        </div>

        <button
          onClick={loadReports}
          className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 bg-white border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Advanced Filter Toolbar */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, ward, landmark..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Select Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
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

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            <select
              value={wardFilter}
              onChange={(e) => setWardFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All Wards</option>
              {CITY_WARDS.map((w) => (
                <option key={w} value={w}>
                  {w.split(' - ')[0]}
                </option>
              ))}
            </select>

            {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' || severityFilter !== 'all' || wardFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                  setSeverityFilter('all');
                  setWardFilter('all');
                }}
                className="text-xs text-rose-600 hover:text-rose-800 font-medium px-2 py-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reports Table */}
      {isLoading ? (
        <TableSkeleton rows={6} />
      ) : filteredReports.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No reports match your filters"
          description="Adjust your search criteria or clear status filters to view previous submissions."
          actionLabel="Clear All Filters"
          onAction={() => {
            setSearchQuery('');
            setStatusFilter('all');
            setCategoryFilter('all');
            setSeverityFilter('all');
            setWardFilter('all');
          }}
        />
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Report ID</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Location & Ward</th>
                  <th className="px-5 py-3.5">Severity</th>
                  <th className="px-5 py-3.5">Logged Date</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    onClick={() => setSelectedReport(report)}
                  >
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                      {report.id}
                    </td>
                    <td className="px-5 py-3.5 font-medium capitalize text-slate-800">
                      {report.category}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 max-w-xs">
                      <p className="truncate font-medium text-slate-800">{report.address}</p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {report.ward}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <SeverityBadge severity={report.severity} size="sm" />
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-500">
                      {new Date(report.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={report.status} size="sm" />
                    </td>

                    {/* Admin Actions column */}
                    <td className="px-5 py-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Action 1: View */}
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Action 2: Verify (for Pending) */}
                        {report.status === REPORT_STATUS.PENDING && (
                          <button
                            onClick={(e) => handleOpenDialog(report, 'VERIFY', e)}
                            className="px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
                          >
                            Verify
                          </button>
                        )}

                        {/* Action 3: Mark In Progress (for Verified) */}
                        {report.status === REPORT_STATUS.VERIFIED && (
                          <button
                            onClick={(e) => handleOpenDialog(report, 'IN_PROGRESS', e)}
                            className="px-2 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded border border-indigo-200 transition-colors"
                          >
                            Dispatch Crew
                          </button>
                        )}

                        {/* Action 4: Resolve (for In Progress or Verified) */}
                        {(report.status === REPORT_STATUS.IN_PROGRESS ||
                          report.status === REPORT_STATUS.VERIFIED) && (
                          <button
                            onClick={(e) => handleOpenDialog(report, 'RESOLVE', e)}
                            className="px-2 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors"
                          >
                            Resolve
                          </button>
                        )}

                        {/* Action 5: Reject (for Pending or Verified) */}
                        {(report.status === REPORT_STATUS.PENDING ||
                          report.status === REPORT_STATUS.VERIFIED) && (
                          <button
                            onClick={(e) => handleOpenDialog(report, 'REJECT', e)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                            title="Reject Report"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ isOpen: false, action: null, report: null, isProcessing: false })}
        onConfirm={handleExecuteAction}
        title={dialogDetails.title}
        message={dialogDetails.message}
        confirmLabel={dialogDetails.label}
        confirmVariant={dialogDetails.variant}
        isLoading={dialogState.isProcessing}
      />

      {/* Details modal */}
      <ReportDetailsModal
        report={selectedReport}
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </div>
  );
};
