import { useState, useEffect, useCallback } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'events' }
  | { name: 'event'; slug: string }
  | { name: 'map' }
  | { name: 'attractions' }
  | { name: 'attraction'; slug: string }
  | { name: 'hotels' }
  | { name: 'restaurants' }
  | { name: 'guides' }
  | { name: 'guide'; slug: string }
  | { name: 'experiences' }
  | { name: 'transport' }
  | { name: 'food' }
  | { name: 'marketplace' }
  | { name: 'passport' }
  | { name: 'assistant' }
  | { name: 'admin' }
  | { name: 'qr' }
  | { name: 'dashboard'; role?: string }
  | { name: 'artisan-dashboard' }
  | { name: 'business-dashboard' }
  | { name: 'guide-dashboard' }
  | { name: 'visitor-dashboard' };

function parseHash(): Route {
  const hash = window.location.hash.slice(1) || '/';
  const parts = hash.split('/').filter(Boolean);

  if (parts.length === 0) return { name: 'home' };
  if (parts[0] === 'events') {
    if (parts[1]) return { name: 'event', slug: parts[1] };
    return { name: 'events' };
  }
  if (parts[0] === 'map') return { name: 'map' };
  if (parts[0] === 'attractions') {
    if (parts[1]) return { name: 'attraction', slug: parts[1] };
    return { name: 'attractions' };
  }
  if (parts[0] === 'hotels') return { name: 'hotels' };
  if (parts[0] === 'restaurants') return { name: 'restaurants' };
  if (parts[0] === 'food') return { name: 'food' };
  if (parts[0] === 'guides') {
    if (parts[1]) return { name: 'guide', slug: parts[1] };
    return { name: 'guides' };
  }
  if (parts[0] === 'experiences') return { name: 'experiences' };
  if (parts[0] === 'transport') return { name: 'transport' };
  if (parts[0] === 'marketplace') return { name: 'marketplace' };
  if (parts[0] === 'passport') return { name: 'passport' };
  if (parts[0] === 'assistant') return { name: 'assistant' };
  if (parts[0] === 'admin') return { name: 'admin' };
  if (parts[0] === 'qr') return { name: 'qr' };
  if (parts[0] === 'dashboard') return { name: 'dashboard', role: parts[1] };
  if (parts[0] === 'artisan-dashboard') return { name: 'artisan-dashboard' };
  if (parts[0] === 'business-dashboard') return { name: 'business-dashboard' };
  if (parts[0] === 'guide-dashboard') return { name: 'guide-dashboard' };
  if (parts[0] === 'visitor-dashboard') return { name: 'visitor-dashboard' };

  return { name: 'home' };
}

export function useRouter() {
  const [route, setRoute] = useState<Route>(parseHash());

  useEffect(() => {
    const handler = () => {
      setRoute(parseHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const navigate = useCallback((path: string) => {
    window.location.hash = path;
  }, []);

  return { route, navigate };
}

export function routeToHash(route: Partial<Route>): string {
  switch (route.name) {
    case 'home': return '/';
    case 'events': return '/events';
    case 'event': return `/events/${route.slug}`;
    case 'map': return '/map';
    case 'attractions': return '/attractions';
    case 'attraction': return `/attractions/${route.slug}`;
    case 'hotels': return '/hotels';
    case 'restaurants': return '/restaurants';
    case 'food': return '/food';
    case 'guides': return '/guides';
    case 'guide': return `/guides/${route.slug}`;
    case 'experiences': return '/experiences';
    case 'transport': return '/transport';
    case 'marketplace': return '/marketplace';
    case 'passport': return '/passport';
    case 'assistant': return '/assistant';
    case 'admin': return '/admin';
    case 'qr': return '/qr';
    default: return '/';
  }
}

