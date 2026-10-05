import { WasteReport, REPORT_STATUS } from '../../types';
import { mockReportApi } from './mockReportApi';

export const mockAdminApi = {
  async getReports(filters?: {
    status?: any;
    category?: string;
    severity?: string;
    ward?: string;
    search?: string;
  }): Promise<WasteReport[]> {
    return mockReportApi.getAll(filters);
  },

  async verifyReport(id: string, note?: string): Promise<WasteReport> {
    return mockReportApi.updateStatus(
      id,
      REPORT_STATUS.VERIFIED,
      note || 'Report officially inspected and verified on-site by Municipal Officer.',
      'Sanitation Supervisor'
    );
  },

  async rejectReport(id: string, reason?: string): Promise<WasteReport> {
    return mockReportApi.updateStatus(
      id,
      REPORT_STATUS.REJECTED,
      reason || 'Report rejected: Duplicate submission or not within municipal sanitation guidelines.',
      'Sanitation Supervisor'
    );
  },

  async markInProgress(id: string, note?: string): Promise<WasteReport> {
    return mockReportApi.updateStatus(
      id,
      REPORT_STATUS.IN_PROGRESS,
      note || 'Clean-up vehicle dispatched. Active field operations underway.',
      'Operations Dispatch Desk'
    );
  },

  async resolveReport(id: string, note?: string): Promise<WasteReport> {
    return mockReportApi.updateStatus(
      id,
      REPORT_STATUS.RESOLVED,
      note || 'Waste cleared, area disinfected, and verified resolved.',
      'Field Cleansing Officer'
    );
  },
};
