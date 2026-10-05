import {
  SummaryStats,
  CategoryStat,
  StatusStat,
  TimeSeriesStat,
  WardStat,
} from '../../types';
import { client } from './client';
import { USE_MOCK_API } from './config';
import { mockAnalyticsApi } from '../mock/mockAnalyticsApi';

/**
 * Analytics API Service
 * High level dashboard metrics and distribution breakdowns
 */
export const analyticsApi = {
  async getSummary(): Promise<SummaryStats> {
    if (USE_MOCK_API) {
      return mockAnalyticsApi.getSummary();
    }
    return client.get<SummaryStats>('/analytics/summary');
  },

  async getCategoryStats(): Promise<CategoryStat[]> {
    if (USE_MOCK_API) {
      return mockAnalyticsApi.getCategoryStats();
    }
    return client.get<CategoryStat[]>('/analytics/categories');
  },

  async getStatusStats(): Promise<StatusStat[]> {
    if (USE_MOCK_API) {
      return mockAnalyticsApi.getStatusStats();
    }
    return client.get<StatusStat[]>('/analytics/status');
  },

  async getTimeSeries(): Promise<TimeSeriesStat[]> {
    if (USE_MOCK_API) {
      return mockAnalyticsApi.getTimeSeries();
    }
    return client.get<TimeSeriesStat[]>('/analytics/timeseries');
  },

  async getWardStats(): Promise<WardStat[]> {
    if (USE_MOCK_API) {
      return mockAnalyticsApi.getWardStats();
    }
    return client.get<WardStat[]>('/analytics/wards');
  },
};
