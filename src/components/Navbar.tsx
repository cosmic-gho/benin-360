import { useState, useEffect } from 'react';
import { Menu, X, Compass, ChevronDown, User, ShieldCheck, Hammer, Building2, LogIn, LayoutDashboard } from 'lucide-react';
import { useRouter, type Route } from '@/lib/router';
import { api } from '@/lib/api';
import { AuthModal } from './AuthModal';
import type { User as UserType } from '@/types';

const navItems: { label: string; route: Partial<Route>; }[] = [
  { label: 'Events', route: { name: 'events' } },
  { label: 'Map', route: { name: 'map' } },
  { label: 'Heritage', route: { name: 'attractions' } },
  { label: 'Hotels', route: { name: 'hotels' } },
  { label: 'Food', route: { name: 'food' } },
  { label: 'Guides', route: { name: 'guides' } },
  { label: 'Transport', route: { name: 'transport' } },
  { label: 'Market', route: { name: 'marketplace' } },
  { label: 'Dashboards', route: { name: 'dashboard' } },
  { label: 'QR Generator', route: { name: 'qr' } },
  { label: 'Admin Console', route: { name: 'admin' } },
];

export function Navbar() {
  const { route, navigate } = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(() => api.getStoredUser());

  useEffect(() => {
    api.getCurrentUser().then(setCurrentUser).catch(() => {});
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [route]);

  const isActive = (name: string) => route.name === name;

  const go = (r: Partial<Route>) => {
    const hash = `#${r.name === 'home' ? '/' : r.name}`;
    navigate(hash === '#/' ? '/' : hash);
    setMobileOpen(false);
    setMoreOpen(false);
  };

  const primaryItems = navItems.slice(0, 4);
  const moreItems = navItems.slice(4);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white shadow-md py-2'
          : 'bg-transparent py-3'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => go({ name: 'home' })}
          className="flex items-center gap-2 group"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            scrolled ? 'bg-primary-600' : 'bg-white/20 backdrop-blur'
          }`}>
            <Compass className={`w-6 h-6 ${scrolled ? 'text-white' : 'text-white'}`} />
          </div>
          <div className="text-left">
            <div className={`font-display font-extrabold text-xl leading-none ${
              scrolled ? 'text-gray-900' : 'text-white'
            }`}>
              BENIN<span className="text-primary-500">360</span>
            </div>
            <div className={`text-[10px] font-medium tracking-wide ${
              scrolled ? 'text-gray-500' : 'text-white/80'
            }`}>
              Connecting the World to Benin
            </div>
          </div>
        </button>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {primaryItems.map((item) => (
            <button
              key={item.label}
              onClick={() => go(item.route)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.route.name!)
                  ? scrolled
                    ? 'bg-primary-50 text-primary-700'
                    : 'bg-white/20 text-white'
                  : scrolled
                    ? 'text-gray-600 hover:bg-gray-100'
                    : 'text-white/90 hover:bg-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* More dropdown */}
          <div className="relative">
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                moreItems.some((i) => isActive(i.route.name!))
                  ? scrolled ? 'bg-primary-50 text-primary-700' : 'bg-white/20 text-white'
                  : scrolled ? 'text-gray-600 hover:bg-gray-100' : 'text-white/90 hover:bg-white/10'
              }`}
            >
              More
              <ChevronDown className="w-4 h-4" />
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl py-2 min-w-[180px] border border-gray-100">
                {moreItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => go(item.route)}
                    className={`block w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
                      isActive(item.route.name!)
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => go({ name: 'passport' })}
            className={`ml-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isActive('passport')
                ? 'bg-secondary-600 text-white shadow-sm'
                : scrolled
                  ? 'bg-secondary-50 text-secondary-700 hover:bg-secondary-100'
                  : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Passport
          </button>

          <button
            onClick={() => go({ name: 'assistant' })}
            className={`ml-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              isActive('assistant')
                ? 'bg-primary-600 text-white shadow-sm'
                : scrolled
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            AI Guide
          </button>

          {/* Role Dashboard Quick Link */}
          <button
            onClick={() => {
              if (currentUser) {
                if (currentUser.role === 'guild_artisan') go({ name: 'artisan-dashboard' });
                else if (currentUser.role === 'business_operator') go({ name: 'business-dashboard' });
                else if (currentUser.role === 'tour_guide') go({ name: 'guide-dashboard' });
                else if (currentUser.role === 'visitor') go({ name: 'visitor-dashboard' });
                else if (currentUser.role === 'admin') go({ name: 'admin' });
                else go({ name: 'dashboard' });
              } else {
                go({ name: 'dashboard' });
              }
            }}
            className={`ml-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              ['dashboard', 'artisan-dashboard', 'business-dashboard', 'guide-dashboard', 'visitor-dashboard'].includes(route.name)
                ? 'bg-amber-600 text-white shadow-sm'
                : scrolled
                  ? 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                  : 'bg-white/20 text-white hover:bg-white/30'
            }`}
            title="Access role-specific dashboard (Artisans, Hotels, Guides, Tourists)"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>{currentUser ? 'My Portal' : 'Portals'}</span>
          </button>

          {/* User Persona / Auth button */}
          <button
            onClick={() => setAuthModalOpen(true)}
            className={`ml-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border ${
              currentUser
                ? currentUser.role === 'guild_artisan'
                  ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                  : currentUser.role === 'business_operator'
                  ? 'bg-blue-50 text-blue-900 border-blue-300 hover:bg-blue-100'
                  : currentUser.role === 'tour_guide'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                  : currentUser.role === 'admin'
                  ? 'bg-primary-100 text-primary-900 border-primary-300 hover:bg-primary-200'
                  : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
                : scrolled
                ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'
                : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
            }`}
          >
            {currentUser ? (
              <>
                <div className="w-4 h-4 rounded-full bg-primary-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {currentUser.username[0].toUpperCase()}
                </div>
                <span className="capitalize">{currentUser.first_name || currentUser.username}</span>
                <span className="text-[10px] opacity-75 hidden xl:inline">({currentUser.role.replace('_', ' ')})</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5" />
                <span>Roles / Sign In</span>
              </>
            )}
          </button>
        </div>


        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`lg:hidden p-2 rounded-lg ${
            scrolled ? 'text-gray-900' : 'text-white'
          }`}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg animate-slide-down">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => go(item.route)}
                className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.route.name!)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => go({ name: 'passport' })}
              className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                isActive('passport')
                  ? 'bg-secondary-100 text-secondary-700'
                  : 'bg-secondary-50 text-secondary-700 hover:bg-secondary-100'
              }`}
            >
              Digital Passport
            </button>
            <button
              onClick={() => go({ name: 'assistant' })}
              className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                isActive('assistant')
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
              }`}
            >
              AI Visitor Guide
            </button>

            {currentUser && (
              <button
                onClick={() => {
                  if (currentUser.role === 'guild_artisan') go({ name: 'artisan-dashboard' });
                  else if (currentUser.role === 'business_operator') go({ name: 'business-dashboard' });
                  else if (currentUser.role === 'tour_guide') go({ name: 'guide-dashboard' });
                  else if (currentUser.role === 'visitor') go({ name: 'visitor-dashboard' });
                  else if (currentUser.role === 'admin') go({ name: 'admin' });
                  else go({ name: 'dashboard' });
                }}
                className="w-full py-2.5 px-4 bg-amber-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Open My {currentUser.role.replace('_', ' ').toUpperCase()} Portal</span>
              </button>
            )}

            <button
              onClick={() => {
                setMobileOpen(false);
                setAuthModalOpen(true);
              }}
              className="mt-2 w-full py-2.5 px-4 bg-gray-900 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              {currentUser ? `Switch Role (${currentUser.username})` : 'User Personas / Sign In'}
            </button>
          </div>
        </div>
      )}

      {/* Role / Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={currentUser}
        onUserChange={setCurrentUser}
      />
    </header>
  );
}
