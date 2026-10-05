import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { WasteReport, HotspotArea } from '../../types';
import { SEVERITY_CONFIG, STATUS_CONFIG, WASTE_CATEGORIES } from '../../utils/constants';
import { Eye, EyeOff, Filter, RefreshCw, Flame, Layers } from 'lucide-react';

// Fix Leaflet's default image path lookups to prevent broken image network requests
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '',
  iconUrl: '',
  shadowUrl: '',
});

interface LeafletWasteMapProps {
  reports: WasteReport[];
  hotspots?: HotspotArea[];
  onSelectReport?: (report: WasteReport) => void;
  selectedReportId?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  heightPx?: number;
  showFiltersBar?: boolean;
}

export const LeafletWasteMap: React.FC<LeafletWasteMapProps> = ({
  reports,
  hotspots = [],
  onSelectReport,
  selectedReportId,
  initialCenter = [17.385, 78.4867],
  initialZoom = 13,
  heightPx = 580,
  showFiltersBar = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const reportsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const hotspotsLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // Local filter controls
  const [showReports, setShowReports] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Initialize Map
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    // Clean prior Leaflet instance on this container to prevent "Map container is already initialized"
    if ((container as any)._leaflet_id) {
      delete (container as any)._leaflet_id;
    }

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(container, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: false,
    });

    // Open street map tile layer (completely free, zero API key required, zero watermarks)
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.esri.com/" target="_blank" rel="noopener noreferrer">Esri</a> &middot; Open Municipal Basemap',
      }
    ).addTo(map);

    // Reposition zoom controls to top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    const reportsGroup = L.layerGroup().addTo(map);
    const hotspotsGroup = L.layerGroup().addTo(map);

    reportsLayerGroupRef.current = reportsGroup;
    hotspotsLayerGroupRef.current = hotspotsGroup;
    mapInstanceRef.current = map;

    // Trigger size calculation multiple times to ensure full canvas visibility
    map.invalidateSize();
    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 500);

    // Handle container resizing
    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        map.invalidateSize();
      });
      observer.observe(container);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (observer) observer.disconnect();
      map.remove();
      mapInstanceRef.current = null;
      if (container && (container as any)._leaflet_id) {
        delete (container as any)._leaflet_id;
      }
    };
  }, []);

  // Filter reports
  const filteredReports = reports.filter((r) => {
    if (filterCategory !== 'all' && r.category !== filterCategory) return false;
    if (filterSeverity !== 'all' && r.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    return true;
  });

  // Render Markers & Hotspots
  useEffect(() => {
    if (!mapInstanceRef.current || !reportsLayerGroupRef.current || !hotspotsLayerGroupRef.current)
      return;

    const reportsGroup = reportsLayerGroupRef.current;
    const hotspotsGroup = hotspotsLayerGroupRef.current;

    reportsGroup.clearLayers();
    hotspotsGroup.clearLayers();

    // Render Hotspots if enabled
    if (showHotspots) {
      hotspots.forEach((hotspot) => {
        const isCritical = hotspot.severity === 'CRITICAL';
        const color = isCritical ? '#e11d48' : '#f59e0b';

        // Outer translucent hazard radius
        const circle = L.circle([hotspot.latitude, hotspot.longitude], {
          color: color,
          fillColor: color,
          fillOpacity: 0.15,
          weight: 1.5,
          dashArray: '4, 4',
          radius: isCritical ? 500 : 350,
        });

        // Pulsing hotspot icon
        const hotspotIcon = L.divIcon({
          className: 'custom-map-pin',
          html: `
            <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
              <span style="position: absolute; width: 28px; height: 28px; border-radius: 9999px; background-color: ${color}; opacity: 0.25; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
              <div style="width: 22px; height: 22px; border-radius: 9999px; background-color: ${color}; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); border: 2px solid white;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
                </svg>
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const hotspotMarker = L.marker([hotspot.latitude, hotspot.longitude], {
          icon: hotspotIcon,
        });

        const formattedDate = new Date(hotspot.lastReportedAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });

        const popupContent = `
          <div style="font-family: inherit; font-size: 12px; line-height: 1.4; padding: 2px; max-width: 240px;">
            <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
              <span style="font-weight: 700; color: ${color}; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em;">Hotspot Area · ${hotspot.severity}</span>
            </div>
            <p style="font-weight: 700; font-size: 13px; color: #0f172a; margin: 0 0 4px 0;">${hotspot.name}</p>
            <p style="color: #64748b; font-size: 11px; margin: 0 0 6px 0;">${hotspot.ward}</p>
            <p style="color: #334155; font-size: 11px; margin: 0 0 8px 0;">${hotspot.description}</p>
            <div style="display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 6px; font-size: 10px; color: #64748b;">
              <span>Reports: <strong style="color: #0f172a;">${hotspot.reportCount}</strong></span>
              <span>Last: ${formattedDate}</span>
            </div>
          </div>
        `;

        hotspotMarker.bindPopup(popupContent);
        hotspotsGroup.addLayer(circle);
        hotspotsGroup.addLayer(hotspotMarker);
      });
    }

    // Render Reports if enabled
    if (showReports) {
      filteredReports.forEach((report) => {
        const sevConfig = SEVERITY_CONFIG[report.severity] || SEVERITY_CONFIG.LOW;
        const statusConfig = STATUS_CONFIG[report.status] || STATUS_CONFIG.PENDING;
        const isSelected = selectedReportId === report.id;

        // Custom DivIcon marker
        const markerIcon = L.divIcon({
          className: 'custom-map-pin',
          html: `
            <div style="position: relative; width: 34px; height: 42px; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
              <div style="
                width: 30px; 
                height: 30px; 
                border-radius: 9999px; 
                background-color: ${sevConfig.markerColor}; 
                border: 2.5px solid ${isSelected ? '#0284c7' : 'white'}; 
                box-shadow: ${isSelected ? '0 0 0 3px #38bdf8, 0 6px 12px rgba(0,0,0,0.35)' : '0 3px 6px rgba(0,0,0,0.25)'}; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                color: white;
                font-weight: 700;
                font-size: 11px;
                transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
                transition: transform 0.15s ease;
              ">
                ${report.severity[0]}
              </div>
              <div style="
                width: 0; 
                height: 0; 
                border-left: 5px solid transparent; 
                border-right: 5px solid transparent; 
                border-top: 7px solid ${sevConfig.markerColor};
                margin-top: -1px;
              "></div>
            </div>
          `,
          iconSize: [34, 42],
          iconAnchor: [17, 36],
          popupAnchor: [0, -32],
        });

        const marker = L.marker([report.latitude, report.longitude], {
          icon: markerIcon,
        });

        const formattedDate = new Date(report.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });

        const popupContent = `
          <div style="font-family: inherit; font-size: 12px; line-height: 1.4; padding: 2px; min-width: 220px; max-width: 280px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px;">
              <span style="font-weight: 700; color: #0f172a; font-family: monospace; font-size: 11px;">${report.id}</span>
              <span style="font-size: 10px; font-weight: 600; padding: 1px 6px; border-radius: 4px; background: #f1f5f9; color: #334155;">
                ${statusConfig.label}
              </span>
            </div>
            <div style="margin-bottom: 6px;">
              <span style="text-transform: capitalize; font-weight: 600; color: #0f172a;">${report.category} Waste</span>
              <span style="color: #64748b;"> · </span>
              <span style="font-weight: 600; color: ${sevConfig.markerColor};">${report.severity} Severity</span>
            </div>
            <p style="color: #475569; font-size: 11px; margin: 0 0 6px 0; max-height: 48px; overflow: hidden; text-overflow: ellipsis;">
              ${report.description}
            </p>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px 6px; margin-bottom: 8px; font-size: 10px; color: #64748b;">
              <strong style="color: #334155;">Location:</strong> ${report.address}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #94a3b8;">
              <span>Reported: ${formattedDate}</span>
              <button id="btn-view-${report.id}" style="background-color: #059669; color: white; border: none; border-radius: 4px; padding: 3px 8px; font-size: 10px; font-weight: 600; cursor: pointer;">
                Inspect
              </button>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('click', () => {
          if (onSelectReport) {
            onSelectReport(report);
          }
        });

        marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-view-${report.id}`);
          if (btn && onSelectReport) {
            btn.onclick = () => onSelectReport(report);
          }
        });

        reportsGroup.addLayer(marker);
      });
    }
  }, [
    filteredReports,
    hotspots,
    showReports,
    showHotspots,
    selectedReportId,
    onSelectReport,
  ]);

  // Center on selected report if provided
  useEffect(() => {
    if (selectedReportId && mapInstanceRef.current) {
      const target = reports.find((r) => r.id === selectedReportId);
      if (target) {
        mapInstanceRef.current.setView([target.latitude, target.longitude], 15, {
          animate: true,
        });
      }
    }
  }, [selectedReportId, reports]);

  const resetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(initialCenter, initialZoom, { animate: true });
      mapInstanceRef.current.invalidateSize();
    }
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs">
      {/* Interactive Controls Bar */}
      {showFiltersBar && (
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Map Layer:</span>
            </span>

            {/* Toggle Reports Layer */}
            <button
              onClick={() => setShowReports(!showReports)}
              className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 transition-colors border ${
                showReports
                  ? 'bg-white text-emerald-800 border-emerald-300 shadow-xs'
                  : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}
            >
              {showReports ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>Reports ({filteredReports.length})</span>
            </button>

            {/* Toggle Hotspots Layer */}
            <button
              onClick={() => setShowHotspots(!showHotspots)}
              className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 transition-colors border ${
                showHotspots
                  ? 'bg-white text-rose-800 border-rose-300 shadow-xs'
                  : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Hotspots ({hotspots.length})</span>
            </button>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All Categories</option>
              {WASTE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Severity Filter */}
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="VERIFIED">Verified</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          <button
            onClick={resetView}
            className="px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors flex items-center gap-1 shrink-0"
            title="Reset map view"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset View</span>
          </button>
        </div>
      )}

      {/* Map DOM Canvas with guaranteed CSS and inline dimensions */}
      <div
        ref={mapContainerRef}
        style={{ height: `${heightPx}px`, minHeight: '480px', width: '100%' }}
        className="w-full relative z-10 bg-slate-100"
      />

      {/* Embedded Map Legend */}
      <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-xs p-2.5 rounded-lg border border-slate-200 shadow-md text-xs pointer-events-auto">
        <p className="font-semibold text-slate-800 text-[11px] mb-1.5 flex items-center gap-1">
          <Layers className="w-3 h-3 text-slate-500" />
          <span>Map Legend</span>
        </p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
            <span>Critical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span>High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
            <span>Low</span>
          </div>
        </div>
        <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-slate-500">
          <span className="w-2.5 h-2.5 rounded-full border border-dashed border-rose-500 bg-rose-100" />
          <span>Hotspot Hazard Zone</span>
        </div>
      </div>
    </div>
  );
};
