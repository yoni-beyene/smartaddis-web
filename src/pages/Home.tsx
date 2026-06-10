import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { parksApi, Park } from '../api/parks.api';
import { eventsApi, Event } from '../api/events.api';
import ParkCard from '../components/ParkCard';
import EventCard from '../components/EventCard';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();
  const [parks, setParks] = useState<Park[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    parksApi.list().then((r) => setParks(r.data.slice(0, 4)));
    eventsApi.list().then((r) => setEvents(r.data.slice(0, 3)));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('home.hero_title')}</h1>
          <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">{t('home.hero_subtitle')}</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/parks" className="bg-white text-green-700 px-6 py-3 rounded-full font-semibold hover:bg-green-50 transition-colors">
              {t('home.explore_parks')}
            </Link>
            <Link to="/events" className="border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors">
              {t('home.view_events')}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Parks */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t('home.featured_parks')}</h2>
          <Link to="/parks" className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {parks.map((park) => <ParkCard key={park.id} park={park} />)}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t('home.upcoming_events')}</h2>
            <Link to="/events" className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {events.map((event) => <EventCard key={event.id} event={event} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
