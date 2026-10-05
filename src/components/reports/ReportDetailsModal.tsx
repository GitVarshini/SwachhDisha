import React, { useEffect, useState } from 'react';
import { WasteReport, ReportUpdate, REPORT_STATUS } from '../../types';
import { reportApi } from '../../services/api/reportApi';
import { Modal } from '../ui/Modal';
import { StatusBadge } from '../ui/StatusBadge';
import { SeverityBadge } from '../ui/SeverityBadge';
import {
  MapPin,
  Calendar,
  AlertTriangle,
  User,
  Clock,
  CheckCircle,
  CircleDot,
  FileText,
  ShieldCheck,
} from 'lucide-react';

interface ReportDetailsModalProps {
  report: WasteReport | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({
  report,
  isOpen,
  onClose,
}) => {
  const [timeline, setTimeline] = useState<ReportUpdate[]>([]);
  const [loadingTimeline, setLoadingTimeline] = useState(false);

  useEffect(() => {
    if (report && isOpen) {
      setLoadingTimeline(true);
      reportApi
        .getTimeline(report.id)
        .then((updates) => setTimeline(updates))
        .finally(() => setLoadingTimeline(false));
    }
  }, [report, isOpen]);

  if (!report) return null;

  // Visual pipeline stages
  const stages = [
    { key: REPORT_STATUS.PENDING, label: 'Reported' },
    { key: REPORT_STATUS.VERIFIED, label: 'Verified' },
    { key: REPORT_STATUS.IN_PROGRESS, label: 'In Progress' },
    { key: REPORT_STATUS.RESOLVED, label: 'Resolved' },
  ];

  const getStageIndex = (status: string) => {
    switch (status) {
      case REPORT_STATUS.PENDING:
        return 0;
      case REPORT_STATUS.VERIFIED:
        return 1;
      case REPORT_STATUS.IN_PROGRESS:
        return 2;
      case REPORT_STATUS.RESOLVED:
        return 3;
      case REPORT_STATUS.REJECTED:
        return -1;
      default:
        return 0;
    }
  };

  const currentStageIndex = getStageIndex(report.status);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Report Tracking #${report.id}`}
      subtitle={`Submitted on ${new Date(report.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Visual Progress Timeline Pipeline */}
        {report.status === REPORT_STATUS.REJECTED ? (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <div>
              <p className="font-semibold">Report Submission Rejected</p>
              <p className="text-rose-700 mt-0.5">
                This report was reviewed by municipal officers and marked rejected (duplicate submission or non-municipal issue).
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <p className="text-xs font-semibold text-slate-700 mb-4">Resolution Progress</p>
            <div className="relative flex items-center justify-between">
              {/* Connector line */}
              <div className="absolute top-3 left-6 right-6 h-0.5 bg-slate-200 -z-0" />
              <div
                className="absolute top-3 left-6 h-0.5 bg-emerald-600 -z-0 transition-all duration-300"
                style={{
                  width: `${(Math.max(0, currentStageIndex) / (stages.length - 1)) * 88}%`,
                }}
              />

              {stages.map((stage, idx) => {
                const isPassed = currentStageIndex > idx;
                const isCurrent = currentStageIndex === idx;

                return (
                  <div key={stage.key} className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        isPassed
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                          : 'bg-white border-2 border-slate-300 text-slate-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[11px] font-medium mt-1.5 whitespace-nowrap ${
                        isCurrent
                          ? 'text-emerald-700 font-semibold'
                          : isPassed
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Primary Report Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 bg-white border border-slate-200 rounded-lg space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Status & Severity</span>
            <div className="flex items-center gap-2 pt-0.5">
              <StatusBadge status={report.status} />
              <SeverityBadge severity={report.severity} />
            </div>
          </div>

          <div className="p-3.5 bg-white border border-slate-200 rounded-lg space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Waste Category</span>
            <p className="text-xs font-semibold text-slate-900 capitalize pt-0.5">
              {report.category} Waste
            </p>
          </div>

          <div className="p-3.5 bg-white border border-slate-200 rounded-lg space-y-1 sm:col-span-2">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>Location & Ward</span>
            </span>
            <p className="text-xs font-medium text-slate-900">{report.address}</p>
            <p className="text-[11px] text-slate-500 font-mono">
              {report.ward} · Lat: {report.latitude.toFixed(4)}, Lng: {report.longitude.toFixed(4)}
            </p>
          </div>
        </div>

        {/* Description Section */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5">
          <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Problem Description</span>
          </span>
          <p className="text-xs text-slate-600 leading-relaxed">{report.description}</p>
        </div>

        {/* Reporter Info */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">Reported By:</span>
            <span className="font-semibold text-slate-800">
              {report.isAnonymous ? 'Anonymous Citizen' : report.reporterName || 'Citizen'}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Chronological Activity History */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Activity History & Municipal Notes</span>
          </h4>

          {loadingTimeline ? (
            <div className="space-y-2">
              <div className="h-10 bg-slate-100 rounded-md animate-pulse" />
              <div className="h-10 bg-slate-100 rounded-md animate-pulse" />
            </div>
          ) : timeline.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No activity logs recorded yet.</p>
          ) : (
            <div className="relative pl-6 space-y-4 border-l-2 border-slate-200 ml-2">
              {timeline.map((item) => (
                <div key={item.id} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-emerald-600" />
                  <div className="text-xs">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-semibold text-slate-800">{item.status}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(item.createdAt).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-snug">{item.message}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Logged by: {item.updatedBy}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
