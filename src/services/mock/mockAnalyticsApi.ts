import {
  SummaryStats,
  CategoryStat,
  StatusStat,
  TimeSeriesStat,
  WardStat,
  REPORT_STATUS,
} from '../../types';
import { getStoredReports, HOTSPOT_AREAS } from '../../data/mockData';
import { WASTE_CATEGORIES, CITY_WARDS } from '../../utils/constants';

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockAnalyticsApi = {
  async getSummary(): Promise<SummaryStats> {
    await delay(180);
    const reports = getStoredReports();
    const total = reports.length;
    const pending = reports.filter((r) => r.status === REPORT_STATUS.PENDING).length;
    const verified = reports.filter((r) => r.status === REPORT_STATUS.VERIFIED).length;
    const inProgress = reports.filter((r) => r.status === REPORT_STATUS.IN_PROGRESS).length;
    const resolved = reports.filter((r) => r.status === REPORT_STATUS.RESOLVED).length;
    const rejected = reports.filter((r) => r.status === REPORT_STATUS.REJECTED).length;
    const critical = reports.filter((r) => r.severity === 'CRITICAL' && r.status !== REPORT_STATUS.RESOLVED).length;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    return {
      totalReports: total,
      pendingReports: pending,
      verifiedReports: verified,
      inProgressReports: inProgress,
      resolvedReports: resolved,
      rejectedReports: rejected,
      criticalIssues: critical,
      highRiskAreasCount: HOTSPOT_AREAS.filter((h) => h.severity === 'CRITICAL' || h.severity === 'HIGH').length,
      resolutionRate,
      averageResolutionDays: 1.8,
    };
  },

  async getCategoryStats(): Promise<CategoryStat[]> {
    await delay(150);
    const reports = getStoredReports();
    const total = reports.length || 1;

    return WASTE_CATEGORIES.map((cat) => {
      const count = reports.filter((r) => r.category === cat.id).length;
      return {
        category: cat.name,
        count,
        percentage: Math.round((count / total) * 100),
      };
    });
  },

  async getStatusStats(): Promise<StatusStat[]> {
    await delay(150);
    const reports = getStoredReports();

    return [
      {
        status: REPORT_STATUS.PENDING,
        label: 'Pending',
        count: reports.filter((r) => r.status === REPORT_STATUS.PENDING).length,
      },
      {
        status: REPORT_STATUS.VERIFIED,
        label: 'Verified',
        count: reports.filter((r) => r.status === REPORT_STATUS.VERIFIED).length,
      },
      {
        status: REPORT_STATUS.IN_PROGRESS,
        label: 'In Progress',
        count: reports.filter((r) => r.status === REPORT_STATUS.IN_PROGRESS).length,
      },
      {
        status: REPORT_STATUS.RESOLVED,
        label: 'Resolved',
        count: reports.filter((r) => r.status === REPORT_STATUS.RESOLVED).length,
      },
    ];
  },

  async getTimeSeries(): Promise<TimeSeriesStat[]> {
    await delay(150);
    return [
      { date: 'Sep 29', reported: 6, resolved: 4 },
      { date: 'Sep 30', reported: 9, resolved: 7 },
      { date: 'Oct 01', reported: 11, resolved: 8 },
      { date: 'Oct 02', reported: 14, resolved: 10 },
      { date: 'Oct 03', reported: 12, resolved: 11 },
      { date: 'Oct 04', reported: 16, resolved: 13 },
      { date: 'Oct 05', reported: 10, resolved: 9 },
    ];
  },

  async getWardStats(): Promise<WardStat[]> {
    await delay(150);
    const reports = getStoredReports();

    return CITY_WARDS.map((wardName) => {
      const shortWard = wardName.split(' - ')[0];
      const wardReports = reports.filter((r) => r.ward === wardName);
      const active = wardReports.filter((r) => r.status !== REPORT_STATUS.RESOLVED && r.status !== REPORT_STATUS.REJECTED).length;
      const resolved = wardReports.filter((r) => r.status === REPORT_STATUS.RESOLVED).length;

      return {
        ward: shortWard,
        activeCount: active,
        resolvedCount: resolved,
      };
    });
  },
};
