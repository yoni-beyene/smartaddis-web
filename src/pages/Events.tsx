import { useEffect, useState } from 'react';
import { eventsApi } from '../api/events.api';
import type { Event } from '../api/events.api';
import EventCard from '../components/EventCard';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';

const categories = ['ALL', 'CULTURAL', 'FESTIVAL', 'COMMUNITY', 'SEASONAL'] as const;
type Category = typeof categories[number];

const label = (c: Category) => (c === 'ALL' ? 'All' : c.charAt(0) + c.slice(1).toLowerCase());

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<Category>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventsApi.list().then((r) => setEvents(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL' ? events : events.filter((e) => e.category === filter);

  return (
    <div>
      <PageHeader
        eyebrow="What's On"
        title="Events & activities"
        subtitle="Cultural events, festivals and community gatherings across the city's green spaces."
      >
        <div className="flex gap-2 flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === c
                  ? 'bg-dark-forest text-cotton shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-accent-gold hover:text-forest-ink'
              }`}
            >
              {label(c)}
            </button>
          ))}
        </div>
      </PageHeader>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 rounded-3xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4 select-none">🎉</div>
            <p className="font-display text-xl text-forest-ink mb-1">No events found</p>
            <p className="text-gray-400 text-sm">
              {filter === 'ALL' ? 'Check back soon for what’s on.' : 'Try another category.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event, i) => (
              <Reveal key={event.id} delay={(i % 3) * 80}>
                <EventCard event={event} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
