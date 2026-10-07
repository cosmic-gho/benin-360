import type { EventItem } from '@/types';

export function getGoogleCalendarUrl(event: EventItem): string {
  const title = encodeURIComponent(event.title);
  const details = encodeURIComponent(
    `${event.description || ''}\n\nVenue: ${event.venue || 'Benin City'}\nPlatform: BENIN360 (Connecting the World to Benin)`
  );
  const location = encodeURIComponent(event.address || event.venue || 'Benin City, Edo State, Nigeria');

  // Format dates: YYYYMMDDTHHmmssZ
  const startDateStr = event.start_date.replace(/-/g, '');
  const startDateTime = event.start_time
    ? `${startDateStr}T090000Z` // fallback standard time if formatted
    : `${startDateStr}T090000Z`;

  const endDateStr = (event.end_date || event.start_date).replace(/-/g, '');
  const endDateTime = `${endDateStr}T170000Z`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startDateTime}/${endDateTime}`;
}

export function downloadICalendarFile(event: EventItem): void {
  const startDateStr = event.start_date.replace(/-/g, '');
  const endDateStr = (event.end_date || event.start_date).replace(/-/g, '');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//BENIN360//Digital Visitor Platform//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}@benin360.ng`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART;VALUE=DATE:${startDateStr}`,
    `DTEND;VALUE=DATE:${endDateStr}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${(event.description || '').replace(/\n/g, '\\n')}`,
    `LOCATION:${event.address || event.venue || 'Benin City, Nigeria'}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${event.slug}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
