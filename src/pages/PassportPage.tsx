import { useState, useEffect } from 'react';
import {
  Stamp, Award, CheckCircle2, Trophy, Share2, Printer, Sparkles,
  ArrowLeft, ShieldCheck, MapPin, Calendar, Clock, Crown, BookOpen,
  Camera, Upload, FileText, Check, QrCode, RefreshCw, User
} from 'lucide-react';
import { useRouter } from '@/lib/router';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { ImageUpload } from '@/components/ImageUpload';
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

// Helper to determine ink stamp style and rotation dynamically
function getStampStyle(index: number) {
  const colors = [
    { text: 'text-red-700', border: 'border-red-700', bg: 'bg-red-50/60', tag: 'ink-stamp-red' },
    { text: 'text-blue-800', border: 'border-blue-800', bg: 'bg-blue-50/60', tag: 'ink-stamp-blue' },
    { text: 'text-purple-800', border: 'border-purple-800', bg: 'bg-purple-50/60', tag: 'ink-stamp-purple' },
    { text: 'text-emerald-800', border: 'border-emerald-800', bg: 'bg-emerald-50/60', tag: 'ink-stamp-green' },
  ];
  const rotations = ['rotate-[-6deg]', 'rotate-[4deg]', 'rotate-[-10deg]', 'rotate-[8deg]', 'rotate-[-3deg]'];
  const shapes = ['rounded-2xl', 'rounded-full', 'rounded-3xl', 'rounded-xl'];

  return {
    color: colors[index % colors.length],
    rotation: rotations[index % rotations.length],
    shape: shapes[index % shapes.length],
  };
}

