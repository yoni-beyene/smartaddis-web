import { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { parksApi } from '../api/parks.api';
import type { Park } from '../api/parks.api';
import { eventsApi } from '../api/events.api';
import type { Event } from '../api/events.api';
import ParkCard from '../components/ParkCard';
import EventCard from '../components/EventCard';
import Reveal from '../components/Reveal';
import HeroBloom from '../components/Bloom';
import SectionHead from '../components/SectionHead';
import { ArrowRight, MapPin, QrCode, Bell, Search, Star, Map as MapIcon } from 'lucide-react';

const FEATURES = [
  {
    icon: <MapPin size={24} />,
    title: 'Interactive map',
    desc: 'Find parks near you with our GPS-powered map. Get directions and explore facilities before you arrive.',
  },
  {
    icon: <QrCode size={24} />,
    title: 'QR check-in',
    desc: "Scan QR codes at park entrances to instantly access park info, services, and what's happening today.",
  },
  {
    icon: <Bell size={24} />,
    title: 'Live updates',
    desc: 'Get real-time notifications for upcoming events, park alerts, and community announcements.',
  },
];

const STATS = [
  { value: '15+', label: 'Parks' },
  { value: '50+', label: 'Events / Month' },
  { value: 'Free', label: 'Entry Available' },
];

interface FeaturedReview {
  body: string;
  rating: number;
  name: string;
  parkName: string;
  parkSlug: string;
}

export default function Home() {
  const navigate = useNavigate();
  const [parks, setParks] = useState<Park[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [featured, setFeatured] = useState<FeaturedReview | null>(null);

  useEffect(() => {
    Promise.all([
      parksApi.list().then((r) => setParks(r.data.slice(0, 6))),
      eventsApi.list().then((r) => setEvents(r.data.slice(0, 3))),
    ]).finally(() => setLoading(false));
  }, []);

  // Pull a real, strong review from the parks that have them
  useEffect(() => {
    const candidates = parks
      .filter((p) => (p._count?.reviews ?? 0) > 0)
      .sort((a, b) => (b._count?.reviews ?? 0) - (a._count?.reviews ?? 0))
      .slice(0, 3);
    if (candidates.length === 0) return;

    let cancelled = false;
    Promise.all(
      candidates.map((p) =>
        parksApi
          .getReviews(p.id)
          .then((r) => ({ park: p, reviews: r.data.reviews }))
          .catch(() => null),
      ),
    ).then((results) => {
      if (cancelled) return;
      const pool: FeaturedReview[] = [];
      results.forEach((res) => {
        if (!res) return;
        res.reviews.forEach((rv) => {
          const body = rv.body?.trim() ?? '';
          if (body.length >= 20 && rv.rating >= 4) {
            pool.push({
              body: body.length > 220 ? `${body.slice(0, 220).trimEnd()}…` : body,
              rating: rv.rating,
              name: rv.user.name,
              parkName: res.park.name,
              parkSlug: res.park.slug,
            });
          }
        });
      });
      if (pool.length) {
        pool.sort((a, b) => b.rating - a.rating || b.body.length - a.body.length);
        setFeatured(pool[0]);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [parks]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/parks?search=${encodeURIComponent(q)}` : '/parks');
  };

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-forest-ink text-cotton">
        {/* Warm depth from the top-right */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 82% 12%, rgba(15,122,74,0.38), transparent 58%)',
          }}
        />
        {/* Faint dot grid */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'radial-gradient(circle, #F5F1E4 1px, transparent 1px)',
            backgroundSize: '34px 34px',
          }}
        />
        {/* Ambient bloom behind content on mobile */}
        <HeroBloom className="lg:hidden pointer-events-none absolute -right-12 -top-10 w-[320px] opacity-[0.12]" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-24 grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">
          {/* ── Left: the thesis ── */}
          <div className="min-w-0">
            {/* Eyebrow — the city's name and its meaning */}
            <div className="rise-in flex items-center gap-3 mb-8" style={{ animationDelay: '0.05s' }}>
              <span className="h-px w-9 bg-accent-gold/70" />
              <span className="font-display text-lg text-cotton/90">አዲስ አበባ</span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-accent-gold">
                new flower
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-normal leading-[0.98] tracking-tight text-[2.6rem] sm:text-[3.6rem] lg:text-[4.6rem] mb-6">
              <span className="rise-in block" style={{ animationDelay: '0.12s' }}>
                Find nature in
              </span>
              <span className="rise-in block" style={{ animationDelay: '0.22s' }}>
                the <em className="italic text-accent-gold">New Flower.</em>
              </span>
            </h1>

            <p
              className="rise-in max-w-md text-cotton/70 text-lg leading-relaxed mb-9"
              style={{ animationDelay: '0.32s' }}
            >
             Explore lush parks, vibrant gardens, and unforgettable cultural experiences in Addis Ababa, Africa's green capital.
            </p>

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="rise-in max-w-md mb-7"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="flex items-center gap-2 rounded-full bg-cotton p-1.5 pl-5 shadow-2xl shadow-black/40 focus-within:ring-2 focus-within:ring-accent-gold/70 transition">
                <Search size={20} className="text-forest-ink/40 shrink-0" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search parks, gardens, green spaces…"
                  aria-label="Search parks"
                  className="flex-1 bg-transparent text-forest-ink placeholder-forest-ink/40 text-base focus:outline-none min-w-0"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 bg-dark-forest hover:bg-primary-green text-cotton font-semibold text-sm px-5 py-3 rounded-full transition-colors active:scale-95 shrink-0"
                >
                  Search <ArrowRight size={16} />
                </button>
              </div>
            </form>

            {/* Actions */}
            <div
              className="rise-in flex items-center gap-7 mb-12"
              style={{ animationDelay: '0.48s' }}
            >
              <Link
                to="/parks"
                className="inline-flex items-center gap-2 font-semibold text-accent-gold border-b-2 border-accent-gold/30 hover:border-accent-gold pb-0.5 transition-colors"
              >
                Explore all parks <ArrowRight size={16} />
              </Link>
              <Link
                to="/map"
                className="inline-flex items-center gap-2 text-cotton/70 hover:text-cotton transition-colors"
              >
                <MapIcon size={16} /> View on map
              </Link>
            </div>

            {/* Stats — editorial row */}
            <div
              className="rise-in flex flex-wrap items-center gap-x-5 gap-y-3"
              style={{ animationDelay: '0.56s' }}
            >
              {STATS.map(({ value, label }, i) => (
                <Fragment key={label}>
                  {i > 0 && (
                    <span aria-hidden className="text-accent-gold/60 text-xs select-none">
                      ✿
                    </span>
                  )}
                  <span className="flex items-baseline gap-1.5">
                    <span className="font-display text-2xl text-cotton">{value}</span>
                    <span className="text-cotton/55 text-sm">{label}</span>
                  </span>
                </Fragment>
              ))}
            </div>
          </div>

          {/* ── Right: the signature bloom ── */}
          <div className="hidden lg:flex justify-center">
            <HeroBloom className="w-full max-w-[440px]" />
          </div>
        </div>

        {/* Bottom wave into the next section */}
        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg
            viewBox="0 0 1440 90"
            preserveAspectRatio="none"
            className="w-full block h-[56px] md:h-[84px]"
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
          <Reveal>
            <SectionHead
              eyebrow="Green Spaces"
              title="Featured parks"
              action={
                <Link
                  to="/parks"
                  className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-dark-forest hover:text-primary-green border border-gray-200 hover:border-accent-gold px-5 py-2.5 rounded-full transition-colors"
                >
                  View all <ArrowRight size={14} />
                </Link>
              }
            />
          </Reveal>

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
              <Reveal>
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
              </Reveal>

              {/* Remaining parks */}
              {parks.length > 3 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {parks.slice(3).map((park, i) => (
                    <Reveal key={park.id} delay={i * 90}>
                      <ParkCard park={park} />
                    </Reveal>
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
            <Reveal>
              <SectionHead
                eyebrow="What's On"
                title="Upcoming events"
                action={
                  <Link
                    to="/events"
                    className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-dark-forest hover:text-primary-green border border-gray-200 hover:border-accent-gold px-5 py-2.5 rounded-full transition-colors"
                  >
                    View all <ArrowRight size={14} />
                  </Link>
                }
              />
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event, i) => (
                <Reveal key={event.id} delay={i * 90}>
                  <EventCard event={event} />
                </Reveal>
              ))}
            </div>

            <div className="text-center mt-8 sm:hidden">
              <Link
                to="/events"
                className="inline-flex items-center gap-2 text-sm font-semibold text-dark-forest border border-gray-200 px-5 py-2.5 rounded-full"
              >
                View all events <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── TESTIMONIAL — a real review from the community ──────── */}
      {featured && (
        <section className="relative overflow-hidden bg-forest-ink text-cotton py-20 md:py-24">
          <HeroBloom
            color="#F4B400"
            className="pointer-events-none absolute -left-20 -bottom-24 w-[360px] opacity-[0.08] hidden md:block"
          />
          <Reveal className="relative max-w-3xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-2.5 mb-6">
              <span className="h-px w-7 bg-accent-gold" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-gold">
                From the community
              </span>
            </div>
            <div className="flex justify-center gap-1 mb-6">
              {Array.from({ length: featured.rating }).map((_, i) => (
                <Star key={i} size={18} className="fill-accent-gold text-accent-gold" />
              ))}
            </div>
            <blockquote className="font-display font-normal text-2xl md:text-[2.1rem] leading-[1.32] tracking-tight text-cotton mb-8">
              “{featured.body}”
            </blockquote>
            <div className="flex items-center justify-center gap-2.5 text-sm">
              <span className="font-semibold text-cotton">{featured.name}</span>
              <span aria-hidden className="text-accent-gold/50">✿</span>
              <Link
                to={`/parks/${featured.parkSlug}`}
                className="text-accent-gold hover:underline underline-offset-4"
              >
                {featured.parkName}
              </Link>
            </div>
          </Reveal>
        </section>
      )}

      {/* ── FEATURES ───────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50/70">
        <div className="max-w-6xl mx-auto px-4">
          <Reveal>
            <SectionHead
              center
              eyebrow="Why Smart Addis"
              title="Explore smarter"
              subtitle="Plan your perfect park visit with real-time info, interactive maps, and seamless check-in."
            />
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map(({ icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 90}>
                <div className="group h-full p-8 rounded-3xl bg-white border border-gray-100 hover:border-accent-gold/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default">
                  <div className="w-14 h-14 rounded-2xl bg-dark-forest/[0.06] border border-dark-forest/10 text-primary-green flex items-center justify-center mb-6 group-hover:bg-accent-gold/10 group-hover:border-accent-gold/30 group-hover:text-dark-forest transition-colors">
                    {icon}
                  </div>
                  <h3 className="font-display text-xl text-forest-ink mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-accent-gold text-forest-ink py-24">
        {/* Contour-ink pattern */}
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(8,32,24,0.14) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
        {/* Bloom motif in ink, echoing the hero */}
        <HeroBloom
          color="#082018"
          className="pointer-events-none absolute -right-16 -bottom-28 w-[380px] opacity-[0.10] hidden sm:block"
        />

        <Reveal className="relative max-w-2xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <span className="h-px w-7 bg-forest-ink/40" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-forest-ink/70">
              Your next green escape
            </span>
          </div>
          <h2 className="font-display font-normal text-[2.4rem] md:text-[3.25rem] leading-[1.05] tracking-tight mb-5">
            Ready to find your <em className="italic">new flower?</em>
          </h2>
          <p className="text-forest-ink/70 text-lg mb-9 max-w-md mx-auto leading-relaxed">
            Join thousands of Addis Ababa residents discovering the city's beautiful green spaces.
          </p>
          <Link
            to="/parks"
            className="inline-flex items-center gap-2 bg-forest-ink text-cotton px-8 py-4 rounded-full font-semibold text-base hover:bg-dark-forest active:scale-95 transition-all shadow-xl shadow-black/20"
          >
            Start exploring <ArrowRight size={18} />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
