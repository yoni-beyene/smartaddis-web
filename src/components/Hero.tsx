import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ArrowRight, MapPin, Search } from 'lucide-react';
import type { Park } from '../api/parks.api';
import { mediaUrl } from '../api/parks.api';
import type { Event } from '../api/events.api';
import AnimatedCounter from './AnimatedCounter';

interface HeroProps {
  parks: Park[];
  totalParkCount: number;
  monthlyEventCount: number;
  featuredPark: Park | null;
  upcomingEvent: Event | null;
}

const CROSSFADE_INTERVAL_MS = 6000;

const MARKERS = [
  { top: '20%', left: '15%', delay: 0 },
  { top: '65%', left: '25%', delay: 0.6 },
  { top: '35%', left: '80%', delay: 1.2 },
  { top: '75%', left: '70%', delay: 1.8 },
];

export default function Hero({
  parks,
  totalParkCount,
  monthlyEventCount,
  featuredPark,
  upcomingEvent,
}: HeroProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  const backgroundImages = useMemo(
    () =>
      parks
        .map((park) => park.media?.find((m) => m.isPrimary && m.type === 'IMAGE'))
        .filter((media): media is NonNullable<typeof media> => Boolean(media))
        .map((media) => mediaUrl(media.url)),
    [parks],
  );

  useEffect(() => {
    if (backgroundImages.length < 2) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % backgroundImages.length);
    }, CROSSFADE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [backgroundImages.length]);

  useEffect(() => {
    pathRefs.current.forEach((path, i) => {
      if (!path) return;
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 2.5,
        delay: i * 0.3,
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true,
        repeatDelay: 3,
      });
    });
  }, []);

  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 600], [0, 120]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(query.trim() ? `/parks?search=${encodeURIComponent(query.trim())}` : '/parks');
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden bg-dark-forest">
      <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
        <AnimatePresence mode="sync">
          {backgroundImages.length > 0 && (
            <motion.img
              key={backgroundImages[activeIndex]}
              src={backgroundImages[activeIndex]}
              alt=""
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-dark-forest/90 via-primary-green/70 to-dark-forest/95" />
      </motion.div>

      <div className="absolute inset-0 pointer-events-none">
        {MARKERS.map((marker, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ top: marker.top, left: marker.left }}
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: marker.delay, ease: 'easeInOut' }}
          >
            <MapPin size={20} className="text-accent-gold drop-shadow-lg" />
          </motion.div>
        ))}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            ref={(el) => { pathRefs.current[0] = el; }}
            d="M15,20 Q45,10 80,35"
            stroke="#22C55E"
            strokeWidth="0.3"
            fill="none"
            opacity="0.6"
          />
          <path
            ref={(el) => { pathRefs.current[1] = el; }}
            d="M25,65 Q50,55 70,75"
            stroke="#F4B400"
            strokeWidth="0.3"
            fill="none"
            opacity="0.6"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white pt-12 pb-16">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8 text-sm font-medium">
          <MapPin size={14} className="text-light-green" />
          <span className="text-off-white/90">Addis Ababa, Ethiopia 🇪🇹</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.07] mb-6 tracking-tight">
          Experience Addis Ababa
          <br />
          Like Never Before
        </h1>

        <p className="text-off-white/80 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          Discover parks, events, hidden gems, cultural experiences and nature across Ethiopia's capital.
        </p>

        <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto mb-8">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/25 rounded-full px-5 py-3">
            <Search size={18} className="text-off-white/70 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search parks, events, and places..."
              className="flex-1 bg-transparent outline-none text-white placeholder:text-off-white/50 text-sm"
            />
            <button
              type="submit"
              className="bg-accent-gold text-dark-forest text-sm font-bold px-5 py-2 rounded-full hover:brightness-105 transition-all shrink-0"
            >
              Search
            </button>
          </div>
        </form>

        <div className="flex items-center justify-center gap-4 flex-wrap mb-14">
          <Link
            to="/parks"
            className="inline-flex items-center gap-2 bg-accent-gold text-dark-forest px-8 py-4 rounded-full font-bold text-base hover:brightness-105 active:scale-95 transition-all shadow-2xl"
          >
            Explore Parks <ArrowRight size={18} />
          </Link>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-white/20 active:scale-95 transition-all"
          >
            Explore Events
          </Link>
          <Link
            to="/map"
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-white/20 active:scale-95 transition-all"
          >
            Interactive Map
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl py-5 px-3">
            <div className="text-3xl font-extrabold text-light-green">
              <AnimatedCounter target={totalParkCount} suffix="+" />
            </div>
            <div className="text-xs text-off-white/70 mt-1">Parks</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl py-5 px-3">
            <div className="text-3xl font-extrabold text-light-green">
              <AnimatedCounter target={monthlyEventCount} suffix="+" />
            </div>
            <div className="text-xs text-off-white/70 mt-1">Monthly Events</div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex absolute bottom-10 left-0 right-0 justify-between px-10 z-10 pointer-events-none">
        {upcomingEvent && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="pointer-events-auto"
          >
            <Link
              to={`/parks/${upcomingEvent.park.slug}`}
              className="flex items-center gap-3 bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-3 max-w-xs hover:bg-white/20 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-accent-gold/20 flex items-center justify-center text-xl shrink-0">
                🎉
              </div>
              <div className="min-w-0 text-left">
                <div className="text-[10px] uppercase tracking-wide text-off-white/60 font-bold">
                  Upcoming Event
                </div>
                <div className="text-sm font-semibold text-white truncate">{upcomingEvent.title}</div>
              </div>
            </Link>
          </motion.div>
        )}

        {featuredPark && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="pointer-events-auto"
          >
            <Link
              to={`/parks/${featuredPark.slug}`}
              className="flex items-center gap-3 bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-3 max-w-xs hover:bg-white/20 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-light-green/20 flex items-center justify-center text-xl shrink-0">
                🌳
              </div>
              <div className="min-w-0 text-left">
                <div className="text-[10px] uppercase tracking-wide text-off-white/60 font-bold">
                  Featured Park
                </div>
                <div className="text-sm font-semibold text-white truncate">{featuredPark.name}</div>
              </div>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
