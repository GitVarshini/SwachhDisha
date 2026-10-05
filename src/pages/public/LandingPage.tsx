import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Camera,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Shield,
  Layers,
  BarChart,
  Eye,
  FileCheck,
} from 'lucide-react';
import { WASTE_CATEGORIES } from '../../utils/constants';
import { analyticsApi } from '../../services/api/analyticsApi';
import { reportApi } from '../../services/api/reportApi';
import { SummaryStats, WasteReport } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SeverityBadge } from '../../components/ui/SeverityBadge';
import { ReportDetailsModal } from '../../components/reports/ReportDetailsModal';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<SummaryStats | null>(null);
  const [recentReports, setRecentReports] = useState<WasteReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<WasteReport | null>(null);

  useEffect(() => {
    analyticsApi.getSummary().then(setStats).catch(console.error);
    reportApi.getAll().then((data) => setRecentReports(data.slice(0, 4))).catch(console.error);
  }, []);

  const howItWorksSteps = [
    {
      step: '01',
      title: 'Spot a Problem',
      desc: 'Notice an overflowing garbage bin, open illegal plastic dump, or dangerous biohazard in your neighborhood.',
      icon: Camera,
    },
    {
      step: '02',
      title: 'Report It',
      desc: 'Pin your GPS location, describe the problem, tag severity, and optionally attach a photo in under 60 seconds.',
      icon: MapPin,
    },
    {
      step: '03',
      title: 'Track Progress',
      desc: 'Receive an instant Tracking ID and follow real-time updates as sanitation inspectors verify and dispatch crews.',
      icon: Clock,
    },
    {
      step: '04',
      title: 'See the Difference',
      desc: 'Get notified upon full clearance and sanitation. Watch your neighborhood hazard status improve on the live map.',
      icon: CheckCircle2,
    },
  ];

  const whyFeatures = [
    {
      title: 'Easy Civic Reporting',
      desc: 'Zero-friction submission flow with automatic GPS coordinate detection and anonymous reporting option.',
      icon: Camera,
    },
    {
      title: 'Location-Based Monitoring',
      desc: 'Interactive OpenStreetMap layers pinpointing hazardous waste clusters, open drains, and priority wards.',
      icon: Layers,
    },
    {
      title: 'Transparent Issue Tracking',
      desc: 'Clear four-stage verification timeline keeping citizens and resident associations informed without red tape.',
      icon: FileCheck,
    },
    {
      title: 'Data-Driven Insights',
      desc: 'Identify recurring municipal hotspots to optimize sweeper routes and prioritize long-term waste infrastructure.',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200 bg-linear-to-b from-emerald-50/50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Civic Waste Monitoring Infrastructure</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 font-display text-balance">
              Make Your City Cleaner,{' '}
              <span className="text-emerald-600 underline decoration-emerald-300 decoration-wavy decoration-2">
                One Report at a Time
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed text-balance">
              Report waste problems, discover local hotspots, and help communities identify areas that need attention. A transparent bridge between active citizens and municipal sanitation crews.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/report"
                className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
              >
                <span>Report a Waste Issue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/map"
                className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Explore Waste Map</span>
              </Link>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 text-left">
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 font-medium">Total Reports</span>
                <p className="text-2xl font-bold text-slate-900 font-display tabular-nums mt-0.5">
                  {stats?.totalReports ?? '124+'}
                </p>
                <span className="text-[11px] text-emerald-600 font-medium">Civic verified</span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 font-medium">Issues Resolved</span>
                <p className="text-2xl font-bold text-emerald-600 font-display tabular-nums mt-0.5">
                  {stats?.resolvedReports ?? '98'}
                </p>
                <span className="text-[11px] text-slate-500 font-medium">
                  {stats ? `${stats.resolutionRate}% resolution rate` : '85% rate'}
                </span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 font-medium">Monitored Hotspots</span>
                <p className="text-2xl font-bold text-rose-600 font-display tabular-nums mt-0.5">
                  {stats?.highRiskAreasCount ?? '6'}
                </p>
                <span className="text-[11px] text-rose-600 font-medium">Active containment</span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 font-medium">Active Reports</span>
                <p className="text-2xl font-bold text-amber-600 font-display tabular-nums mt-0.5">
                  {stats ? stats.pendingReports + stats.verifiedReports + stats.inProgressReports : '26'}
                </p>
                <span className="text-[11px] text-amber-700 font-medium">In triage queue</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              Civic Workflow
            </span>
            <h2 className="text-3xl font-bold text-slate-900 font-display mt-1">
              How SwachhDisha Works
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              A transparent, closed-loop resolution pipeline designed for civic accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {howItWorksSteps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="p-6 bg-slate-50 border border-slate-200 rounded-xl relative group hover:border-emerald-300 transition-colors"
                >
                  <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Step {item.step}
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-emerald-600 my-4 shadow-2xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 font-display mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What You Can Report Section */}
      <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                Classification System
              </span>
              <h2 className="text-3xl font-bold text-slate-900 font-display mt-1">
                What You Can Report
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-xl">
                Every category directs reports to specialized municipal disposal machinery and crews.
              </p>
            </div>
            <Link
              to="/awareness"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 shrink-0"
            >
              <span>View Disposal Guide & FAQs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {WASTE_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="p-5 bg-white border border-slate-200 rounded-xl hover:shadow-xs transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <h3 className="text-base font-semibold text-slate-900 font-display">
                      {cat.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{cat.description}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/report?category=${cat.id}`}
                    className="text-xs font-medium text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
                  >
                    <span>Report this type</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                  <span className="text-[10px] text-slate-400 font-mono uppercase">
                    Code: {cat.id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Citizen Reports Section */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                Live Transparency
              </span>
              <h2 className="text-3xl font-bold text-slate-900 font-display mt-1">
                Recent Civic Reports
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Latest submissions from active citizens across municipal wards.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/my-reports"
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Track My Reports
              </Link>
              <Link
                to="/map"
                className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>View on Map</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentReports.map((report) => (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className="p-5 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl transition-all cursor-pointer hover:shadow-xs group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-slate-700 group-hover:text-emerald-700">
                    {report.id}
                  </span>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={report.status} size="sm" />
                    <SeverityBadge severity={report.severity} size="sm" />
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-slate-900 capitalize mb-1">
                  {report.category} Waste Issue
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                  {report.description}
                </p>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="truncate max-w-[200px] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{report.ward}</span>
                  </span>
                  <span className="font-mono">
                    {new Date(report.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why SwachhDisha */}
      <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              Civic Impact
            </span>
            <h2 className="text-3xl font-bold text-slate-900 font-display mt-1">
              Why Choose SwachhDisha
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Transforming scattered public complaints into structured, geocoded, trackable civic action.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyFeatures.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-6 bg-white border border-slate-200 rounded-xl space-y-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 font-display">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Strong Final CTA Banner */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">
            Ready to Help Clean Your Neighborhood?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Spotting an issue takes 10 seconds. Reporting takes 45 seconds. The resolution benefits your entire locality for years.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/report"
              className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-xs"
            >
              Submit a Waste Report Now
            </Link>
            <Link
              to="/map"
              className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            >
              View Active Hotspots on Map
            </Link>
          </div>
        </div>
      </section>

      {/* Details modal if user clicks on a recent report card */}
      <ReportDetailsModal
        report={selectedReport}
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </div>
  );
};
