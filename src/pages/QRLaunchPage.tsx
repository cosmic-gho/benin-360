import { useState } from 'react';
import {
  QrCode, Download, Printer, ArrowLeft, Sparkles, Share2,
  Copy, CheckCircle, ExternalLink, Compass, Shield
} from 'lucide-react';
import { useRouter } from '@/lib/router';

export function QRLaunchPage() {
  const { navigate } = useRouter();
  const [destination, setDestination] = useState<'home' | 'events' | 'map' | 'passport' | 'transport'>('home');
  const [campaignTag, setCampaignTag] = useState('hotel_desk');
  const [copied, setCopied] = useState(false);

  const getDestinationUrl = () => {
    const origin = window.location.origin;
    switch (destination) {
      case 'events': return `${origin}/#events?utm_source=qr&utm_campaign=${campaignTag}`;
      case 'map': return `${origin}/#map?utm_source=qr&utm_campaign=${campaignTag}`;
      case 'passport': return `${origin}/#passport?utm_source=qr&utm_campaign=${campaignTag}`;
      case 'transport': return `${origin}/#transport?utm_source=qr&utm_campaign=${campaignTag}`;
      default: return `${origin}/#/?utm_source=qr&utm_campaign=${campaignTag}`;
    }
  };

  const currentUrl = getDestinationUrl();
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=360x360&data=${encodeURIComponent(currentUrl)}&color=d65d06&bgcolor=ffffff&margin=1`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50 animate-fade-in pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => navigate('#/')}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        {/* Heading */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-800 mb-3">
            <QrCode className="w-3.5 h-3.5" />
            Official Launch Marketing System
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            BENIN360 QR Code & Display Card Generator
          </h1>
          <p className="mt-2 text-base text-gray-600">
            Generate and print branded QR destination cards for airport arrival kiosks, hotel front desks, restaurant table tents, event venues, and social media.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                QR Destination Page
              </label>
              <div className="space-y-2">
                {[
                  { key: 'home', label: 'Homepage (Discover Benin Overview)' },
                  { key: 'events', label: 'Coronation Events Hub' },
                  { key: 'map', label: 'Interactive GIS Heritage Map' },
                  { key: 'passport', label: 'Digital Visitor Passport' },
                  { key: 'transport', label: 'Airport Transfer & Chauffeurs' },
                ].map((dest) => (
                  <button
                    key={dest.key}
                    onClick={() => setDestination(dest.key as any)}
                    className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                      destination === dest.key
                        ? 'border-primary-500 bg-primary-50 text-primary-900 font-semibold'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {dest.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                Distribution Placement
              </label>
              <select
                value={campaignTag}
                onChange={(e) => setCampaignTag(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500"
              >
                <option value="hotel_desk">Hotel Front Desk / Lobby</option>
                <option value="airport_terminal">Benin Airport (BNI) Arrival</option>
                <option value="restaurant_table">Restaurant Table Tent</option>
                <option value="event_poster">Coronation Event Poster</option>
                <option value="whatsapp_share">WhatsApp / Social Media Share Card</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                Target URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-600 truncate"
                />
                <button
                  onClick={handleCopyUrl}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-semibold text-gray-700 transition-colors"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => window.print()}
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                Print Standee / Display Poster
              </button>

              <a
                href={qrApiUrl}
                download="benin360-qr-code.png"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 text-center"
              >
                <Download className="w-4 h-4" />
                Download High-Res QR Image
              </a>
            </div>
          </div>

          {/* Printable Display Card Preview */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-md bg-white rounded-3xl p-8 border-4 border-amber-600/30 shadow-xl text-center relative overflow-hidden print:m-0 print:border-none print:shadow-none">
              {/* Top Accent Strip */}
              <div className="h-2 w-28 bg-gradient-to-r from-primary-600 to-amber-500 rounded-full mx-auto mb-6" />

              {/* Logo & Headline */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white">
                  <Compass className="w-5 h-5" />
                </div>
                <div className="font-display font-extrabold text-2xl tracking-tight text-gray-900">
                  BENIN<span className="text-primary-600">360</span>
                </div>
              </div>

              <div className="text-[11px] font-semibold text-gray-500 tracking-widest uppercase mb-6">
                Connecting the World to Benin
              </div>

              {/* Call to action headline */}
              <div className="bg-gradient-to-r from-stone-900 to-primary-950 text-white py-3.5 px-4 rounded-2xl mb-6 shadow-sm">
                <div className="text-[11px] font-extrabold text-amber-400 tracking-wider uppercase">
                  10TH CORONATION ANNIVERSARY
                </div>
                <h3 className="font-display text-lg font-black mt-0.5 leading-snug">
                  COMING TO BENIN?
                  <br />
                  SCAN TO DISCOVER BENIN
                </h3>
              </div>

              {/* QR Code Container */}
              <div className="inline-block p-4 bg-white border-2 border-dashed border-gray-300 rounded-2xl shadow-inner mb-6">
                <img
                  src={qrApiUrl}
                  alt="Benin360 QR Code"
                  className="w-52 h-52 mx-auto rounded-lg"
                />
                <div className="text-[10px] text-gray-400 mt-2 font-mono">
                  Scan with any smartphone camera
                </div>
              </div>

              {/* Feature Pills */}
              <div className="grid grid-cols-2 gap-2 text-left mb-6 text-xs text-gray-700 bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-600" />
                  Coronation Events Hub
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-600" />
                  Interactive Heritage Map
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-600" />
                  Hotels & Food Guide
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-600" />
                  Digital Visitor Passport
                </div>
              </div>

              {/* Bottom Attribution */}
              <div className="border-t border-gray-100 pt-4 text-[10px] text-gray-400">
                Independent Digital Tourism Platform • Powered by Patotec Software Solutions Ltd.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
