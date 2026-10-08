export function formatNGN(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return 'Price on request';
  return `\u20A6${amount.toLocaleString('en-NG')}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-NG', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-NG', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(timeStr: string | null): string {
  if (!timeStr) return '';
  return timeStr;
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Royal Heritage': 'bg-primary-600',
    'Museums': 'bg-secondary-600',
    'Culture': 'bg-accent-500',
    'Food': 'bg-warning-500',
    'Hotels': 'bg-success-600',
    'Events': 'bg-error-500',
    'Shopping': 'bg-primary-500',
    'Services': 'bg-gray-600',
  };
  return colors[category] || 'bg-primary-600';
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'royal-heritage': 'Crown',
    'museums': 'Landmark',
    'culture': 'Palette',
    'food': 'UtensilsCrossed',
    'hotels': 'BedDouble',
    'events': 'Calendar',
    'shopping': 'ShoppingBag',
    'services': 'Briefcase',
  };
  return icons[category] || 'MapPin';
}

export function getVerificationBadge(status: string): { label: string; color: string } {
  switch (status) {
    case 'verified':
      return { label: 'Verified', color: 'bg-success-100 text-success-700' };
    case 'pending':
      return { label: 'Pending Review', color: 'bg-warning-100 text-warning-700' };
    case 'rejected':
      return { label: 'Unverified', color: 'bg-error-100 text-error-700' };
    default:
      return { label: 'Unverified', color: 'bg-gray-100 text-gray-600' };
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
