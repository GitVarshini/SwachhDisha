import React from 'react';
import { ReportSeverity } from '../../types';
import { SEVERITY_CONFIG } from '../../utils/constants';

interface SeverityBadgeProps {
  severity: ReportSeverity;
  size?: 'sm' | 'md';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, size = 'md' }) => {
  const config = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.LOW;
  const isSm = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium border rounded-md uppercase tracking-wider ${
        isSm ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
      } ${config.color}`}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.markerColor }} />
      <span>{config.label}</span>
    </span>
  );
};
