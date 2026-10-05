export type Role = 'CITIZEN' | 'ADMIN';

export const REPORT_STATUS = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED',
} as const;

export type ReportStatus = typeof REPORT_STATUS[keyof typeof REPORT_STATUS];

export const REPORT_SEVERITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
} as const;

export type ReportSeverity = typeof REPORT_SEVERITY[keyof typeof REPORT_SEVERITY];

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
}

export interface WasteCategory {
  id: string;
  name: string;
  description: string;
  iconName: string;
  color: string;
}

export interface WasteReport {
  id: string;
  category: string;
  severity: ReportSeverity;
  description: string;
  address: string;
  ward: string;
  latitude: number;
  longitude: number;
  photoUrl?: string;
  status: ReportStatus;
  isAnonymous: boolean;
  reporterId?: string;
  reporterName?: string;
  reporterContact?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportUpdate {
  id: string;
  reportId: string;
  status: ReportStatus;
  message: string;
  updatedBy: string;
  createdAt: string;
}

export interface HotspotArea {
  id: string;
  name: string;
  ward: string;
  reportCount: number;
  severity: ReportSeverity;
  commonCategory: string;
  lastReportedAt: string;
  latitude: number;
  longitude: number;
  description: string;
  resolutionRate: number;
}

export interface CreateReportDTO {
  category: string;
  severity: ReportSeverity;
  description: string;
  address: string;
  ward: string;
  latitude: number;
  longitude: number;
  photoUrl?: string;
  isAnonymous: boolean;
  reporterName?: string;
  reporterContact?: string;
}

export interface SummaryStats {
  totalReports: number;
  pendingReports: number;
  verifiedReports: number;
  inProgressReports: number;
  resolvedReports: number;
  rejectedReports: number;
  criticalIssues: number;
  highRiskAreasCount: number;
  resolutionRate: number; // percentage
  averageResolutionDays: number;
}

export interface CategoryStat {
  category: string;
  count: number;
  percentage: number;
}

export interface StatusStat {
  status: ReportStatus;
  label: string;
  count: number;
}

export interface TimeSeriesStat {
  date: string;
  reported: number;
  resolved: number;
}

export interface WardStat {
  ward: string;
  activeCount: number;
  resolvedCount: number;
}
