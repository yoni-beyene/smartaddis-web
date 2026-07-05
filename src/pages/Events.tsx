import { useEffect, useState } from 'react';
import { eventsApi } from '../api/events.api';
import type { Event } from '../api/events.api';
import EventCard from '../components/EventCard';

const categories = ['ALL', 'CULTURAL', 'FESTIVAL', 'COMMUNITY', 'SEASONAL'] as const;
type Category = typeof categories[number];

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<Category>('ALL');

  useEffect(() => { eventsApi.list().then((r) => setEvents(r.data)); }, []);

  const filtered = filter === 'ALL' ? events : events.filter((e) => e.category === filter);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Events &amp; Activities</h1>
      <p className="text-gray-500 mb-6">Upcoming cultural events, festivals, and community activities</p>

      {events.length > 0 && (
        <>
          <div className="flex gap-2 flex-wrap mb-8">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === c
                    ? 'bg-green-600 text-white'
                    : 'border border-gray-300 text-gray-600 hover:border-green-500 hover:text-green-600'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event) => <EventCard key={event.id} event={event} />)}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-gray-400 py-12">No events found</p>
          )}
        </>
      )}
    </div>
  );
}
