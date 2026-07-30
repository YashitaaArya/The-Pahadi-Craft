import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'gold' | 'blue' | 'green' | 'purple';
}

const colorClasses = {
  gold: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: 'text-amber-600',
    value: 'text-amber-900',
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    value: 'text-blue-900',
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-600',
    value: 'text-green-900',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: 'text-purple-600',
    value: 'text-purple-900',
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  change,
  trend = 'neutral',
  color = 'gold',
}) => {
  const colors = colorClasses[color];
  const changeColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${colors.bg} ${colors.border} border rounded-xl p-6 hover:shadow-lg transition-shadow`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`${colors.icon} p-3 bg-white rounded-lg`}>
          {icon}
        </div>
        {change !== undefined && (
          <div className={`text-sm font-semibold ${changeColor}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {Math.abs(change)}%
          </div>
        )}
      </div>
      <p className="text-gray-600 text-sm mb-2">{label}</p>
      <h3 className={`${colors.value} text-3xl font-bold`}>{value}</h3>
    </motion.div>
  );
};

interface MetricRowProps {
  label: string;
  value: string | number;
  secondary?: string;
  icon?: React.ReactNode;
}

export const MetricRow: React.FC<MetricRowProps> = ({ label, value, secondary, icon }) => {
  return (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        {icon && <div className="text-[#C9A66B]">{icon}</div>}
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          {secondary && <p className="text-xs text-gray-400">{secondary}</p>}
        </div>
      </div>
      <div className="text-lg font-semibold text-[#5A4232]">{value}</div>
    </div>
  );
};
