import { Link } from 'react-router-dom';
import { Star, ChevronRight, Heart, Clock, MapPinned } from 'lucide-react';
import type { Park } from '../api/parks.api';
import { mediaUrl } from '../api/parks.api';
import { useTranslation } from 'react-i18next';
import { useFavoritesStore } from '../store/favorites.store';
import { haversineKm, type UserLocation } from '../utils/geo';
import { getTodayHours } from '../utils/hours';

type Variant = 'default' | 'featured' | 'compact';

interface ParkCardProps {
  park: Park;
  userLocation?: UserLocation | null;
  variant?: Variant;
}

export default function ParkCard({ park, userLocation, variant = 'default' }: ParkCardProps) {
  const { t } = useTranslation();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const primaryImage = park.media?.find((m) => m.isPrimary && m.type === 'IMAGE');
  const imgSrc = primaryImage ? mediaUrl(primaryImage.url) : null;
  const todayHours = getTodayHours(park.openingHours);
  const distanceKm = userLocation
    ? haversineKm(userLocation.lat, userLocation.lng, park.latitude, park.longitude)
    : null;
  const saved = isFavorite(park.id);
  const fee = park.entryFee || t('parks.free');
  const reviews = park._count?.reviews ?? 0;

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(park.id);
  };

  const SaveButton = ({ className }: { className?: string }) => (
    <button
      type="button"
      onClick={handleSaveClick}
      aria-label={saved ? 'Remove from saved parks' : 'Save park'}
      className={`w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors ${className ?? ''}`}
    >
      <Heart size={16} className={saved ? 'text-red-500 fill-red-500' : 'text-gray-500'} />
    </button>
  );

  const MetaRow = ({ light = false }: { light?: boolean }) =>
    todayHours || distanceKm !== null ? (
      <div className={`flex items-center gap-4 mb-3 text-xs ${light ? 'text-white/70' : 'text-gray-500'}`}>
        {todayHours && (
          <span className="flex items-center gap-1">
            <Clock size={12} /> {todayHours}
          </span>
        )}
        {distanceKm !== null && (
          <span className="flex items-center gap-1">
            <MapPinned size={12} /> {distanceKm.toFixed(1)} km away
          </span>
        )}
      </div>
    ) : null;

  /* ── FEATURED — large image-overlay card ─────────────────────── */
  if (variant === 'featured') {
    return (
      <Link
        to={`/parks/${park.slug}`}
        className="group relative flex h-full min-h-[24rem] flex-col justify-end overflow-hidden rounded-3xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-2xl"
      >
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={park.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-200 text-8xl text-green-300 select-none">
            🌳
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

        <SaveButton className="absolute top-4 left-4" />
        <div className="absolute top-4 right-4">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-green-700 shadow-sm backdrop-blur-sm">
            {fee}
          </span>
        </div>

        <div className="relative p-6 text-white">
          <span className="mb-3 inline-flex items-center rounded-full bg-emerald-400/90 px-2.5 py-1 text-[11px] font-bold tracking-wide text-green-950 uppercase">
            Featured
          </span>
          <h3 className="mb-1.5 text-2xl font-bold">{park.name}</h3>
          <p className="mb-4 max-w-md text-sm leading-relaxed text-white/70 line-clamp-2">
            {park.description}
          </p>
          <MetaRow light />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium text-white/80">
                {reviews} {t('parks.reviews')}
              </span>
            </div>
            <span className="flex items-center gap-0.5 text-sm font-semibold text-emerald-300 transition-all group-hover:gap-1.5">
              View Park <ChevronRight size={15} />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  /* ── COMPACT — horizontal card ───────────────────────────────── */
  if (variant === 'compact') {
    return (
      <Link
        to={`/parks/${park.slug}`}
        className="group flex overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
      >
        <div className="relative w-32 shrink-0 overflow-hidden bg-gradient-to-br from-green-100 to-emerald-200 sm:w-44">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={park.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl text-green-300 select-none">
              🌳
            </div>
          )}
          <SaveButton className="absolute top-2 left-2 !w-8 !h-8" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col p-4">
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="truncate font-bold text-gray-900 transition-colors group-hover:text-green-700">
              {park.name}
            </h3>
            <span className="shrink-0 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-bold text-green-700">
              {fee}
            </span>
          </div>
          <p className="mb-3 text-sm leading-relaxed text-gray-400 line-clamp-2">
            {park.description}
          </p>
          <MetaRow />
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium text-gray-500">
                {reviews} {t('parks.reviews')}
              </span>
            </div>
            <span className="flex items-center gap-0.5 text-xs font-semibold text-green-600 transition-all group-hover:gap-1.5">
              View <ChevronRight size={13} />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  /* ── DEFAULT — vertical card ─────────────────────────────────── */
  return (
    <Link
      to={`/parks/${park.slug}`}
      className="group block bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 border border-gray-100 transition-all duration-300"
    >
      <div className="relative h-64 bg-gradient-to-br from-green-100 to-emerald-200 overflow-hidden">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={park.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-green-300 text-6xl select-none">
            🌳
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <SaveButton className="absolute top-3 left-3" />
        <div className="absolute top-3 right-3">
          <span className="bg-white/90 backdrop-blur-sm text-green-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            {fee}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-green-700 transition-colors">
          {park.name}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed mb-3">{park.description}</p>

        <MetaRow />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Star size={13} className="text-amber-400 fill-amber-400" />
            <span className="text-xs text-gray-500 font-medium">
              {reviews} {t('parks.reviews')}
            </span>
          </div>
          <span className="flex items-center gap-0.5 text-xs font-semibold text-green-600 group-hover:gap-1.5 transition-all">
            View Park <ChevronRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}
