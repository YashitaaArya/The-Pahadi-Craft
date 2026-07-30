import React from 'react';

interface LoadingSkeletonProps {
  count?: number;
  height?: string;
  width?: string;
  circle?: boolean;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  count = 1,
  height = 'h-12',
  width = 'w-full',
  circle = false,
  className = '',
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`
            ${width} ${height}
            ${circle ? 'rounded-full' : 'rounded-lg'}
            bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200
            animate-shimmer
            background-size-200
          `}
        />
      ))}
    </div>
  );
};

export const TableLoadingSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 4,
}) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
          {Array.from({ length: cols }).map((_, col) => (
            <LoadingSkeleton key={col} width={`w-${20 + col * 5}`} className="flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

export const CardLoadingSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg p-6 space-y-4">
      <LoadingSkeleton height="h-8" width="w-1/3" />
      <LoadingSkeleton count={3} height="h-4" width="w-full" />
      <div className="flex gap-4">
        <LoadingSkeleton height="h-10" width="w-1/3" />
        <LoadingSkeleton height="h-10" width="w-1/3" />
      </div>
    </div>
  );
};

export const DashboardLoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-6 space-y-3">
            <LoadingSkeleton height="h-6" width="w-2/3" />
            <LoadingSkeleton height="h-8" width="w-1/2" />
            <LoadingSkeleton height="h-4" width="w-3/4" />
          </div>
        ))}
      </div>

      {/* Chart area */}
      <div className="bg-white rounded-lg p-6">
        <LoadingSkeleton height="h-6" width="w-1/4" className="mb-4" />
        <LoadingSkeleton height="h-64" width="w-full" />
      </div>

      {/* Table area */}
      <div className="bg-white rounded-lg p-6">
        <LoadingSkeleton height="h-6" width="w-1/4" className="mb-4" />
        <TableLoadingSkeleton rows={5} cols={5} />
      </div>
    </div>
  );
};
