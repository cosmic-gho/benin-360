import { useState, useEffect } from 'react';
import { ArrowLeft, Star, Clock, Phone, Mail, Languages, Award, Send, CheckCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { useRouter } from '@/lib/router';
import type { Guide, Experience } from '@/types';
import { VerificationBadge, LoadingSpinner, EmptyState } from '@/components/ui';

export function GuidesPage() {
  const { navigate } = useRouter();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [gList, eList] = await Promise.all([
          api.getGuides(),
          api.getExperiences(),
        ]);
        setGuides(gList);
        setExperiences(eList);
      } catch (err) {
        console.error('Failed to load guides from backend:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);



  if (loading) return <LoadingSpinner message="Loading guides..." />;

  return (
    <div className="pt-20 min-h-screen bg-gray-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <button onClick={() => navigate('#/')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900">Tour Guides & Experiences</h1>
        <p className="mt-2 text-gray-500">Book local guides for heritage tours, cultural experiences and more</p>



        {/* Guides */}
        <h2 className="font-display text-2xl font-bold text-gray-900 mt-8 mb-4">Meet Our Guides</h2>
        {guides.length === 0 ? (
          <EmptyState message="No guides available yet." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <div key={guide.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                <div className="p-5">
                  <div className="flex items-center gap-4">
                    {guide.avatar_url && (
                      <img src={guide.avatar_url} alt={guide.name} className="w-16 h-16 rounded-full object-cover" />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{guide.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 text-warning-400 fill-warning-400" />
                        <span className="text-sm font-medium text-gray-700">{guide.rating}</span>
                        <span className="text-xs text-gray-400">({guide.review_count} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mt-3 line-clamp-3">{guide.bio}</p>

                  {guide.languages.length > 0 && (
                    <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
                      <Languages className="w-3.5 h-3.5" />
                      {guide.languages.join(', ')}
                    </div>
                  )}

                  {guide.specialties.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {guide.specialties.map((s) => (
                        <span key={s} className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded">{s}</span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    {guide.phone && (
                      <a href={`tel:${guide.phone}`} className="flex-1 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-medium text-gray-700 flex items-center justify-center gap-1 transition-colors">
                        <Phone className="w-3.5 h-3.5" /> Contact
                      </a>
                    )}
                    <button
                      onClick={() => navigate(`#guides/${guide.slug}`)}
                      className="flex-1 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Experiences */}
        <h2 className="font-display text-2xl font-bold text-gray-900 mt-10 mb-4">Bookable Experiences</h2>
        {experiences.length === 0 ? (
          <EmptyState message="No experiences available yet." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiences.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ExperienceCard({ experience }: { experience: Experience }) {
  const [showRequest, setShowRequest] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ visitor_name: '', visit_date: '', party_size: '1', notes: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowRequest(false);
      setForm({ visitor_name: '', visit_date: '', party_size: '1', notes: '' });
    }, 3000);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
      <div className="relative h-44 overflow-hidden">
        {experience.image_url && <img src={experience.image_url} alt={experience.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur rounded-lg px-2 py-1">
          <span className="text-sm font-bold text-primary-600">{experience.price_ngn ? `\u20A6${experience.price_ngn.toLocaleString()}` : 'On request'}</span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-gray-900">{experience.title}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{experience.description}</p>

        <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
          {experience.duration_hours && (
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {experience.duration_hours}h</span>
          )}
          {experience.guide && (
            <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" /> {experience.guide.name}</span>
          )}
        </div>

        {showRequest && !submitted ? (
          <form onSubmit={handleSubmit} className="mt-4 space-y-2 border-t pt-3">
            <input
              type="text" required placeholder="Your name"
              value={form.visitor_name}
              onChange={(e) => setForm({ ...form, visitor_name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400"
            />
            <input
              type="date" required
              value={form.visit_date}
              onChange={(e) => setForm({ ...form, visit_date: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400"
            />
            <select
              value={form.party_size}
              onChange={(e) => setForm({ ...form, party_size: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400"
            >
              {[1,2,3,4,5,6,7,8].map((n) => <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>)}
            </select>
            <textarea
              placeholder="Notes (optional)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400 resize-none"
              rows={2}
            />
            <button type="submit" className="w-full px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors">
              <Send className="w-3.5 h-3.5" /> Submit Request
            </button>
          </form>
        ) : submitted ? (
          <div className="mt-4 bg-success-50 border border-success-200 rounded-lg p-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success-600" />
            <span className="text-sm text-success-800">Request submitted! The guide will contact you.</span>
          </div>
        ) : (
          <button
            onClick={() => setShowRequest(true)}
            className="mt-4 w-full px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Request Booking
          </button>
        )}
      </div>
    </div>
  );
}
