import { useState, useEffect } from 'react';
import {
  MapPin, Clock, ArrowLeft, Navigation, Stamp, CheckCircle2,
  AlertCircle, ExternalLink, Calendar, Compass, Share2
} from 'lucide-react';
import { useRouter } from '@/lib/router';
import { api } from '@/lib/api';
import { store } from '@/lib/dataStore';
import { VerificationBadge } from '@/components/ui';
import type { Attraction, Experience, EventItem } from '@/types';

export function AttractionDetailPage({ slug }: { slug: string }) {
  const { navigate } = useRouter();
  const [attraction, setAttraction] = useState<Attraction | null>(null);
  const [relatedExperiences, setRelatedExperiences] = useState<Experience[]>([]);
  const [relatedEvents, setRelatedEvents] = useState<EventItem[]>([]);
  const [stampClaimed, setStampClaimed] = useState(false);
  const [stampMessage, setStampMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const item = await api.getAttraction(slug);
      if (item) {
        setAttraction(item);
        setActiveImage(item.image_url);

        // Check related experiences
        const exps = await api.getExperiences();
        setRelatedExperiences(
          exps.filter(e =>
            e.title.toLowerCase().includes(item.name.toLowerCase().split(' ')[0]) ||
            (item.name.toLowerCase().includes('palace') && e.title.toLowerCase().includes('palace')) ||
            (item.name.toLowerCase().includes('igun') && e.title.toLowerCase().includes('bronze'))
          )
        );

        // Check related events
        const events = await api.getEvents();
        setRelatedEvents(events.filter(e => e.related_attraction_id === item.id));

        // Check stamp status
        const stamps = await api.getPassportStamps();
        if (stamps.some(s => s.target_id === item.id)) {
          setStampClaimed(true);
        }
      }
    })();
  }, [slug]);

  if (!attraction) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Heritage Site Not Found</h2>
        <p className="text-gray-500 mb-6">The requested landmark profile could not be found.</p>
        <button
          onClick={() => navigate('#attractions')}
          className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors"
        >
          Explore All Heritage Sites
        </button>
      </div>
    );
  }

  const handleClaimStamp = async () => {
    const res = await api.claimPassportStamp({
      visitor_name: 'Visitor',
      stamp_type: 'attraction',
      target_id: attraction.id,
      target_name: attraction.name,
    });
    setStampClaimed(res.success);
    setStampMessage(res.message);
  };


  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: attraction.name,
        text: `Discover ${attraction.name} in Benin City on BENIN360`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const googleMapsUrl = attraction.latitude && attraction.longitude
    ? `https://www.google.com/maps/search/?api=1&query=${attraction.latitude},${attraction.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(attraction.name + ' Benin City')}`;

  return (
    <div className="pt-20 min-h-screen bg-gray-50 animate-fade-in pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Navigation */}
        <button
          onClick={() => navigate('#attractions')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-primary-600 mb-6 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Heritage Sites
        </button>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
          <div className="relative h-80 sm:h-96 w-full overflow-hidden">
            <img
              src={activeImage || attraction.image_url || 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f'}
              alt={attraction.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-primary-600 text-white shadow-md">
                {attraction.category?.name || 'Heritage Landmark'}
              </span>
            </div>
            <div className="absolute top-4 right-4">
              <VerificationBadge status={attraction.verification_status} />
            </div>

            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h1 className="font-display text-2xl sm:text-4xl font-extrabold leading-tight">
                {attraction.name}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-200 max-w-2xl">
                {attraction.short_desc}
              </p>
            </div>
          </div>

          {/* Photo Gallery Thumbnails */}
          {attraction.gallery && attraction.gallery.length > 1 && (
            <div className="flex gap-2 p-4 bg-gray-100 overflow-x-auto">
              {attraction.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    activeImage === img ? 'border-primary-500 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="p-6 sm:p-8">
            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-3 pb-6 border-b border-gray-100">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
              >
                <Navigation className="w-4 h-4" />
                Get Directions
              </a>

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
                {stampClaimed ? 'Passport Stamp Claimed' : 'Collect Digital Stamp'}
              </button>

              <button
                onClick={() => navigate('#map')}
                className="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-primary-600" />
                View on Benin Map
              </button>

              <button
                onClick={handleShare}
                className="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
              >
                <Share2 className="w-4 h-4 text-gray-500" />
                {copied ? 'Link Copied!' : 'Share'}
              </button>
            </div>

            {stampMessage && (
              <div className="my-4 p-3 bg-secondary-50 border border-secondary-200 text-secondary-800 rounded-xl text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-secondary-600 shrink-0" />
                <span>{stampMessage}</span>
              </div>
            )}

            {/* Practical Visitor Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-gray-900 uppercase tracking-wide">Location & Address</div>
                  <div className="text-sm text-gray-700 mt-1">{attraction.address || 'Benin City, Edo State'}</div>
                  {attraction.latitude && attraction.longitude && (
                    <div className="text-xs text-gray-500 font-mono mt-0.5">
                      Coordinates: {attraction.latitude.toFixed(4)}° N, {attraction.longitude.toFixed(4)}° E
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3">
                <Clock className="w-5 h-5 text-secondary-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-gray-900 uppercase tracking-wide">Hours & Access</div>
                  <div className="text-sm text-gray-700 mt-1">{attraction.opening_hours || 'Open during daylight hours'}</div>
                </div>
              </div>
            </div>

            {/* Detailed History & Heritage */}
            <div className="py-4">
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">History & Significance</h2>
              <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                {attraction.description}
              </p>
            </div>

            {/* Cultural Visitor Tips */}
            {attraction.visitor_tips && (
              <div className="my-6 p-5 bg-amber-50/70 border border-amber-200/80 rounded-2xl">
                <h3 className="font-display text-base font-bold text-amber-900 flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Visitor Etiquette & Tips
                </h3>
                <p className="text-sm text-amber-900/90 leading-relaxed">
                  {attraction.visitor_tips}
                </p>
              </div>
            )}

            {/* Related Experiences */}
            {relatedExperiences.length > 0 && (
              <div className="my-8">
                <h3 className="font-display text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-primary-600" />
                  Bookable Guided Experiences at this Location
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedExperiences.map((exp) => (
                    <div key={exp.id} className="border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow bg-white flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{exp.title}</h4>
                        <p className="text-xs text-gray-600 line-clamp-2 mt-1">{exp.description}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-sm font-extrabold text-primary-600">
                          ₦{exp.price_ngn?.toLocaleString()}
                        </span>
                        <button
                          onClick={() => navigate('#guides')}
                          className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-xs font-semibold hover:bg-primary-100 transition-colors"
                        >
                          Book Experience
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Events */}
            {relatedEvents.length > 0 && (
              <div className="my-8">
                <h3 className="font-display text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary-600" />
                  Coronation & Anniversary Events at this Venue
                </h3>
                <div className="space-y-3">
                  {relatedEvents.map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => navigate(`#events/${evt.slug}`)}
                      className="p-4 bg-orange-50/50 border border-orange-100 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-orange-100/60 transition-colors"
                    >
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{evt.title}</h4>
                        <div className="text-xs text-gray-500 mt-1">{evt.start_date} • {evt.venue}</div>
                      </div>
                      <span className="text-xs font-semibold text-primary-600">View Event &rarr;</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Source & Verification Metadata Box */}
            <div className="mt-8 bg-gray-50 border border-gray-200 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-primary-600" />
                Data Source & Verification
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                <div>
                  <span className="font-medium text-gray-900">Source:</span>{' '}
                  {attraction.source_name || 'National Commission for Museums and Monuments'}
                </div>
                <div>
                  <span className="font-medium text-gray-900">Verification:</span>{' '}
                  <span className="capitalize">{attraction.verification_status}</span>
                </div>
                {attraction.source_url && (
                  <div className="sm:col-span-2 flex items-center gap-1.5">
                    <span className="font-medium text-gray-900">Reference:</span>
                    <a
                      href={attraction.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline inline-flex items-center gap-1 break-all"
                    >
                      {attraction.source_url}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
