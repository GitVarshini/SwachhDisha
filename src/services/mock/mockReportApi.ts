import { WasteReport, CreateReportDTO, ReportStatus, ReportUpdate } from '../../types';
import { getStoredReports, saveStoredReports, getStoredUpdates, saveStoredUpdates } from '../../data/mockData';

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockReportApi = {
  async getAll(filters?: {
    status?: ReportStatus;
    category?: string;
    severity?: string;
    ward?: string;
    search?: string;
  }): Promise<WasteReport[]> {
    await delay(200);
    let list = getStoredReports();

    if (filters) {
      if (filters.status) {
        list = list.filter((r) => r.status === filters.status);
      }
      if (filters.category && filters.category !== 'all') {
        list = list.filter((r) => r.category === filters.category);
      }
      if (filters.severity && filters.severity !== 'all') {
        list = list.filter((r) => r.severity === filters.severity);
      }
      if (filters.ward && filters.ward !== 'all') {
        list = list.filter((r) => r.ward === filters.ward);
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        list = list.filter(
          (r) =>
            r.id.toLowerCase().includes(query) ||
            r.description.toLowerCase().includes(query) ||
            r.address.toLowerCase().includes(query) ||
            r.ward.toLowerCase().includes(query)
        );
      }
    }

    return [...list].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getById(id: string): Promise<WasteReport | null> {
    await delay(150);
    const reports = getStoredReports();
    return reports.find((r) => r.id === id) || null;
  },

  async getMyReports(reporterId = 'usr_cit_01'): Promise<WasteReport[]> {
    await delay(200);
    const reports = getStoredReports();
    // Return reports by this reporter, or recent anonymous reports created during current session
    return reports.filter((r) => r.reporterId === reporterId || !r.reporterId);
  },

  async create(data: CreateReportDTO): Promise<WasteReport> {
    await delay(400);
    const currentReports = getStoredReports();
    const nextNumber = 8100 + currentReports.length + 1;
    const now = new Date().toISOString();

    const newReport: WasteReport = {
      id: `REP-2026-${nextNumber}`,
      category: data.category,
      severity: data.severity,
      description: data.description,
      address: data.address,
      ward: data.ward,
      latitude: data.latitude,
      longitude: data.longitude,
      photoUrl: data.photoUrl,
      status: 'PENDING',
      isAnonymous: data.isAnonymous,
      reporterId: data.isAnonymous ? undefined : 'usr_cit_01',
      reporterName: data.isAnonymous ? undefined : (data.reporterName || 'Varshini A.'),
      reporterContact: data.isAnonymous ? undefined : (data.reporterContact || '+91 94401 55667'),
      createdAt: now,
      updatedAt: now,
    };

    const updatedList = [newReport, ...currentReports];
    saveStoredReports(updatedList);

    // Create initial timeline event
    const updates = getStoredUpdates();
    const initialUpdate: ReportUpdate = {
      id: `upd_${newReport.id}_1`,
      reportId: newReport.id,
      status: 'PENDING',
      message: `Issue reported by citizen (${data.isAnonymous ? 'Anonymous' : data.reporterName || 'Citizen'}). Queued for municipal review.`,
      updatedBy: 'Citizen Dispatch Portal',
      createdAt: now,
    };

    updates[newReport.id] = [initialUpdate];
    saveStoredUpdates(updates);

    return newReport;
  },

  async updateStatus(
    id: string,
    status: ReportStatus,
    message?: string,
    updatedBy = 'Sanitation Officer'
  ): Promise<WasteReport> {
    await delay(300);
    const currentReports = getStoredReports();
    const index = currentReports.findIndex((r) => r.id === id);

    if (index === -1) {
      throw new Error(`Report ${id} not found`);
    }

    const now = new Date().toISOString();
    const existing = currentReports[index];
    const updated: WasteReport = {
      ...existing,
      status,
      updatedAt: now,
    };

    currentReports[index] = updated;
    saveStoredReports(currentReports);

    // Append to timeline history
    const allUpdates = getStoredUpdates();
    const reportUpdates = allUpdates[id] || [];
    const newUpdate: ReportUpdate = {
      id: `upd_${id}_${reportUpdates.length + 1}`,
      reportId: id,
      status,
      message: message || `Status officially transitioned to ${status}`,
      updatedBy,
      createdAt: now,
    };

    allUpdates[id] = [...reportUpdates, newUpdate];
    saveStoredUpdates(allUpdates);

    return updated;
  },

  async getTimeline(reportId: string): Promise<ReportUpdate[]> {
    await delay(150);
    const updates = getStoredUpdates();
    return updates[reportId] || [];
  },
};
