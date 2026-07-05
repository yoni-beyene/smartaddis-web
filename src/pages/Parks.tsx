import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { parksApi } from '../api/parks.api';
import type { Park } from '../api/parks.api';
import ParkCard from '../components/ParkCard';

export default function Parks() {
  const { t } = useTranslation();
  const [parks, setParks] = useState<Park[]>([]);
  const [search, setSearch] = useState('');

  const load = useCallback(() => {
    parksApi.list(search || undefined).then((r) => setParks(r.data));
  }, [search]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('nav.parks')}</h1>
      <p className="text-gray-500 mb-6">Explore Addis Ababa's parks and green spaces</p>
      <div className="relative mb-8 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('parks.search_placeholder')}
          className="pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      {parks.length === 0 ? (
        <p className="text-center text-gray-400 py-12">{t('parks.no_results')}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {parks.map((park) => <ParkCard key={park.id} park={park} />)}
        </div>
      )}
    </div>
  );
}
