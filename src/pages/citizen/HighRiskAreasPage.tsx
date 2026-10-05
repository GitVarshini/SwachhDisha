import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mapApi } from '../../services/api/mapApi';
import { HotspotArea } from '../../types';
import { SeverityBadge } from '../../components/ui/SeverityBadge';
import { CardSkeleton } from '../../components/ui/LoadingSkeleton';
import { Flame, MapPin, Calendar, Layers, ShieldAlert, ArrowRight, TrendingUp } from 'lucide-react';

export const HighRiskAreasPage: React.FC = () => {
  const [hotspots, setHotspots] = useState<HotspotArea[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    mapApi
      .getHotspots()
      .then((data) => setHotspots(data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const criticalAndHigh = hotspots.filter(
    (h) => h.severity === 'CRITICAL' || h.severity === 'HIGH'
  );
  const mediumRisk = hotspots.filter((h) => h.severity === 'MEDIUM');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">
            Hazard Heatmap & Vigilance
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-0.5">
            High-Risk Waste Hotspots
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Municipal surveillance zones identified through recurring citizen grievances, hazardous material alerts, and chronic drainage obstruction bottlenecks.
          </p>
        </div>

        <Link
          to="/map"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span>Inspect All on Map</span>
        </Link>
      </div>

      {isLoading ? (
        <CardSkeleton count={6} />
      ) : (
        <div className="space-y-10">
          {/* Section 1: Critical & High Risk */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-rose-200 pb-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <h2 className="text-base font-bold text-slate-900 font-display">
                Critical & High Priority Zones ({criticalAndHigh.length})
              </h2>
              <span className="text-[11px] font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                Daily Squad Inspection Mandated
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {criticalAndHigh.map((area) => (
                <div
                  key={area.id}
                  className="p-5 bg-white border border-rose-100 hover:border-rose-300 rounded-xl shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {area.id}
                      </span>
                      <SeverityBadge severity={area.severity} size="sm" />
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 font-display leading-snug">
                      {area.name}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">{area.description}</p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400">Total Grievances:</span>
                        <p className="font-bold text-slate-900 tabular-nums">
                          {area.reportCount} reports
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400">Primary Waste:</span>
                        <p className="font-semibold text-slate-800 capitalize">
                          {area.commonCategory}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400">Ward:</span>
                        <p className="font-medium text-slate-700 truncate">{area.ward.split(' - ')[0]}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Clearance Rate:</span>
                        <p className="font-semibold text-emerald-600">{area.resolutionRate}%</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400 font-mono">
                        Last alert: {new Date(area.lastReportedAt).toLocaleDateString()}
                      </span>
                      <Link
                        to={`/map?lat=${area.latitude}&lng=${area.longitude}`}
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
                      >
                        <span>View Hotspot</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Medium Risk */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-amber-200 pb-2">
              <Flame className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold text-slate-900 font-display">
                Medium Risk Monitoring Zones ({mediumRisk.length})
              </h2>
              <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Weekly Surveillance Round
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {mediumRisk.map((area) => (
                <div
                  key={area.id}
                  className="p-5 bg-white border border-slate-200 hover:border-amber-300 rounded-xl shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {area.id}
                      </span>
                      <SeverityBadge severity={area.severity} size="sm" />
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 font-display leading-snug">
                      {area.name}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">{area.description}</p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400">Total Grievances:</span>
                        <p className="font-bold text-slate-900 tabular-nums">
                          {area.reportCount} reports
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400">Primary Waste:</span>
                        <p className="font-semibold text-slate-800 capitalize">
                          {area.commonCategory}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400">Ward:</span>
                        <p className="font-medium text-slate-700 truncate">{area.ward.split(' - ')[0]}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Clearance Rate:</span>
                        <p className="font-semibold text-emerald-600">{area.resolutionRate}%</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400 font-mono">
                        Last alert: {new Date(area.lastReportedAt).toLocaleDateString()}
                      </span>
                      <Link
                        to={`/map?lat=${area.latitude}&lng=${area.longitude}`}
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
                      >
                        <span>View Hotspot</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
