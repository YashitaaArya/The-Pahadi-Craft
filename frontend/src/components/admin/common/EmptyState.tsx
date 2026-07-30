import React from 'react';
import { AlertTriangle, InboxIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  type?: 'empty' | 'error' | 'no-data';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  type = 'empty',
}) => {
  const defaultIcons = {
    empty: <InboxIcon className="w-16 h-16 text-gray-300" />,
    error: <AlertTriangle className="w-16 h-16 text-red-300" />,
    'no-data': <InboxIcon className="w-16 h-16 text-blue-300" />,
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="mb-4">
        {icon || defaultIcons[type]}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-center max-w-sm mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2 bg-[#C9A66B] text-white rounded-lg hover:bg-[#5A4232] transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Something went wrong</h3>
              <p className="text-red-700 text-sm mb-4">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="text-sm font-medium text-red-600 hover:text-red-700"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
