import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Event } from '../api/events.api';

const categoryColors: Record<string, string> = {
  CULTURAL: 'bg-purple-100 text-purple-700',
  FESTIVAL: 'bg-pink-100 text-pink-700',
  COMMUNITY: 'bg-blue-100 text-blue-700',
  SEASONAL: 'bg-amber-100 text-amber-700',
};

export default function EventCard({ event }: { event: Event }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${categoryColors[event.category] ?? ''}`}>
          {event.category}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(event.startDate).toLocaleDateString()}
        </span>
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{event.description}</p>
      <div className="flex items-center gap-1 text-xs text-gray-400">
        <MapPin size={12} />
        <Link to={`/parks/${event.park.slug}`} className="hover:text-green-600 transition-colors">
          {event.park.name}
        </Link>
      </div>
    </div>
  );
}