export function PassportPage() {
  const { navigate } = useRouter();
  const [visitorName, setVisitorName] = useState('John Explorer');
  const [bearerPhoto, setBearerPhoto] = useState<string>('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80');
  const [nationality, setNationality] = useState('NIGERIA / DIASPORA');
  const [stamps, setStamps] = useState<PassportStamp[]>([]);
  const badges = PASSPORT_BADGES;
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);

  // Visual View Mode: 'booklet' (inside identity + visa pages) | 'cover' (leather cover) | 'badges' | 'certificate'
  const [viewMode, setViewMode] = useState<'booklet' | 'cover' | 'badges'>('booklet');

  useEffect(() => {
    api.getPassportStamps().then(setStamps).catch((err) => console.error('Stamps load error:', err));
    api.getAttractions().then(setAttractions).catch((err) => console.error('Attractions load error:', err));
    api.getEvents().then(setEvents).catch((err) => console.error('Events load error:', err));
  }, []);

  const [selectedTarget, setSelectedTarget] = useState('');
  const [claimMessage, setClaimMessage] = useState<{ text: string; success: boolean } | null>(null);
  const [latestStampedId, setLatestStampedId] = useState<string | null>(null);
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
        setLatestStampedId(id);
        const updated = await api.getPassportStamps();
        setStamps(updated);
        setViewMode('booklet');
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
        text: `I have collected ${stamps.length} verified digital heritage stamps in Benin City on BENIN360!`,
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
    return stamps.length >= badge.requirementCount;
  };

  const unlockedCount = badges.filter(isBadgeUnlocked).length;
  const passportNumber = `BN-2026-${Math.abs(stamps.length * 1337 + 42089).toString().padStart(6, '0')}`;

  // Formatted MRZ string (ICAO Standard Machine Readable Zone)
  const cleanNameMRZ = visitorName.toUpperCase().replace(/[^A-Z]/g, '<').slice(0, 18);
  const mrzLine1 = `P<NGADEBO<<${cleanNameMRZ}${'<'.repeat(Math.max(0, 26 - cleanNameMRZ.length))}`;
  const mrzLine2 = `${passportNumber.replace(/[^A-Z0-9]/g, '')}3NGA9410145M3110078<<<<<<<<<<<<<<04`;

  return (
    <div className="pt-20 min-h-screen bg-stone-900 text-stone-100 animate-fade-in pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => navigate('#/')}
          className="flex items-center gap-1.5 text-sm font-medium text-stone-400 hover:text-amber-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Platform
        </button>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-stone-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-3">
              <Stamp className="w-3.5 h-3.5" />
              Official Biometric Heritage Credential
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              Benin Explorer Digital Passport
            </h1>
            <p className="mt-2 text-sm text-stone-400 max-w-2xl">
              Authentic digital passport credential documenting your physical visits to royal monuments, Coronation anniversary events, and certified guild workshops in Benin City.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleShare}
              className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 border border-stone-700 shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              {copied ? 'Link Copied!' : 'Share Passport'}
            </button>
            <button
              onClick={() => setShowCertificate(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg"
            >
              <Trophy className="w-3.5 h-3.5" />
              View Citation Certificate
            </button>
          </div>
        </div>

        {/* View Mode Navigation Tabs */}
        <div className="flex items-center justify-between gap-2 mb-6 bg-stone-950 p-1.5 rounded-2xl border border-stone-800 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('booklet')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewMode === 'booklet'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-400 hover:text-white hover:bg-stone-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Inside Passport Booklet
            </button>

            <button
              onClick={() => setViewMode('cover')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewMode === 'cover'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-400 hover:text-white hover:bg-stone-900'
              }`}
            >
              <Crown className="w-4 h-4" />
              Leather Booklet Cover
            </button>

            <button
              onClick={() => setViewMode('badges')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewMode === 'badges'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-400 hover:text-white hover:bg-stone-900'
              }`}
            >
              <Award className="w-4 h-4" />
              Badges Vault ({unlockedCount}/{badges.length})
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-3 pr-2 text-xs text-amber-400 font-mono">
            <span>PASSPORT: {passportNumber}</span>
          </div>
        </div>

        {/* --- VIEW MODE 1: OPEN PASSPORT BOOKLET (BI-FOLD DATA PAGE + VISAS & STAMPS) --- */}
        {viewMode === 'booklet' && (
          <div className="space-y-8 animate-fade-in">
            {/* The Bi-Fold Realistic Open Passport */}
            <div className="bg-stone-950 rounded-3xl p-3 sm:p-6 shadow-2xl border-4 border-amber-700/40 relative overflow-hidden">
              {/* Booklet Spine Center Shadow */}
              <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-black/40 via-black/70 to-black/40 z-20 pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                
                {/* LEFT PAGE: BIOMETRIC IDENTITY DATA PAGE */}
                <div className="passport-security-page rounded-2xl p-5 sm:p-7 text-stone-900 shadow-inner border border-amber-900/20 relative overflow-hidden flex flex-col justify-between min-h-[500px]">
                  
                  {/* Top Security Micro-Header */}
                  <div>
                    <div className="flex justify-between items-start border-b-2 border-amber-800/40 pb-3 mb-4">
                      <div>
                        <div className="text-[10px] font-bold tracking-widest text-amber-900 uppercase">
                          REPUBLIC OF NIGERIA • EDO STATE
                        </div>
                        <h3 className="font-display font-black text-lg text-amber-950 leading-tight">
                          PASSPORT / PASSEPORT
                        </h3>
                        <div className="text-[9px] font-semibold text-stone-600">
                          KINGDOM OF BENIN HERITAGE AUTHORITY
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono font-black text-amber-900 border border-amber-800/40 px-2 py-0.5 rounded">
                          TYPE: P
                        </span>
                        <div className="text-[10px] font-bold text-stone-600 mt-0.5">CODE: NGA</div>
                      </div>
                    </div>

                    {/* Photo + Identity Fields Layout */}
                    <div className="grid grid-cols-12 gap-4 items-start">
                      
                      {/* Bearer Photo Column */}
                      <div className="col-span-5 space-y-2">
                        <div className="relative w-full aspect-[3/4] bg-stone-200 rounded-lg overflow-hidden border-2 border-amber-800/40 shadow-sm group">
                          <img
                            src={bearerPhoto}
                            alt={visitorName}
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Iridescent Hologram Security Emblem Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 via-pink-400/10 to-amber-300/20 pointer-events-none mix-blend-overlay" />
                          <div className="absolute bottom-1 right-1 bg-amber-950/80 text-amber-300 px-1.5 py-0.5 rounded text-[8px] font-bold backdrop-blur">
                            VERIFIED
                          </div>
                        </div>

                        {/* Photo Upload Shortcut */}
                        <ImageUpload
                          label="Change Photo"
                          value={bearerPhoto}
                          onChange={(url) => setBearerPhoto(url)}
                          folder="avatars"
                          aspectHint="Passport Photo"
                        />
                      </div>

                      {/* Biometric Fields Column */}
                      <div className="col-span-7 space-y-2.5 text-xs">
                        <div>
                          <div className="text-[9px] font-bold text-stone-500 uppercase">Passport No. / N° de Passeport</div>
                          <div className="font-mono font-black text-amber-950 text-sm tracking-wider">{passportNumber}</div>
                        </div>

                        <div>
                          <div className="text-[9px] font-bold text-stone-500 uppercase">Surname / Nom</div>
                          <div className="font-bold text-stone-900 text-sm tracking-wide">EXPLORER</div>
                        </div>

                        <div>
                          <div className="text-[9px] font-bold text-stone-500 uppercase">Given Names / Prénoms</div>
                          <input
                            type="text"
                            value={visitorName}
                            onChange={(e) => setVisitorName(e.target.value)}
                            className="w-full bg-white/70 border border-amber-800/30 rounded px-2 py-1 font-extrabold text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-700"
                            placeholder="Enter Bearer Name"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-[9px] font-bold text-stone-500 uppercase">Nationality</div>
                            <input
                              type="text"
                              value={nationality}
                              onChange={(e) => setNationality(e.target.value)}
                              className="w-full bg-white/70 border border-amber-800/30 rounded px-1.5 py-0.5 text-[11px] font-bold text-stone-900"
                            />
                          </div>
                          <div>
                            <div className="text-[9px] font-bold text-stone-500 uppercase">Date of Issue</div>
                            <div className="font-bold text-stone-800">07 OCT 2026</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-[9px] font-bold text-stone-500 uppercase">Authority</div>
                            <div className="font-semibold text-stone-700 text-[10px]">EDO TOURISM</div>
                          </div>
                          <div>
                            <div className="text-[9px] font-bold text-stone-500 uppercase">Expiry Date</div>
                            <div className="font-bold text-stone-800">07 OCT 2031</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Machine Readable Zone (MRZ ICAO OCR-B Standard) */}
                  <div className="mt-4 pt-3 border-t-2 border-dashed border-amber-800/40 bg-stone-200/50 p-2.5 rounded-lg font-mrz text-[10px] sm:text-xs leading-none text-stone-900 break-all select-all">
                    <div>{mrzLine1}</div>
                    <div className="mt-1">{mrzLine2}</div>
                  </div>
                </div>

                {/* RIGHT PAGE: VISAS & ENTRY STAMPS (PAGE 4–5) */}
                <div className="passport-security-page rounded-2xl p-5 sm:p-7 text-stone-900 shadow-inner border border-amber-900/20 flex flex-col justify-between min-h-[500px] relative overflow-hidden">
                  
                  {/* Watermark Crest */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                    <Crown className="w-64 h-64 text-amber-900" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center border-b-2 border-amber-800/40 pb-2 mb-4">
                      <div className="text-xs font-black uppercase text-amber-950 tracking-widest">
                        VISAS & HERITAGE STAMPS
                      </div>
                      <div className="text-[10px] font-bold text-amber-900 font-mono">
                        PAGE 4 • {stamps.length} SEALS
                      </div>
                    </div>

                    {/* Ink Rubber Stamps Display Grid */}
                    {stamps.length === 0 ? (
                      <div className="p-8 border-2 border-dashed border-stone-300 rounded-2xl text-center text-stone-500 text-xs">
                        <Stamp className="w-10 h-10 mx-auto mb-2 text-stone-400 opacity-60" />
                        <p className="font-bold text-stone-700">No Entry Stamps Yet</p>
                        <p className="text-[11px] mt-1">Use the Claim Tool below to record your physical visits to Oba Palace, Igun Street, or Coronation Festivals.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {stamps.map((s, idx) => {
                          const style = getStampStyle(idx);
                          const isNew = s.target_id === latestStampedId;

                          return (
                            <div
                              key={s.id}
                              className={`p-3.5 border-2 ${style.color.border} ${style.color.bg} ${style.shape} ${style.rotation} ${
                                isNew ? 'animate-stamp-press border-4' : 'ink-stamp'
                              } transition-transform hover:rotate-0 hover:scale-105 cursor-pointer shadow-sm relative group`}
                              title={`Stamped on ${formatDate(s.claimed_at)}`}
                            >
                              <div className="text-[8px] font-black uppercase tracking-widest text-center border-b border-current pb-1 mb-1">
                                ★ BENIN CITY ENTRY ★
                              </div>
                              <div className="text-center">
                                <div className={`font-black text-xs leading-tight capitalize ${style.color.text}`}>
                                  {s.target_name}
                                </div>
                                <div className="text-[9px] font-bold font-mono mt-1 opacity-90">
                                  {formatDate(s.claimed_at)}
                                </div>
                                <div className="text-[8px] uppercase tracking-tighter mt-0.5 font-bold opacity-75">
                                  OFFICIAL SEAL #{idx + 1}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Stamp Counter & Verification Guarantee */}
                  <div className="mt-4 pt-3 border-t border-amber-800/30 flex items-center justify-between text-[11px] text-amber-950 font-bold">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      Verified Entry Seal Protocol
                    </span>
                    <span className="font-mono text-stone-600">PAGE 5</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* --- VIEW MODE 2: LEATHER BOOKLET COVER (3D LEATHER GRAIN + EMBOSSED GOLD FOIL) --- */}
        {viewMode === 'cover' && (
          <div className="max-w-md mx-auto animate-scale-up">
            <div className="passport-leather-cover rounded-3xl p-8 sm:p-12 text-center border-4 border-amber-500/40 shadow-2xl relative overflow-hidden">
              
              {/* Metallic Gold Foil Header */}
              <div className="space-y-4">
                <div className="text-xs font-bold tracking-[0.3em] uppercase gold-foil-text">
                  REPUBLIC OF NIGERIA
                </div>
                <div className="text-sm font-black tracking-[0.25em] uppercase gold-foil-text">
                  EDO STATE • BENIN KINGDOM
                </div>

                {/* 3D Royal Coat of Arms / Crown Emblem */}
                <div className="py-6 flex items-center justify-center">
                  <div className="w-28 h-28 rounded-full border-4 border-amber-400/60 flex items-center justify-center bg-gradient-to-br from-amber-500/20 to-amber-700/20 shadow-2xl relative group">
                    <Crown className="w-16 h-16 text-amber-300 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                  </div>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl font-black tracking-[0.3em] uppercase gold-foil-text">
                  PASSPORT
                </h2>
                <div className="text-xs font-bold tracking-[0.2em] uppercase text-amber-200/70">
                  PASSEPORT • CULTURAL CREDENTIAL
                </div>

                <div className="pt-8 text-xs font-mono text-amber-300/60 flex items-center justify-center gap-2">
                  <QrCode className="w-4 h-4" />
                  <span>BIOMETRIC CHIP ENABLED</span>
                </div>

                <button
                  onClick={() => setViewMode('booklet')}
                  className="mt-6 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold rounded-xl text-xs transition-all shadow-lg inline-flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Open Passport Booklet
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW MODE 3: HERITAGE BADGES VAULT --- */}
        {viewMode === 'badges' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-stone-950 rounded-3xl p-6 sm:p-8 border border-stone-800">
              <h3 className="font-display text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Heritage Milestone Badges ({unlockedCount}/{badges.length} Unlocked)
              </h3>
              <p className="text-xs text-stone-400 mb-6">
                Earn authentic cultural title badges as you visit key landmarks and coronation festivals across Benin City.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {badges.map((b) => {
                  const unlocked = isBadgeUnlocked(b);
                  return (
                    <div
                      key={b.id}
                      className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                        unlocked
                          ? 'bg-stone-900 border-amber-500/40 text-white shadow-md'
                          : 'bg-stone-950/60 border-stone-800 text-stone-500 opacity-60'
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                          unlocked
                            ? 'bg-amber-500 text-stone-950 font-bold shadow-lg'
                            : 'bg-stone-800 text-stone-600'
                        }`}
                      >
                        <Trophy className="w-6 h-6" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-bold text-sm ${unlocked ? 'text-white' : 'text-stone-400'}`}>
                            {b.title}
                          </h4>
                          {unlocked ? (
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                              UNLOCKED
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-stone-500 bg-stone-800 px-2 py-0.5 rounded-full">
                              LOCKED
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-400 mt-1">{b.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* --- CLAIM A NEW STAMP TOOL --- */}
        <div className="mt-8 bg-stone-950 rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl">
          <h3 className="font-display text-lg font-bold text-white mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Claim a Landmark or Festival Entry Seal
          </h3>
          <p className="text-xs text-stone-400 mb-6">
            In Benin City or attending a ceremony? Select an attraction or coronation event to stamp your official visitor passport in real-time.
          </p>

          <form onSubmit={handleClaim} className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value)}
              className="flex-1 px-4 py-3 bg-stone-900 border border-stone-700 text-white rounded-xl text-xs focus:outline-none focus:border-amber-400"
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
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shrink-0"
            >
              <Stamp className="w-4 h-4" />
              Stamp Passport
            </button>
          </form>

          {claimMessage && (
            <div
              className={`mt-4 p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                claimMessage.success
                  ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-950/80 border border-amber-500/40 text-amber-300'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{claimMessage.text}</span>
            </div>
          )}
        </div>

        {/* --- OFFICIAL PRINTABLE CITATION CERTIFICATE MODAL --- */}
        {showCertificate && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white text-stone-900 rounded-3xl max-w-2xl w-full p-6 sm:p-10 shadow-2xl relative animate-scale-up max-h-[90vh] overflow-y-auto border-8 border-double border-amber-600">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center mx-auto shadow-md">
                  <Crown className="w-9 h-9" />
                </div>

                <div className="text-xs tracking-widest uppercase font-bold text-amber-700">
                  KINGDOM OF BENIN HERITAGE CITATION
                </div>

                <h2 className="font-display text-3xl font-extrabold text-stone-900">
                  Official Certificate of Exploration
                </h2>

                <p className="text-xs text-stone-600 max-w-lg mx-auto">
                  This certifies that cultural explorer
                </p>

                <div className="text-2xl font-display font-extrabold text-amber-800 border-b-2 border-amber-400 pb-2 inline-block px-8">
                  {visitorName}
                </div>

                <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                  has officially documented and explored the cultural landmarks, sacred shrines, and heritage traditions of Benin City, acquiring <span className="font-bold text-stone-900">{stamps.length} verified digital passport stamps</span> on the BENIN360 Platform.
                </p>

                <div className="pt-6 grid grid-cols-2 gap-4 text-left border-t border-stone-200 text-xs text-stone-600">
                  <div>
                    <span className="font-semibold text-stone-900">Date Issued:</span> {new Date().toLocaleDateString('en-GB')}
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900">Verification Engine:</span> BENIN360 Biometric Protocol
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900">Coronation Context:</span> 10th Anniversary Observance
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900">Passport Ref:</span> {passportNumber}
                  </div>
                </div>

                <div className="pt-6 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    Print Certificate
                  </button>
                  <button
                    onClick={() => setShowCertificate(false)}
                    className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors"
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
