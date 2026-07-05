import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { parksApi } from '../api/parks.api';
import type { Park } from '../api/parks.api';
import { eventsApi } from '../api/events.api';
import type { Event } from '../api/events.api';
import ParkCard from '../components/ParkCard';
import EventCard from '../components/EventCard';
import { ArrowRight, MapPin, QrCode, Bell } from 'lucide-react';

const FEATURES = [
  {
    icon: <MapPin size={26} className="text-green-600" />,
    iconBg: 'bg-green-50 border-green-100',
    title: 'Interactive Map',
    desc: 'Find parks near you with our GPS-powered map. Get directions and explore facilities before you arrive.',
  },
  {
    icon: <QrCode size={26} className="text-blue-600" />,
    iconBg: 'bg-blue-50 border-blue-100',
    title: 'QR Check-In',
    desc: "Scan QR codes at park entrances to instantly access park info, services, and what's happening today.",
  },
  {
    icon: <Bell size={26} className="text-amber-600" />,
    iconBg: 'bg-amber-50 border-amber-100',
    title: 'Live Updates',
    desc: 'Get real-time notifications for upcoming events, park alerts, and community announcements.',
  },
];

const STATS = [
  { value: '15+', label: 'Parks' },
  { value: '50+', label: 'Events / Month' },
  { value: 'Free', label: 'Entry Available' },
];

export default function Home() {
  const [parks, setParks] = useState<Park[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      parksApi.list().then((r) => setParks(r.data.slice(0, 4))),
      eventsApi.list().then((r) => setEvents(r.data.slice(0, 3))),
    ]).finally(() => setLoading(false));
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-green-950 via-green-800 to-emerald-700">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* Ambient glows */}
        <div className="absolute top-16 left-8 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-28 right-8 w-96 h-96 bg-green-300/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1.5s' }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white pt-12 pb-20">
          {/* Location badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8 text-sm font-medium">
            <MapPin size={14} className="text-emerald-300" />
            <span className="text-green-100">Addis Ababa, Ethiopia 🇪🇹</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.07] mb-6 tracking-tight">
            Discover{' '}
            <span className="text-emerald-300 italic">Nature</span>
            <br />in the City
          </h1>

          <p className="text-green-100/80 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Explore Addis Ababa's parks, attend cultural events, and experience the green heart
            of Ethiopia's capital — all in one place.
          </p>

          {/* CTA buttons */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/parks"
              className="inline-flex items-center gap-2 bg-emerald-400 text-green-950 px-8 py-4 rounded-full font-bold text-base hover:bg-emerald-300 active:scale-95 transition-all shadow-2xl shadow-emerald-900/50"
            >
              Explore Parks <ArrowRight size={18} />
            </Link>
            <Link
              to="/map"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-white/20 active:scale-95 transition-all"
            >
              View on Map
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-3 max-w-xs mx-auto">
            {STATS.map(({ value, label }) => (
              <div
                key={label}
                className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl py-4 px-2"
              >
                <div className="text-2xl font-extrabold text-emerald-300">{value}</div>
                <div className="text-[11px] text-green-200 mt-0.5 leading-tight">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 72"
            preserveAspectRatio="none"
            className="w-full block"
            style={{ fill: 'white', display: 'block' }}
          >
            <path d="M0,36 C480,72 960,0 1440,36 L1440,72 L0,72 Z" />
          </svg>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-3">
              Why Smart Parks
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explore Smarter</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-base leading-relaxed">
              Plan your perfect park visit with real-time info, interactive maps, and seamless check-in.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map(({ icon, iconBg, title, desc }) => (
              <div
                key={title}
                className="group p-8 rounded-3xl border border-gray-100 hover:border-green-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default"
              >
                <div
                  className={`w-14 h-14 ${iconBg} border rounded-2xl flex items-center justify-center mb-5`}
                >
                  {icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PARKS ─────────────────────────────────────── */}
      <section className="py-20 bg-gray-50/70">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-2">
                Green Spaces
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Parks</h2>
            </div>
            <Link
              to="/parks"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700 border border-green-200 hover:border-green-400 px-5 py-2.5 rounded-full transition-all"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-72 rounded-3xl bg-gray-200 animate-pulse" />
                ))
              : parks.map((park) => <ParkCard key={park.id} park={park} />)}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link
              to="/parks"
              className="inline-flex items-center gap-2 text-sm font-semibold text-green-600 border border-green-200 px-5 py-2.5 rounded-full"
            >
              View all parks <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── UPCOMING EVENTS ────────────────────────────────────── */}
      {!loading && events.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-2">
                  What's On
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Upcoming Events</h2>
              </div>
              <Link
                to="/events"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700 border border-green-200 hover:border-green-400 px-5 py-2.5 rounded-full transition-all"
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event) => <EventCard key={event.id} event={event} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA BANNER ─────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-green-700 to-emerald-600 relative overflow-hidden">
        {/* Subtle pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="relative max-w-2xl mx-auto px-4 text-center text-white">
          <div className="text-5xl mb-5 select-none">🌿</div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
            Ready to Explore?
          </h2>
          <p className="text-green-100 text-lg mb-8 leading-relaxed">
            Join thousands of Addis Ababa residents discovering their city's beautiful green spaces.
          </p>
          <Link
            to="/parks"
            className="inline-flex items-center gap-2 bg-white text-green-700 px-8 py-4 rounded-full font-bold text-base hover:bg-green-50 active:scale-95 transition-all shadow-xl shadow-green-900/30"
          >
            Start Exploring <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
