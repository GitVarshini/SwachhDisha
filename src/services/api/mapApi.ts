import { WasteReport, HotspotArea } from '../../types';
import { client } from './client';
import { USE_MOCK_API } from './config';
import { mockMapApi } from '../mock/mockMapApi';

/**
 * Map API Service
 * Fetches spatial waste markers and hotspot zones
 */
export const mapApi = {
  async getReports(filters?: {
    status?: string;
    category?: string;
    severity?: string;
  }): Promise<WasteReport[]> {
    if (USE_MOCK_API) {
      return mockMapApi.getReports(filters);
    }
    return client.get<WasteReport[]>('/map/reports', filters);
  },

  async getHotspots(): Promise<HotspotArea[]> {
    if (USE_MOCK_API) {
      return mockMapApi.getHotspots();
    }
    return client.get<HotspotArea[]>('/map/hotspots');
  },
};
