import { Link } from 'react-router-dom';
import { Star, ChevronRight } from 'lucide-react';
import type { Park } from '../api/parks.api';
import { mediaUrl } from '../api/parks.api';
import { useTranslation } from 'react-i18next';

export default function ParkCard({ park }: { park: Park }) {
  const { t } = useTranslation();
  const primaryImage = park.media?.find((m) => m.isPrimary && m.type === 'IMAGE');

  return (
    <Link
      to={`/parks/${park.slug}`}
      className="group block bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 border border-gray-100 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-52 bg-gradient-to-br from-green-100 to-emerald-200 overflow-hidden">
        {primaryImage ? (
          <img
            src={mediaUrl(primaryImage.url)}
            alt={park.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-green-300 text-6xl select-none">
            🌳
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {/* Entry fee badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-white/90 backdrop-blur-sm text-green-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            {park.entryFee || t('parks.free')}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-green-700 transition-colors">
          {park.name}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed mb-4">{park.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Star size={13} className="text-amber-400 fill-amber-400" />
            <span className="text-xs text-gray-500 font-medium">
              {park._count?.reviews ?? 0} {t('parks.reviews')}
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
