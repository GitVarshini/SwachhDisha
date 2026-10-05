import { WasteReport, HotspotArea } from '../../types';
import { getStoredReports, HOTSPOT_AREAS } from '../../data/mockData';

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockMapApi = {
  async getReports(filters?: {
    status?: string;
    category?: string;
    severity?: string;
  }): Promise<WasteReport[]> {
    await delay(180);
    let list = getStoredReports();

    if (filters) {
      if (filters.status && filters.status !== 'all') {
        list = list.filter((r) => r.status === filters.status);
      }
      if (filters.category && filters.category !== 'all') {
        list = list.filter((r) => r.category === filters.category);
      }
      if (filters.severity && filters.severity !== 'all') {
        list = list.filter((r) => r.severity === filters.severity);
      }
    }

    return list;
  },

  async getHotspots(): Promise<HotspotArea[]> {
    await delay(150);
    return HOTSPOT_AREAS;
  },
};
