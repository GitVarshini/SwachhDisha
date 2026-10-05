import React, { useState, useEffect } from 'react';
import { LeafletWasteMap } from '../../components/map/LeafletWasteMap';
import { mapApi } from '../../services/api/mapApi';
import { adminApi } from '../../services/api/adminApi';
import { WasteReport, HotspotArea, REPORT_STATUS } from '../../types';
import { INITIAL_REPORTS, HOTSPOT_AREAS } from '../../data/mockData';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SeverityBadge } from '../../components/ui/SeverityBadge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import {
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  User,
  ExternalLink,
  Flame,
  CheckCheck,
} from 'lucide-react';

export const AdminMapPage: React.FC = () => {
  const [reports, setReports] = useState<WasteReport[]>(INITIAL_REPORTS);
  const [hotspots, setHotspots] = useState<HotspotArea[]>(HOTSPOT_AREAS);
  const [selectedReport, setSelectedReport] = useState<WasteReport | null>(INITIAL_REPORTS[0] || null);

  // Dialog action state
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    action: 'VERIFY' | 'IN_PROGRESS' | 'RESOLVE' | 'REJECT' | null;
    isProcessing: boolean;
  }>({
    isOpen: false,
    action: null,
    isProcessing: false,
  });

  const loadData = async () => {
    try {
      const [repData, hotData] = await Promise.all([
        mapApi.getReports(),
        mapApi.getHotspots(),
      ]);
      setReports(repData);
      setHotspots(hotData);
      if (repData.length > 0 && !selectedReport) {
        setSelectedReport(repData[0]);
      }
    } catch (err) {
      console.error('Failed to load admin map data', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExecuteStatusAction = async () => {
    if (!selectedReport || !dialogState.action) return;

    setDialogState((prev) => ({ ...prev, isProcessing: true }));
    const id = selectedReport.id;

    try {
      let updated: WasteReport;
      switch (dialogState.action) {
        case 'VERIFY':
          updated = await adminApi.verifyReport(id);
          break;
        case 'IN_PROGRESS':
          updated = await adminApi.markInProgress(id);
          break;
        case 'RESOLVE':
          updated = await adminApi.resolveReport(id);
          break;
        case 'REJECT':
          updated = await adminApi.rejectReport(id);
          break;
      }

      setReports((prev) => prev.map((r) => (r.id === id ? updated : r)));
      setSelectedReport(updated);
      setDialogState({ isOpen: false, action: null, isProcessing: false });
    } catch (err) {
      console.error('Failed to update status from map panel', err);
      setDialogState((prev) => ({ ...prev, isProcessing: false }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
          Spatial Command
        </span>
        <h1 className="text-2xl font-bold text-slate-900 font-display mt-0.5">
          Municipal Operations Map & Hotspot Console
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Inspect field reports on the interactive map and review or transition dispatch status in real time.
        </p>
      </div>

      {/* Main Grid: Map (Left 65%) + Side Inspector Panel (Right 35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map Column */}
        <div className="lg:col-span-8">
          <LeafletWasteMap
            reports={reports}
            hotspots={hotspots}
            selectedReportId={selectedReport?.id}
            onSelectReport={(report) => setSelectedReport(report)}
            heightPx={620}
          />
        </div>

        {/* Selected Report Side Panel */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display">
              Inspector Panel
            </h3>
            {selectedReport && (
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                {selectedReport.id}
              </span>
            )}
          </div>

          {selectedReport ? (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <StatusBadge status={selectedReport.status} size="sm" />
                <SeverityBadge severity={selectedReport.severity} size="sm" />
              </div>

              <div>
                <span className="text-slate-400 font-medium">Category</span>
                <p className="text-sm font-semibold text-slate-900 capitalize mt-0.5">
                  {selectedReport.category} Waste Issue
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>Address & Ward</span>
                </span>
                <p className="text-xs font-medium text-slate-800 mt-0.5">{selectedReport.address}</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  {selectedReport.ward}
                </p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Lat: {selectedReport.latitude}, Lng: {selectedReport.longitude}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Description</span>
                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 leading-relaxed mt-1">
                  {selectedReport.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  <span>{selectedReport.isAnonymous ? 'Anonymous' : selectedReport.reporterName}</span>
                </span>
                <span className="font-mono">
                  {new Date(selectedReport.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Quick Status Action Buttons */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <p className="text-[11px] font-semibold text-slate-700">Quick Dispatch Actions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {selectedReport.status === REPORT_STATUS.PENDING && (
                    <button
                      onClick={() => setDialogState({ isOpen: true, action: 'VERIFY', isProcessing: false })}
                      className="px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Verify Issue</span>
                    </button>
                  )}

                  {selectedReport.status === REPORT_STATUS.VERIFIED && (
                    <button
                      onClick={() => setDialogState({ isOpen: true, action: 'IN_PROGRESS', isProcessing: false })}
                      className="px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Dispatch Crew</span>
                    </button>
                  )}

                  {(selectedReport.status === REPORT_STATUS.IN_PROGRESS ||
                    selectedReport.status === REPORT_STATUS.VERIFIED) && (
                    <button
                      onClick={() => setDialogState({ isOpen: true, action: 'RESOLVE', isProcessing: false })}
                      className="px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  )}

                  {selectedReport.status !== REPORT_STATUS.REJECTED &&
                    selectedReport.status !== REPORT_STATUS.RESOLVED && (
                      <button
                        onClick={() => setDialogState({ isOpen: true, action: 'REJECT', isProcessing: false })}
                        className="px-3 py-2 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    )}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">
              Click any pin on the map to inspect report details and trigger municipal dispatch.
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ isOpen: false, action: null, isProcessing: false })}
        onConfirm={handleExecuteStatusAction}
        title={`Confirm Status Action`}
        message={`Confirm updating status of report #${selectedReport?.id} to ${dialogState.action}?`}
        confirmLabel="Update Status"
        confirmVariant={dialogState.action === 'REJECT' ? 'danger' : 'primary'}
        isLoading={dialogState.isProcessing}
      />
    </div>
  );
};
