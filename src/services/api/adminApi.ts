import { WasteReport, ReportStatus } from '../../types';
import { client } from './client';
import { USE_MOCK_API } from './config';
import { mockAdminApi } from '../mock/mockAdminApi';

/**
 * Admin API Service
 * Privileged municipal actions for verification, transitions, and triage
 */
export const adminApi = {
  async getReports(filters?: {
    status?: ReportStatus;
    category?: string;
    severity?: string;
    ward?: string;
    search?: string;
  }): Promise<WasteReport[]> {
    if (USE_MOCK_API) {
      return mockAdminApi.getReports(filters);
    }
    return client.get<WasteReport[]>('/admin/reports', filters);
  },

  async verifyReport(id: string, note?: string): Promise<WasteReport> {
    if (USE_MOCK_API) {
      return mockAdminApi.verifyReport(id, note);
    }
    return client.patch<WasteReport>(`/admin/reports/${id}/verify`, { note });
  },

  async rejectReport(id: string, reason?: string): Promise<WasteReport> {
    if (USE_MOCK_API) {
      return mockAdminApi.rejectReport(id, reason);
    }
    return client.patch<WasteReport>(`/admin/reports/${id}/reject`, { reason });
  },

  async markInProgress(id: string, note?: string): Promise<WasteReport> {
    if (USE_MOCK_API) {
      return mockAdminApi.markInProgress(id, note);
    }
    return client.patch<WasteReport>(`/admin/reports/${id}/in-progress`, { note });
  },

  async resolveReport(id: string, note?: string): Promise<WasteReport> {
    if (USE_MOCK_API) {
      return mockAdminApi.resolveReport(id, note);
    }
    return client.patch<WasteReport>(`/admin/reports/${id}/resolve`, { note });
  },
};
