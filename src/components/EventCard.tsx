import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import type { Event } from '../api/events.api';
import { mediaUrl } from '../api/parks.api';

const categoryColors: Record<string, string> = {
  CULTURAL: 'bg-purple-100 text-purple-700',
  FESTIVAL: 'bg-pink-100 text-pink-700',
  COMMUNITY: 'bg-blue-100 text-blue-700',
  SEASONAL: 'bg-amber-100 text-amber-700',
};

const categoryDateBg: Record<string, string> = {
  CULTURAL: 'bg-purple-50',
  FESTIVAL: 'bg-pink-50',
  COMMUNITY: 'bg-blue-50',
  SEASONAL: 'bg-amber-50',
};

const categoryAccent: Record<string, string> = {
  CULTURAL: 'bg-purple-500',
  FESTIVAL: 'bg-pink-500',
  COMMUNITY: 'bg-blue-500',
  SEASONAL: 'bg-amber-500',
};

export default function EventCard({ event }: { event: Event }) {
  const date = new Date(event.startDate);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
  const imgSrc = event.imageUrl ? mediaUrl(event.imageUrl) : null;

  return (
    <div className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      {/* Cover image (shown if available) */}
      {imgSrc && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={imgSrc}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Accent bar */}
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${categoryAccent[event.category] ?? 'bg-gray-300'}`} />
          {/* Category badge overlaid */}
          <div className="absolute top-3 left-3">
            <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold backdrop-blur-sm ${categoryColors[event.category] ?? 'bg-white/80 text-gray-600'}`}>
              {event.category}
            </span>
          </div>
          {/* Date badge overlaid */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 text-center shadow-sm">
            <div className="text-lg font-extrabold text-gray-800 leading-none">{day}</div>
            <div className="text-[10px] font-bold text-gray-400 tracking-wider">{month}</div>
          </div>
        </div>
      )}

      {/* Body — horizontal layout when NO image */}
      <div className={`flex ${imgSrc ? 'flex-col p-5' : ''}`}>
        {/* Date column (only shown when no image) */}
        {!imgSrc && (
          <div className={`flex flex-col items-center justify-center px-5 min-w-[76px] shrink-0 ${categoryDateBg[event.category] ?? 'bg-gray-50'}`}>
            <span className="text-3xl font-extrabold text-gray-800 leading-none">{day}</span>
            <span className="text-[11px] font-bold text-gray-400 tracking-wider mt-1">{month}</span>
          </div>
        )}

        <div className={`flex-1 min-w-0 ${imgSrc ? '' : 'p-5'}`}>
          {/* Category (only shown when no image, since image overlays it) */}
          {!imgSrc && (
            <div className="mb-2">
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold tracking-wide ${categoryColors[event.category] ?? 'bg-gray-100 text-gray-500'}`}>
                {event.category}
              </span>
            </div>
          )}

          <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-green-700 transition-colors line-clamp-2">
            {event.title}
          </h3>
          <p className="text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed">{event.description}</p>
          <Link
            to={`/parks/${event.park.slug}`}
            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-green-600 transition-colors"
          >
            <MapPin size={11} />
            <span className="truncate">{event.park.name}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
