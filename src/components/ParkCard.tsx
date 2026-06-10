import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Park } from '../api/parks.api';
import { useTranslation } from 'react-i18next';

export default function ParkCard({ park }: { park: Park }) {
  const { t } = useTranslation();
  const primaryImage = park.media?.find((m) => m.isPrimary && m.type === 'IMAGE');

  return (
    <Link to={`/parks/${park.slug}`} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
      <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 relative overflow-hidden">
        {primaryImage ? (
          <img src={primaryImage.url} alt={park.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-green-400 text-5xl">🌳</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">{park.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{park.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            {park._count?.reviews ?? 0} {t('parks.reviews')}
          </span>
          <span className="font-medium text-green-700">{park.entryFee || t('parks.free')}</span>
        </div>
      </div>
    </Link>
  );
}
