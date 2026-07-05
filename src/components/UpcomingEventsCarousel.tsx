import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EventCard from './EventCard';
import type { Event } from '../api/events.api';

export default function UpcomingEventsCarousel({ events }: { events: Event[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8 * (direction === 'left' ? -1 : 1);
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {events.map((event) => (
          <div key={event.id} className="snap-start shrink-0 w-[300px] sm:w-[340px]">
            <EventCard event={event} />
          </div>
        ))}
      </div>

      {events.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => scrollByCard('left')}
            aria-label="Scroll to previous events"
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={18} className="text-gray-600" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard('right')}
            aria-label="Scroll to next events"
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={18} className="text-gray-600" />
          </button>
        </>
      )}
    </div>
  );
}
