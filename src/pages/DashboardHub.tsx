import { useState, useEffect } from 'react';
import {
  Hammer, Building2, Compass, User, ShieldCheck, Sparkles, LogIn
} from 'lucide-react';
import { api } from '@/lib/api';
import { ArtisanDashboardPage } from './ArtisanDashboardPage';
import { BusinessDashboardPage } from './BusinessDashboardPage';
import { GuideDashboardPage } from './GuideDashboardPage';
import { VisitorDashboardPage } from './VisitorDashboardPage';
import { AdminDashboardPage } from './AdminDashboardPage';
import type { User as UserType, UserRole } from '@/types';

export function DashboardHub({ initialRole }: { initialRole?: UserRole }) {
  const [currentUser, setCurrentUser] = useState<UserType | null>(() => api.getStoredUser());
  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    if (initialRole) return initialRole;
    if (currentUser?.role) return currentUser.role;
    return 'guild_artisan';
  });

  useEffect(() => {
    api.getCurrentUser().then((u) => {
      if (u) {
        setCurrentUser(u);
        if (!initialRole) setActiveRole(u.role);
      }
    }).catch(() => {});
  }, [initialRole]);

  const ROLES = [
    { key: 'guild_artisan' as UserRole, label: 'Guild Artisan', icon: Hammer, color: 'text-amber-700 bg-amber-50 border-amber-300' },
    { key: 'business_operator' as UserRole, label: 'Hotel & Dining Marketer', icon: Building2, color: 'text-blue-700 bg-blue-50 border-blue-300' },
    { key: 'tour_guide' as UserRole, label: 'Tour Guide', icon: Compass, color: 'text-emerald-700 bg-emerald-50 border-emerald-300' },
    { key: 'visitor' as UserRole, label: 'Visitor & Explorer', icon: User, color: 'text-stone-700 bg-stone-100 border-stone-300' },
    { key: 'admin' as UserRole, label: 'Supervisor Console (Admin)', icon: ShieldCheck, color: 'text-primary-800 bg-primary-50 border-primary-300' },
  ];

  return (
    <div>
      {/* Persona Selector Bar for Immediate Testing */}
      <div className="pt-20 bg-stone-900 border-b border-stone-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-amber-300 uppercase tracking-wide">Stakeholder Portals:</span>
            <span className="text-stone-400 hidden sm:inline">Switch portal:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {ROLES.map((r) => (
              <button
                key={r.key}
                onClick={() => setActiveRole(r.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  activeRole === r.key
                    ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md scale-105'
                    : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-750'
                }`}
              >
                <r.icon className="w-3.5 h-3.5" />
                <span>{r.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Render the Active Dashboard */}
      {activeRole === 'guild_artisan' && <ArtisanDashboardPage user={currentUser} />}
      {activeRole === 'business_operator' && <BusinessDashboardPage user={currentUser} />}
      {activeRole === 'tour_guide' && <GuideDashboardPage user={currentUser} />}
      {activeRole === 'visitor' && <VisitorDashboardPage user={currentUser} />}
      {activeRole === 'admin' && <AdminDashboardPage />}
    </div>
  );
}
