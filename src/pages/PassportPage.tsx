import { useState, useEffect } from 'react';
import {
  Stamp, Award, CheckCircle2, Trophy, Share2, Printer, Sparkles,
  ArrowLeft, ShieldCheck, MapPin, Calendar, Clock, Crown, Download
} from 'lucide-react';
import { useRouter } from '@/lib/router';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { PassportStamp, PassportBadge, Attraction, EventItem } from '@/types';

const PASSPORT_BADGES: PassportBadge[] = [
  {
    id: 'b-1',
    slug: 'royal-pilgrim',
    title: 'Royal Heritage Pilgrim',
    description: 'Visited the sacred Palace of the Oba of Benin or Holy Aruosa Cathedral.',
    icon: 'Crown',
    requirementCount: 1,
    category: 'royal-heritage'
  },
  {
    id: 'b-2',
    slug: 'bronze-master',
    title: 'Bronze Master Trailblazer',
    description: 'Walked the historic Igun Bronze Casters Guild Street.',
    icon: 'Hammer',
    requirementCount: 1,
    category: 'culture'
  },
  {
    id: 'b-3',
    slug: 'coronation-witness',
    title: 'Coronation Anniversary Witness',
    description: 'Attended an official or verified 10th Coronation Anniversary festival event.',
    icon: 'Sparkles',
    requirementCount: 1,
    category: 'events'
  },
  {
    id: 'b-4',
    slug: 'ancient-earthworks',
    title: 'Ancient Earthworks Explorer',
    description: 'Documented and stood before the historic Benin Moat or Ogiamien Palace.',
    icon: 'Shield',
    requirementCount: 1,
    category: 'royal-heritage'
  },
];

