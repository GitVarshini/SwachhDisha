import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WasteReport, CreateReportDTO, ReportStatus } from '../types';
import { reportApi } from '../services/api/reportApi';

interface ReportsContextType {
  reports: WasteReport[];
  isLoading: boolean;
  selectedReport: WasteReport | null;
  setSelectedReport: (report: WasteReport | null) => void;
  fetchReports: (filters?: any) => Promise<void>;
  createReport: (data: CreateReportDTO) => Promise<WasteReport>;
  updateReportStatus: (id: string, status: ReportStatus, note?: string) => Promise<WasteReport>;
  getReportById: (id: string) => Promise<WasteReport | null>;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export const ReportsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedReport, setSelectedReport] = useState<WasteReport | null>(null);

  const fetchReports = useCallback(async (filters?: any) => {
    setIsLoading(true);
    try {
      const data = await reportApi.getAll(filters);
      setReports(data);
    } catch (err) {
      console.error('Failed to load reports', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const createReport = async (data: CreateReportDTO): Promise<WasteReport> => {
    setIsLoading(true);
    try {
      const created = await reportApi.create(data);
      setReports((prev) => [created, ...prev]);
      return created;
    } finally {
      setIsLoading(false);
    }
  };

  const updateReportStatus = async (
    id: string,
    status: ReportStatus,
    note?: string
  ): Promise<WasteReport> => {
    const updated = await reportApi.updateStatus(id, status, note);
    setReports((prev) =>
      prev.map((r) => (r.id === id ? updated : r))
    );
    if (selectedReport?.id === id) {
      setSelectedReport(updated);
    }
    return updated;
  };

  const getReportById = async (id: string): Promise<WasteReport | null> => {
    const local = reports.find((r) => r.id === id);
    if (local) return local;
    return reportApi.getById(id);
  };

  return (
    <ReportsContext.Provider
      value={{
        reports,
        isLoading,
        selectedReport,
        setSelectedReport,
        fetchReports,
        createReport,
        updateReportStatus,
        getReportById,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
};
