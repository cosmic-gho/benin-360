import { Compass, Heart, Mail, MapPin, Smartphone } from 'lucide-react';
import { useRouter, type Route } from '@/lib/router';

export function Footer() {
  const { navigate } = useRouter();

  const link = (label: string, r: Partial<Route>) => (
    <button
      onClick={() => {
        navigate(`#${r.name === 'home' ? '/' : r.name}`);
      }}
      className="text-sm text-gray-400 hover:text-primary-400 transition-colors text-left"
    >
      {label}
    </button>
  );

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-display font-extrabold text-xl">
                  BENIN<span className="text-primary-500">360</span>
                </div>
                <div className="text-[10px] text-gray-400 tracking-wide">
                  Connecting the World to Benin
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your digital companion for discovering the heritage, culture and experiences of Benin City and the Benin Kingdom.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Explore</h4>
            <div className="space-y-2.5 flex flex-col">
              {link('Events', { name: 'events' })}
              {link('Interactive Map', { name: 'map' })}
              {link('Heritage Sites', { name: 'attractions' })}
              {link('Hotels', { name: 'hotels' })}
              {link('Food Guide', { name: 'food' })}
              {link('Restaurants', { name: 'restaurants' })}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Services</h4>
            <div className="space-y-2.5 flex flex-col">
              {link('Tour Guides', { name: 'guides' })}
              {link('Experiences', { name: 'experiences' })}
              {link('Transport', { name: 'transport' })}
              {link('Marketplace', { name: 'marketplace' })}
              {link('Digital Passport', { name: 'passport' })}
              {link('AI Visitor Guide', { name: 'assistant' })}
              {link('QR Posters & Cards', { name: 'qr' })}
              {link('Admin Operations', { name: 'admin' })}
            </div>

          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">About</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                <span>Benin City, Edo State, Nigeria</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-500 shrink-0" />
                <span>hello@benin360.example</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-primary-500 shrink-0" />
                <span>Installable as a mobile app</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-gray-800 pt-8 space-y-4">
          <p className="text-xs text-gray-500 leading-relaxed max-w-3xl">
            BENIN360 is an independent digital tourism platform. It is not affiliated with the Oba's Palace,
            Coronation Anniversary Secretariat, or any government body unless an explicit partnership is confirmed.
            Event and business information shown is clearly marked as DEMO DATA and must be verified through official
            sources before publication. Powered by Patotec Software Solutions Ltd.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} BENIN360. Powered by Patotec Software Solutions Ltd.
            </p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-accent-500" /> for Benin
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