export function PassportPage() {
  const { navigate } = useRouter();
  const [visitorName, setVisitorName] = useState('Cultural Explorer');
  const [stamps, setStamps] = useState<PassportStamp[]>([]);
  const badges = PASSPORT_BADGES;
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    api.getPassportStamps().then(setStamps).catch((err) => console.error('Stamps load error:', err));
    api.getAttractions().then(setAttractions).catch((err) => console.error('Attractions load error:', err));
    api.getEvents().then(setEvents).catch((err) => console.error('Events load error:', err));
  }, []);

  const [selectedTarget, setSelectedTarget] = useState('');
  const [claimMessage, setClaimMessage] = useState<{ text: string; success: boolean } | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTarget) return;

    const [type, id] = selectedTarget.split(':');
    let title = '';

    if (type === 'attraction') {
      const a = attractions.find(item => item.id === id || item.slug === id);
      title = a ? a.name : 'Heritage Site';
    } else {
      const ev = events.find(item => item.id === id || item.slug === id);
      title = ev ? ev.title : 'Anniversary Event';
    }

    try {
      const res = await api.claimPassportStamp({
        visitor_name: visitorName,
        stamp_type: type as 'attraction' | 'event',
        target_id: id,
        target_name: title,
      });

      setClaimMessage({ text: res.message, success: res.success });
      if (res.success) {
        const updated = await api.getPassportStamps();
        setStamps(updated);
      }
    } catch (err: any) {
      console.error('Failed to claim stamp on backend:', err);
      setClaimMessage({ text: 'Unable to claim stamp on server. Please try again.', success: false });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${visitorName}'s Benin360 Digital Passport`,
        text: `I have collected ${stamps.length} digital heritage stamps in Benin City on BENIN360!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const isBadgeUnlocked = (badge: PassportBadge): boolean => {
    if (badge.slug === 'royal-pilgrim') {
      return stamps.some(s => s.target_name.toLowerCase().includes('palace') || s.target_name.toLowerCase().includes('aruosa'));
    }
    if (badge.slug === 'bronze-master') {
      return stamps.some(s => s.target_name.toLowerCase().includes('igun') || s.target_name.toLowerCase().includes('bronze'));
    }
    if (badge.slug === 'coronation-witness') {
      return stamps.some(s => s.stamp_type === 'event' || s.target_name.toLowerCase().includes('coronation'));
    }
    if (badge.slug === 'earthworks-explorer') {
      return stamps.some(s => s.target_name.toLowerCase().includes('moat') || s.target_name.toLowerCase().includes('ogiamien'));
    }
    if (badge.slug === 'edo-epicurean') {
      return stamps.some(s => s.target_name.toLowerCase().includes('food') || s.target_name.toLowerCase().includes('cuisine'));
    }
    return stamps.length >= badge.requirementCount;
  };

  const unlockedCount = badges.filter(isBadgeUnlocked).length;

  return (
    <div className="pt-20 min-h-screen bg-gray-50 animate-fade-in pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => navigate('#/')}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-secondary-100 text-secondary-800 mb-3">
              <Stamp className="w-3.5 h-3.5" />
              Official Digital Passport
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900">
              Benin Visitor Passport
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Collect verified digital stamps as you discover historic monuments, coronation events and guild workshops across Benin.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
            >
              <Share2 className="w-4 h-4 text-gray-500" />
              {copied ? 'Link Copied!' : 'Share Passport'}
            </button>
            <button
              onClick={() => setShowCertificate(true)}
              className="px-4 py-2.5 bg-secondary-600 hover:bg-secondary-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
            >
              <Trophy className="w-4 h-4" />
              View Certificate
            </button>
          </div>
        </div>

        {/* The Digital Passport Card (Physical-feel credential design) */}
        <div className="bg-gradient-to-br from-stone-900 via-primary-950 to-stone-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden border-2 border-amber-600/30 mb-10">
          <div className="absolute top-0 right-0 bottom-0 w-1/2 opacity-10 benin-pattern pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 font-bold shadow-lg">
                <Crown className="w-9 h-9" />
              </div>
              <div>
                <div className="text-[11px] tracking-widest uppercase text-amber-400 font-semibold">
                  BENIN360 HERITAGE CREDENTIAL
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold">
                  Digital Explorer Passport
                </h2>
                <div className="text-xs text-gray-400 mt-1 font-mono">
                  PASSPORT NO: BEN-2026-{Math.abs(stamps.length * 1337 + 420).toString().padStart(6, '0')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 bg-white/5 backdrop-blur px-6 py-3 rounded-2xl border border-white/10">
              <div className="text-center">
                <div className="text-2xl font-extrabold text-amber-400">{stamps.length}</div>
                <div className="text-[10px] uppercase text-gray-400 font-medium">Stamps Claimed</div>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <div className="text-2xl font-extrabold text-emerald-400">{unlockedCount} / {badges.length}</div>
                <div className="text-[10px] uppercase text-gray-400 font-medium">Badges Earned</div>
              </div>
            </div>
          </div>

          {/* Visitor Name & Personalization */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Bearer Name:</span>
              <input
                type="text"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm font-semibold text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="text-xs text-amber-300/80 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verified Digital Stamp Protocol • Duplicate Protected
            </div>
          </div>
        </div>

        {/* Claim a New Stamp Tool */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-10">
          <h3 className="font-display text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-600" />
            Claim a Landmark or Event Stamp
          </h3>
          <p className="text-xs text-gray-500 mb-6">
            In Benin City? Select an attraction you visited or coronation event you attended to stamp your official visitor passport.
          </p>

          <form onSubmit={handleClaim} className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-primary-500"
              required
            >
              <option value="">-- Choose an attraction or event to stamp --</option>
              <optgroup label="Heritage Sites & Museums">
                {attractions.map((a) => (
                  <option key={a.id} value={`attraction:${a.id}`}>
                    {a.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Anniversary & Cultural Events">
                {events.map((e) => (
                  <option key={e.id} value={`event:${e.id}`}>
                    {e.title}
                  </option>
                ))}
              </optgroup>
            </select>

            <button
              type="submit"
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm shrink-0"
            >
              <Stamp className="w-4 h-4" />
              Claim Stamp
            </button>
          </form>

          {claimMessage && (
            <div
              className={`mt-4 p-3.5 rounded-xl text-sm flex items-center gap-2 ${
                claimMessage.success
                  ? 'bg-success-50 border border-success-200 text-success-800'
                  : 'bg-warning-50 border border-warning-200 text-warning-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{claimMessage.text}</span>
            </div>
          )}
        </div>

        {/* Two Columns: Stamps Collection & Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Collected Stamps (Physical Postal Stamp Look) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-display text-xl font-bold text-gray-900 flex items-center gap-2">
              <Stamp className="w-5 h-5 text-primary-600" />
              Your Collected Stamps ({stamps.length})
            </h3>

            {stamps.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-gray-200 text-center text-gray-500 text-sm">
                No stamps collected yet. Visit heritage sites or use the tool above to add your first seal!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stamps.map((s) => (
                  <div
                    key={s.id}
                    className="p-5 bg-white rounded-2xl border-2 border-dashed border-amber-500/40 shadow-sm relative overflow-hidden group hover:border-amber-600 transition-colors"
                  >
                    {/* Stamp Circular Seal Emblem */}
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full border-2 border-amber-600 text-amber-700 flex flex-col items-center justify-center font-bold text-[9px] uppercase tracking-tighter shrink-0 rotate-[-8deg] bg-amber-50">
                        <span>BENIN</span>
                        <span className="text-[11px] leading-tight font-extrabold">360</span>
                        <span>SEAL</span>
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-primary-600">
                          {s.stamp_type} stamp
                        </span>
                        <h4 className="font-bold text-gray-900 text-sm leading-snug mt-0.5">
                          {s.target_name}
                        </h4>
                        <div className="text-[11px] text-gray-400 mt-2 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(s.claimed_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Achievement Badges */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-display text-xl font-bold text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-secondary-600" />
              Heritage Badges ({unlockedCount}/{badges.length})
            </h3>

            <div className="space-y-3">
              {badges.map((b) => {
                const unlocked = isBadgeUnlocked(b);
                return (
                  <div
                    key={b.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                      unlocked
                        ? 'bg-white border-emerald-300 shadow-sm'
                        : 'bg-gray-100/70 border-gray-200 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        unlocked
                          ? 'bg-emerald-100 text-emerald-700 shadow-sm'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      <Trophy className="w-6 h-6" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-bold text-sm ${unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                          {b.title}
                        </h4>
                        {unlocked ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            UNLOCKED
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">
                            LOCKED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{b.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Certificate Modal */}
        {showCertificate && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-10 shadow-2xl relative animate-scale-up max-h-[90vh] overflow-y-auto border-8 border-double border-amber-600">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center mx-auto shadow-md">
                  <Crown className="w-9 h-9" />
                </div>

                <div className="text-xs tracking-widest uppercase font-bold text-amber-700">
                  KINGDOM OF BENIN HERITAGE CITATION
                </div>

                <h2 className="font-display text-3xl font-extrabold text-gray-900">
                  Official Certificate of Heritage Exploration
                </h2>

                <p className="text-sm text-gray-600 max-w-lg mx-auto">
                  This certifies that cultural explorer
                </p>

                <div className="text-2xl font-display font-extrabold text-primary-700 border-b-2 border-primary-300 pb-2 inline-block px-8">
                  {visitorName}
                </div>

                <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                  has officially documented and explored the cultural landmarks, sacred shrines, and heritage traditions of Benin City, acquiring <span className="font-bold text-gray-900">{stamps.length} verified digital passport stamps</span> on the BENIN360 Platform.
                </p>

                <div className="pt-6 grid grid-cols-2 gap-4 text-left border-t border-gray-200 text-xs text-gray-500">
                  <div>
                    <span className="font-semibold text-gray-800">Date Issued:</span> {new Date().toLocaleDateString('en-GB')}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800">Verification Engine:</span> BENIN360 Digital Passport
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800">Coronation Context:</span> 10th Anniversary Observance
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800">Tech Attribution:</span> Patotec Software Solutions
                  </div>
                </div>

                <div className="pt-6 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    Print Certificate
                  </button>
                  <button
                    onClick={() => setShowCertificate(false)}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
