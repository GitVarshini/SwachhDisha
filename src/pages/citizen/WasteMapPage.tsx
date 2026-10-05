import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { LeafletWasteMap } from '../../components/map/LeafletWasteMap';
import { mapApi } from '../../services/api/mapApi';
import { WasteReport, HotspotArea } from '../../types';
import { INITIAL_REPORTS, HOTSPOT_AREAS } from '../../data/mockData';
import { ReportDetailsModal } from '../../components/reports/ReportDetailsModal';
import { PlusCircle, MapPin, Flame, AlertCircle } from 'lucide-react';

export const WasteMapPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('reportId') || undefined;

  // Initialize with initial data immediately so the map renders instantly on mount
  const [reports, setReports] = useState<WasteReport[]>(INITIAL_REPORTS);
  const [hotspots, setHotspots] = useState<HotspotArea[]>(HOTSPOT_AREAS);
  const [selectedReport, setSelectedReport] = useState<WasteReport | null>(null);

  useEffect(() => {
    mapApi
      .getReports()
      .then((repData) => {
        setReports(repData);
        if (highlightId) {
          const match = repData.find((r) => r.id === highlightId);
          if (match) setSelectedReport(match);
        }
      })
      .catch(console.error);

    mapApi.getHotspots().then(setHotspots).catch(console.error);
  }, [highlightId]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Geographic Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-0.5">
            City Waste Map & Hotspot Explorer
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time visualization of reported waste issues, active clearance operations, and persistent hazard hotspots.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/report"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Waste Here</span>
          </Link>
        </div>
      </div>

      {/* Map Component - Rendered immediately with full dimensions */}
      <LeafletWasteMap
        reports={reports}
        hotspots={hotspots}
        selectedReportId={highlightId || selectedReport?.id}
        onSelectReport={(report) => setSelectedReport(report)}
        heightPx={600}
      />

      {/* Bottom Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-start gap-3">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-900">Ward Coordination</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              Coordinates feed directly into zonal sanitation route plans to prevent recurring waste accumulation.
            </p>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-start gap-3">
          <div className="p-2 bg-rose-50 rounded-lg text-rose-600 shrink-0">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-900">Critical Hotspots</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              Zones exceeding 20 monthly complaints undergo specialized biometric CCTV surveillance and increased dumper pickups.
            </p>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-start gap-3">
          <div className="p-2 bg-amber-50 rounded-lg text-amber-600 shrink-0">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-900">Open Public Data</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              All resolved incidents remain archived for community audits and environmental health scorecards.
            </p>
          </div>
        </div>
      </div>

      {/* Report Details Modal */}
      <ReportDetailsModal
        report={selectedReport}
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </div>
  );
};
