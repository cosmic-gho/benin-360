import { AlertTriangle, Loader2, MapPin } from 'lucide-react';

export function DemoBanner(_props?: { message?: string }) {
  return null;
}

export function VerificationBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string }> = {
    verified: { label: 'Verified', color: 'bg-success-100 text-success-700' },
    pending: { label: 'Pending Review', color: 'bg-warning-100 text-warning-700' },
    rejected: { label: 'Unverified', color: 'bg-error-100 text-error-700' },
    unverified: { label: 'Unverified', color: 'bg-gray-100 text-gray-600' },
  };
  const { label, color } = config[status] || config.unverified;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}

export function LoadingSpinner({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      {message && <p className="mt-3 text-sm text-gray-500">{message}</p>}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-16 h-16 rounded-full bg-error-50 flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-error-500" />
      </div>
      <p className="text-gray-700 font-medium text-center">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}

export function EmptyState({ message, icon }: { message: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-gray-400">
        {icon || <MapPin className="w-8 h-8" />}
      </div>
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
}

export function SectionTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
