import { useState } from 'react';
import {
  X, User, ShieldCheck, Hammer, Building2, Compass, CheckCircle2,
  LogIn, UserPlus, LogOut, Sparkles, KeyRound, AlertCircle
} from 'lucide-react';
import { api } from '@/lib/api';
import type { User as UserType, UserRole } from '@/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserType | null;
  onUserChange: (user: UserType | null) => void;
}

export function AuthModal({ isOpen, onClose, currentUser, onUserChange }: AuthModalProps) {
  const [tab, setTab] = useState<'switch' | 'login' | 'register'>('switch');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Login form state
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  // Register form state
  const [regForm, setRegForm] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    role: 'visitor' as UserRole,
    guild_name: 'Igun Eronmwon Guild of Bronze Casters',
    specialty_craft: 'Lost-wax Bronze Casting',
    company_name: '',
    business_type: 'hotel',
  });

  if (!isOpen) return null;

  // Preset quick-switch accounts
  const DEMO_PERSONAS = [
    {
      role: 'guild_artisan' as UserRole,
      title: 'Guild Artisan (Master Founder)',
      name: 'Chief Nosakhare Igun',
      username: 'artisan_igun',
      password: 'artisan123',
      icon: Hammer,
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      description: 'Master of the historic Igun Street lost-wax bronze casting guild.',
    },
    {
      role: 'business_operator' as UserRole,
      title: 'Business Marketer (Hotel/Dining)',
      name: 'Osas Erhabor',
      username: 'hotel_manager',
      password: 'hotel123',
      icon: Building2,
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
      description: 'Manager of Protea Hotel Benin City Select in GRA.',
    },
    {
      role: 'tour_guide' as UserRole,
      title: 'Certified Heritage Guide',
      name: 'Osaro Obasogie',
      username: 'tour_guide_osaro',
      password: 'guide123',
      icon: Compass,
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      description: 'Senior royal protocol and Kingdom chronicles tour specialist.',
    },
    {
      role: 'visitor' as UserRole,
      title: 'Cultural Explorer / Tourist',
      name: 'John Doe',
      username: 'visitor_john',
      password: 'visitor123',
      icon: User,
      badgeColor: 'bg-gray-100 text-gray-800 border-gray-300',
      description: 'Diaspora visitor collecting passport stamps & exploring events.',
    },
    {
      role: 'admin' as UserRole,
      title: 'Platform Administrator',
      name: 'Supervisor Console',
      username: 'admin',
      password: 'admin12345',
      icon: ShieldCheck,
      badgeColor: 'bg-primary-100 text-primary-900 border-primary-300',
      description: 'Verifies listings, monitors audit logs, and oversees content.',
    },
  ];

  const handleQuickLogin = async (username: string, pwd: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await api.login({ username, password: pwd });
      onUserChange(res.user);
      setSuccess(`Logged in as ${res.user.first_name || res.user.username} (${res.user.role})`);
      setTimeout(() => onClose(), 800);
    } catch (err: any) {
      setError(err?.message || 'Login failed. Ensure backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.login(loginForm);
      onUserChange(res.user);
      setSuccess(`Welcome back, ${res.user.username}!`);
      setTimeout(() => onClose(), 800);
    } catch (err: any) {
      setError(err?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.register(regForm);
      onUserChange(res.user);
      setSuccess(`Account registered as ${res.user.role}!`);
      setTimeout(() => onClose(), 800);
    } catch (err: any) {
      setError(err?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    onUserChange(null);
    setSuccess('Signed out.');
    setTimeout(() => onClose(), 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-stone-900 to-primary-950 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-400" />
              <span className="text-xs uppercase tracking-wider text-primary-300 font-bold">BENIN360 Identity Portal</span>
            </div>
            <h2 className="text-xl font-bold font-display mt-0.5">User Roles & Persona Access</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status banner */}
        {currentUser && (
          <div className="px-6 py-3 bg-primary-50 border-b border-primary-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                {currentUser.username.substring(0, 2)}
              </div>
              <div className="text-xs">
                <div className="font-bold text-gray-900">
                  {currentUser.first_name ? `${currentUser.first_name} ${currentUser.last_name || ''}` : currentUser.username}
                </div>
                <div className="text-primary-700 capitalize font-medium flex items-center gap-1">
                  <span>Role: {currentUser.role.replace('_', ' ')}</span>
                  {currentUser.is_verified_entity && <ShieldCheck className="w-3.5 h-3.5 text-secondary-600 inline" />}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        )}

        {/* Error / Success Notifications */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Tab selection */}
        <div className="flex border-b border-gray-100 px-6 pt-3 gap-4 text-xs font-semibold">
          <button
            onClick={() => setTab('switch')}
            className={`pb-2.5 transition-colors border-b-2 ${
              tab === 'switch' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            ⚡ Quick Role Switcher
          </button>
          <button
            onClick={() => setTab('login')}
            className={`pb-2.5 transition-colors border-b-2 ${
              tab === 'login' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('register')}
            className={`pb-2.5 transition-colors border-b-2 ${
              tab === 'register' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Register with Role
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {tab === 'switch' && (
            <div className="space-y-3">
              <p className="text-xs text-gray-500 mb-2">
                Click any persona below to immediately log in and preview how BENIN360 adapts permissions and features:
              </p>
              {DEMO_PERSONAS.map((p) => {
                const isCurrent = currentUser?.username === p.username;
                return (
                  <button
                    key={p.username}
                    type="button"
                    disabled={loading}
                    onClick={() => handleQuickLogin(p.username, p.password)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 ${
                      isCurrent
                        ? 'border-primary-500 bg-primary-50/70 shadow-sm'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50/60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${p.badgeColor}`}>
                        <p.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900 text-sm">{p.name}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${p.badgeColor}`}>
                            {p.role.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5">{p.description}</p>
                      </div>
                    </div>
                    {isCurrent && (
                      <span className="shrink-0 text-xs font-bold text-primary-700 bg-primary-100 px-2.5 py-1 rounded-full">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {tab === 'login' && (
            <form onSubmit={handleManualLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Username or Email</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. artisan_igun or user@example.com"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          )}

          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Category Role Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                  Select Your Account Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'visitor', label: 'Visitor / Tourist', icon: User },
                    { key: 'guild_artisan', label: 'Guild Artisan', icon: Hammer },
                    { key: 'business_operator', label: 'Hotel / Restaurant', icon: Building2 },
                    { key: 'tour_guide', label: 'Tour Guide', icon: Compass },
                  ].map((r) => (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => setRegForm({ ...regForm, role: r.key as UserRole })}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 text-xs font-semibold transition-all ${
                        regForm.role === r.key
                          ? 'border-primary-600 bg-primary-50 text-primary-900 shadow-sm'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <r.icon className={`w-4 h-4 ${regForm.role === r.key ? 'text-primary-600' : 'text-gray-400'}`} />
                      <span>{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    required
                    placeholder="osahon_artisan"
                    value={regForm.username}
                    onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="osahon@example.com"
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={regForm.password}
                  onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-primary-500"
                />
              </div>

              {/* Dynamic Role-Specific Metadata Fields */}
              {regForm.role === 'guild_artisan' && (
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
                  <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wide">Guild Credentials</div>
                  <div>
                    <label className="block text-[11px] font-medium text-amber-800 mb-0.5">Guild Name</label>
                    <input
                      type="text"
                      value={regForm.guild_name}
                      onChange={(e) => setRegForm({ ...regForm, guild_name: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-amber-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-amber-800 mb-0.5">Specialty Craft</label>
                    <input
                      type="text"
                      value={regForm.specialty_craft}
                      onChange={(e) => setRegForm({ ...regForm, specialty_craft: e.target.value })}
                      placeholder="e.g. Lost-wax bronze casting or Ivie Coral stringing"
                      className="w-full px-2.5 py-1.5 bg-white border border-amber-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              )}

              {regForm.role === 'business_operator' && (
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2">
                  <div className="text-[11px] font-bold text-blue-900 uppercase tracking-wide">Business Information</div>
                  <div>
                    <label className="block text-[11px] font-medium text-blue-800 mb-0.5">Company Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Benin Heritage Hotel / Mama Eki Kitchen"
                      value={regForm.company_name}
                      onChange={(e) => setRegForm({ ...regForm, company_name: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-blue-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                {loading ? 'Creating Account...' : 'Register Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
