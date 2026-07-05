import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { DollarSign, Star, Clock, Calendar } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { parksApi, mediaUrl } from '../api/parks.api';
import type { Park, ReviewData } from '../api/parks.api';
import { useAuthStore } from '../store/auth.store';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import ImageCarousel from '../components/ImageCarousel';

// Fix leaflet default marker icons
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)['_getIconUrl'];
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface ReviewFormData { body: string; rating: number; }

const eventCategoryColors: Record<string, string> = {
  CULTURAL: 'bg-purple-100 text-purple-700',
  FESTIVAL: 'bg-pink-100 text-pink-700',
  COMMUNITY: 'bg-blue-100 text-blue-700',
  SEASONAL: 'bg-amber-100 text-amber-700',
};

export default function ParkDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [park, setPark] = useState<Park | null>(null);
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [reviewError, setReviewError] = useState('');

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ReviewFormData>({
    defaultValues: { rating: 5 },
  });

  const loadReviews = useCallback((parkId: string) => {
    parksApi.getReviews(parkId).then((r) => setReviewData(r.data));
  }, []);

  useEffect(() => {
    if (id) {
      parksApi.get(id).then((r) => {
        setPark(r.data);
        loadReviews(r.data.id);
      });
    }
  }, [id, loadReviews]);

  const onReviewSubmit = async (data: ReviewFormData) => {
    if (!park) return;
    try {
      setReviewError('');
      await parksApi.submitReview(park.id, { body: data.body, rating: Number(data.rating) });
      reset({ rating: 5 });
      loadReviews(park.id);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setReviewError(err.response?.data?.error ?? 'Failed to submit review');
      } else {
        setReviewError('Failed to submit review');
      }
    }
  };

  if (!park) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  const openingHoursEntries = Object.entries(park.openingHours as Record<string, string>);

  const serviceEmoji: Record<string, string> = {
    RESTAURANT: '🍽️', CAFETERIA: '☕', TOILET: '🚻',
    PARKING: '🅿️', FIRST_AID: '🏥', SHOP: '🛍️',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Image carousel */}
      <ImageCarousel images={park.media} title={park.name} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{park.name}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <Star size={14} className="text-amber-400 fill-amber-400" />
                {reviewData?.average?.toFixed(1) ?? '0.0'}/5 ({reviewData?.total ?? 0} reviews)
              </span>
              <span className="flex items-center gap-1">
                <DollarSign size={14} />
                {park.entryFee || 'Free'}
              </span>
            </div>
            <p className="text-gray-600 leading-relaxed">{park.description}</p>
          </div>

          {park.history && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">History</h2>
              <p className="text-gray-600 leading-relaxed">{park.history}</p>
            </div>
          )}

          {park.events.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Upcoming Events</h2>
              <div className="space-y-3">
                {park.events.map((e) => {
                  const img = e.imageUrl ? mediaUrl(e.imageUrl) : null;
                  return (
                    <div
                      key={e.id}
                      className="group flex overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="relative w-28 sm:w-36 shrink-0 overflow-hidden bg-gradient-to-br from-green-100 to-emerald-200">
                        {img ? (
                          <img
                            src={img}
                            alt={e.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-green-300 text-3xl select-none">
                            🎉
                          </div>
                        )}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col p-4">
                        <div className="mb-1.5">
                          <span
                            className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold tracking-wide ${eventCategoryColors[e.category] ?? 'bg-gray-100 text-gray-500'}`}
                          >
                            {e.category}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-2 group-hover:text-green-700 transition-colors">
                          {e.title}
                        </h3>
                        {e.description && (
                          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-2">
                            {e.description}
                          </p>
                        )}
                        <div className="mt-auto flex items-center gap-1.5 text-xs text-gray-500">
                          <Calendar size={12} />
                          {new Date(e.startDate).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reviews section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Reviews{' '}
              {reviewData && (
                <span className="text-sm font-normal text-gray-400">({reviewData.total})</span>
              )}
            </h2>

            {user ? (
              <form onSubmit={handleSubmit(onReviewSubmit)} className="bg-gray-50 rounded-xl p-4 mb-6">
                <h3 className="font-medium text-gray-800 mb-3">{t('reviews.write')}</h3>
                <div className="mb-3">
                  <label className="text-sm text-gray-600 block mb-1">{t('reviews.rating')}</label>
                  <select
                    {...register('rating')}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>{r} star{r !== 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <textarea
                  {...register('body', { required: true })}
                  rows={3}
                  placeholder={t('reviews.your_review')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 mb-3"
                />
                {reviewError && <p className="text-red-500 text-xs mb-2">{reviewError}</p>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-60 transition-colors"
                >
                  {isSubmitting ? 'Submitting...' : t('reviews.submit')}
                </button>
              </form>
            ) : (
              <p className="text-sm text-gray-500 bg-gray-50 rounded-xl p-4 mb-4">
                {t('reviews.login_required')}
              </p>
            )}

            <div className="space-y-3">
              {reviewData?.reviews.map((r) => (
                <div key={r.id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800 text-sm">{r.user.name}</span>
                    <div className="flex">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{r.body}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Clock size={16} /> Opening Hours
            </h3>
            {openingHoursEntries.map(([day, hours]) => (
              <div key={day} className="flex justify-between text-sm py-1 border-b border-gray-100 last:border-0">
                <span className="text-gray-500 capitalize">{day}</span>
                <span className="font-medium text-gray-700">{hours}</span>
              </div>
            ))}
          </div>

          {park.services.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-800 mb-3">Services</h3>
              <div className="space-y-2">
                {park.services.map((s) => (
                  <div key={s.id} className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{serviceEmoji[s.type] ?? '🏷️'}</span>
                    {s.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="h-48">
              <MapContainer
                center={[park.latitude, park.longitude]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[park.latitude, park.longitude]} />
              </MapContainer>
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${park.latitude},${park.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="block text-center text-sm text-green-600 hover:text-green-700 py-3 font-medium"
            >
              Get Directions →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
