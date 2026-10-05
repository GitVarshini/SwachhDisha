import { WasteReport, CreateReportDTO, ReportStatus, ReportUpdate } from '../../types';
import { client } from './client';
import { USE_MOCK_API } from './config';
import { mockReportApi } from '../mock/mockReportApi';

/**
 * Report API Service
 * Standard contract for citizen and general waste reports
 */
export const reportApi = {
  async getAll(filters?: {
    status?: ReportStatus;
    category?: string;
    severity?: string;
    ward?: string;
    search?: string;
  }): Promise<WasteReport[]> {
    if (USE_MOCK_API) {
      return mockReportApi.getAll(filters);
    }
    return client.get<WasteReport[]>('/reports', filters);
  },

  async getById(id: string): Promise<WasteReport | null> {
    if (USE_MOCK_API) {
      return mockReportApi.getById(id);
    }
    try {
      return await client.get<WasteReport>(`/reports/${id}`);
    } catch (err: any) {
      if (err.status === 404) return null;
      throw err;
    }
  },

  async getMyReports(userId?: string): Promise<WasteReport[]> {
    if (USE_MOCK_API) {
      return mockReportApi.getMyReports(userId);
    }
    return client.get<WasteReport[]>('/reports/my', { userId });
  },

  async create(data: CreateReportDTO): Promise<WasteReport> {
    if (USE_MOCK_API) {
      return mockReportApi.create(data);
    }
    return client.post<WasteReport>('/reports', data);
  },

  async updateStatus(
    id: string,
    status: ReportStatus,
    message?: string,
    updatedBy?: string
  ): Promise<WasteReport> {
    if (USE_MOCK_API) {
      return mockReportApi.updateStatus(id, status, message, updatedBy);
    }
    return client.patch<WasteReport>(`/reports/${id}/status`, {
      status,
      message,
      updatedBy,
    });
  },

  async getTimeline(reportId: string): Promise<ReportUpdate[]> {
    if (USE_MOCK_API) {
      return mockReportApi.getTimeline(reportId);
    }
    return client.get<ReportUpdate[]>(`/reports/${reportId}/timeline`);
  },
};
