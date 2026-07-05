import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { parksApi } from '../api/parks.api';
import type { Park } from '../api/parks.api';
import { eventsApi } from '../api/events.api';
import type { Event } from '../api/events.api';
import ParkCard from '../components/ParkCard';
import EventCard from '../components/EventCard';
import { ArrowRight, MapPin, QrCode, Bell, Search, Map as MapIcon } from 'lucide-react';

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
  const navigate = useNavigate();
  const [parks, setParks] = useState<Park[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    Promise.all([
      parksApi.list().then((r) => setParks(r.data.slice(0, 6))),
      eventsApi.list().then((r) => setEvents(r.data.slice(0, 3))),
    ]).finally(() => setLoading(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/parks?search=${encodeURIComponent(q)}` : '/parks');
  };

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-emerald-800">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* Radial spotlight */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(52,211,153,0.22), transparent 70%)',
          }}
        />
        {/* Ambient glows */}
        <div className="absolute -top-10 left-4 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-24 right-4 w-96 h-96 bg-teal-300/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1.5s' }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-64 h-64 bg-lime-300/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '0.8s' }}
        />

        {/* Floating decorative leaves */}
        <span
          className="pointer-events-none absolute top-24 left-[10%] text-4xl opacity-20 animate-bounce hidden md:block"
          style={{ animationDuration: '4s' }}
        >
          🌿
        </span>
        <span
          className="pointer-events-none absolute bottom-40 left-[7%] text-3xl opacity-20 animate-bounce hidden md:block"
          style={{ animationDuration: '5s', animationDelay: '1s' }}
        >
          🍃
        </span>
        <span
          className="pointer-events-none absolute top-40 right-[9%] text-4xl opacity-20 animate-bounce hidden md:block"
          style={{ animationDuration: '4.5s', animationDelay: '0.5s' }}
        >
          🌳
        </span>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white pt-16 pb-24">
          {/* Location badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-8 text-sm font-medium shadow-lg shadow-emerald-950/30">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-green-100">Addis Ababa, Ethiopia 🇪🇹</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] mb-6 tracking-tight">
            Discover{' '}
            <span className="bg-gradient-to-r from-emerald-300 via-lime-200 to-emerald-300 bg-clip-text text-transparent italic">
              Nature
            </span>
            <br />in the Heart of the City
          </h1>

          <p className="text-green-100/80 text-lg md:text-xl mb-9 max-w-2xl mx-auto leading-relaxed">
            Explore Addis Ababa's parks, attend cultural events, and experience the green heart
            of Ethiopia's capital — all in one place.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8">
            <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md rounded-full p-2 pl-5 shadow-2xl shadow-emerald-950/40 border border-white/40 focus-within:ring-2 focus-within:ring-emerald-400/60 transition">
              <Search size={20} className="text-gray-400 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search parks, gardens, green spaces…"
                aria-label="Search parks"
                className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 text-base focus:outline-none min-w-0"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 bg-green-700 hover:bg-green-800 text-white font-semibold text-sm px-5 py-3 rounded-full transition-colors active:scale-95 shrink-0"
              >
                Search <ArrowRight size={16} />
              </button>
            </div>
          </form>

          {/* CTA buttons */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              to="/parks"
              className="inline-flex items-center gap-2 bg-emerald-400 text-green-950 px-7 py-3.5 rounded-full font-bold text-base hover:bg-emerald-300 active:scale-95 transition-all shadow-2xl shadow-emerald-900/50"
            >
              Explore Parks <ArrowRight size={18} />
            </Link>
            <Link
              to="/map"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-7 py-3.5 rounded-full font-semibold text-base hover:bg-white/20 active:scale-95 transition-all"
            >
              <MapIcon size={18} /> View on Map
            </Link>
          </div>

          {/* Social proof + stats */}
          <div className="mt-14 flex flex-col items-center gap-7">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {['🌳', '🌿', '🏞️', '🌸'].map((emo, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center text-sm"
                  >
                    {emo}
                  </div>
                ))}
              </div>
              <span className="text-sm text-green-100/80">
                Loved by <b className="text-white font-semibold">thousands</b> of residents
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-sm w-full">
              {STATS.map(({ value, label }) => (
                <div
                  key={label}
                  className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl py-4 px-2 hover:bg-white/[0.14] transition-colors"
                >
                  <div className="text-2xl font-extrabold text-emerald-300">{value}</div>
                  <div className="text-[11px] text-green-200 mt-0.5 leading-tight">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom wave — layered */}
        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg
            viewBox="0 0 1440 90"
            preserveAspectRatio="none"
            className="w-full block h-[60px] md:h-[90px]"
          >
            <path
              d="M0,50 C360,90 720,10 1080,40 C1260,55 1380,60 1440,50 L1440,90 L0,90 Z"
              fill="#f9fafb"
              fillOpacity="0.5"
            />
            <path
              d="M0,62 C400,92 800,32 1200,58 C1320,66 1400,66 1440,62 L1440,90 L0,90 Z"
              fill="#f9fafb"
            />
          </svg>
        </div>
      </section>

      {/* ── FEATURED PARKS ─────────────────────────────────────── */}
      <section className="pt-20 pb-10 bg-gray-50/70">
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

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 h-[22rem] rounded-3xl bg-gray-200 animate-pulse" />
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="flex-1 min-h-[10rem] rounded-3xl bg-gray-200 animate-pulse" />
                <div className="flex-1 min-h-[10rem] rounded-3xl bg-gray-200 animate-pulse" />
              </div>
            </div>
          ) : (
            <>
              {/* Featured row — one big park + two stacked beside it */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {parks[0] && (
                  <div className="lg:col-span-7">
                    <ParkCard park={parks[0]} variant="featured" />
                  </div>
                )}
                {parks.length > 1 && (
                  <div className="lg:col-span-5 flex flex-col gap-6">
                    {parks.slice(1, 3).map((park) => (
                      <div key={park.id} className="flex-1 [&>a]:h-full">
                        <ParkCard park={park} variant="compact" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Remaining parks */}
              {parks.length > 3 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {parks.slice(3).map((park) => (
                    <ParkCard key={park.id} park={park} />
                  ))}
                </div>
              )}
            </>
          )}

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
        <section className="pt-10 pb-20 bg-white">
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

      {/* ── FEATURES ───────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50/70">
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
