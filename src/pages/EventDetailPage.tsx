import { useState, useEffect } from 'react';
import {
  Calendar, Clock, MapPin, ArrowLeft, Share2, CalendarPlus,
  ExternalLink, CheckCircle2, AlertCircle, Stamp, Navigation
} from 'lucide-react';
import { useRouter } from '@/lib/router';
import { api } from '@/lib/api';
import { store } from '@/lib/dataStore';
import { formatDate, formatTime } from '@/lib/utils';
import { getGoogleCalendarUrl, downloadICalendarFile } from '@/lib/calendar';
import { VerificationBadge } from '@/components/ui';
import type { EventItem, Attraction } from '@/types';

export function EventDetailPage({ slug }: { slug: string }) {
  const { navigate } = useRouter();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [relatedAttraction, setRelatedAttraction] = useState<Attraction | null>(null);
  const [copied, setCopied] = useState(false);
  const [stampClaimed, setStampClaimed] = useState(false);
  const [stampMessage, setStampMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const item = await api.getEvent(slug);
      if (item) {
        setEvent(item);
        if (item.related_attraction_id) {
          const attractions = await api.getAttractions();
          const found = attractions.find((a) => a.id === item.related_attraction_id);
          if (found) setRelatedAttraction(found);
        }
        // Check if already claimed
        const stamps = await api.getPassportStamps();
        if (stamps.some((s) => s.target_id === item.id)) {
          setStampClaimed(true);
        }
      }
    })();
  }, [slug]);

  if (!event) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
        <p className="text-gray-500 mb-6">The requested event listing could not be found or may have been updated.</p>
        <button
          onClick={() => navigate('#events')}
          className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors"
        >
          View All Events
        </button>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out ${event.title} in Benin City on BENIN360`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleClaimStamp = async () => {
    const res = await api.claimPassportStamp({
      visitor_name: 'Visitor',
      stamp_type: 'event',
      target_id: event.id,
      target_name: event.title,
    });
    setStampClaimed(res.success);
    setStampMessage(res.message);
  };


  const googleMapsUrl = event.latitude && event.longitude
    ? `https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((event.venue || '') + ' Benin City')}`;

  return (
    <div className="pt-20 min-h-screen bg-gray-50 animate-fade-in pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Navigation Breadcrumb */}
        <button
          onClick={() => navigate('#events')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-primary-600 mb-6 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Events Hub
        </button>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
          {event.cover_image && (
            <div className="relative h-72 sm:h-96 w-full overflow-hidden">
              <img
                src={event.cover_image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-primary-600 text-white shadow-md">
                  {event.category || 'Coronation Anniversary'}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <VerificationBadge status={event.verification_status} />
              </div>

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h1 className="font-display text-2xl sm:text-4xl font-extrabold leading-tight">
                  {event.title}
                </h1>
              </div>
            </div>
          )}

          <div className="p-6 sm:p-8">
            {/* Quick Details Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-gray-100 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Date</div>
                  <div className="font-semibold text-gray-900 mt-0.5">
                    {formatDate(event.start_date)}
                    {event.end_date && event.end_date !== event.start_date && (
                      <span className="text-gray-500 font-normal"> to {formatDate(event.end_date)}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Time</div>
                  <div className="font-semibold text-gray-900 mt-0.5">
                    {event.start_time || 'TBA'} {event.end_time ? `- ${event.end_time}` : ''}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Venue</div>
                  <div className="font-semibold text-gray-900 mt-0.5">{event.venue || 'Benin City'}</div>
                  {event.address && <div className="text-xs text-gray-500 mt-0.5">{event.address}</div>}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 py-6 border-b border-gray-100">
              <a
                href={getGoogleCalendarUrl(event)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
              >
                <CalendarPlus className="w-4 h-4" />
                Add to Google Calendar
              </a>

              <button
                onClick={() => downloadICalendarFile(event)}
                className="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-gray-500" />
                Download iCal (.ics)
              </button>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
              >
                <Navigation className="w-4 h-4 text-secondary-600" />
                Get Directions
              </a>

              <button
                onClick={handleShare}
                className="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
              >
                <Share2 className="w-4 h-4 text-gray-500" />
                {copied ? 'Link Copied!' : 'Share Event'}
              </button>

              <button
                onClick={handleClaimStamp}
                disabled={stampClaimed}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
                  stampClaimed
                    ? 'bg-secondary-100 text-secondary-800 cursor-default'
                    : 'bg-secondary-600 hover:bg-secondary-700 text-white'
                }`}
              >
                <Stamp className="w-4 h-4" />
                {stampClaimed ? 'Stamp in Passport' : 'Collect Digital Stamp'}
              </button>
            </div>

            {stampMessage && (
              <div className="my-4 p-3 bg-secondary-50 border border-secondary-200 text-secondary-800 rounded-xl text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-secondary-600 shrink-0" />
                <span>{stampMessage}</span>
              </div>
            )}

            {/* Description */}
            <div className="py-6">
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Event Overview</h2>
              <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                {event.description || 'Details will be updated as confirmed by the official organizing committee.'}
              </p>
            </div>

            {/* Related Heritage Attraction */}
            {relatedAttraction && (
              <div className="my-6 p-5 bg-gradient-to-r from-primary-50 to-orange-50 border border-primary-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {relatedAttraction.image_url && (
                    <img
                      src={relatedAttraction.image_url}
                      alt={relatedAttraction.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                  )}
                  <div>
                    <span className="text-xs font-semibold text-primary-700 uppercase tracking-wide">
                      Venue / Related Heritage Site
                    </span>
                    <h3 className="font-bold text-gray-900 text-lg">{relatedAttraction.name}</h3>
                    <p className="text-xs text-gray-600 line-clamp-1">{relatedAttraction.short_desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`#attractions/${relatedAttraction.slug}`)}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold transition-colors shrink-0"
                >
                  View Site Profile
                </button>
              </div>
            )}

            {/* Source & Verification Metadata Box (Data & Trust requirement) */}
            <div className="mt-8 bg-gray-50 border border-gray-200 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-primary-600" />
                Data Source & Verification Integrity
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium text-gray-900">Recorded Source:</span>{' '}
                  {event.source_name || 'Community Heritage Submissions'}
                </div>
                <div>
                  <span className="font-medium text-gray-900">Verification Status:</span>{' '}
                  <span className="capitalize">{event.verification_status}</span>
                </div>
                {event.source_url && (
                  <div className="sm:col-span-2 flex items-center gap-1.5">
                    <span className="font-medium text-gray-900">Reference Link:</span>
                    <a
                      href={event.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline inline-flex items-center gap-1 break-all"
                    >
                      {event.source_url}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
              <p className="mt-4 text-xs text-gray-500 border-t border-gray-200 pt-3">
                Notice: BENIN360 does not claim official affiliation with the Coronation Anniversary Secretariat or Oba's Palace.
                Event timings and venues remain subject to ceremonial palace protocol.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
