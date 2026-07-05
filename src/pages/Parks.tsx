import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { parksApi } from '../api/parks.api';
import type { Park } from '../api/parks.api';
import ParkCard from '../components/ParkCard';
import PageHeader from '../components/PageHeader';
import Reveal from '../components/Reveal';

export default function Parks() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [parks, setParks] = useState<Park[]>([]);
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    parksApi.list(search || undefined).then((r) => setParks(r.data)).finally(() => setLoading(false));
  }, [search]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <PageHeader
        eyebrow="Green Spaces"
        title="Parks & gardens"
        subtitle="Explore Addis Ababa's parks, gardens and green spaces — find one near you."
      >
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('parks.search_placeholder')}
            aria-label="Search parks"
            className="pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-full text-sm w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-gold/60 focus:border-transparent transition"
          />
        </div>
      </PageHeader>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 rounded-3xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : parks.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4 select-none">🌿</div>
            <p className="font-display text-xl text-forest-ink mb-1">{t('parks.no_results')}</p>
            <p className="text-gray-400 text-sm">Try a different search term.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-6">
              {parks.length} {parks.length === 1 ? 'park' : 'parks'}
              {search && <> matching “<span className="text-forest-ink font-medium">{search}</span>”</>}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {parks.map((park, i) => (
                <Reveal key={park.id} delay={(i % 3) * 80}>
                  <ParkCard park={park} />
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
