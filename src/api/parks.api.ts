import client from './client';

/** Resolve a relative /uploads/ path to an absolute URL */
export function mediaUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const base = (import.meta.env.VITE_API_URL as string).replace('/api', '');
  return `${base}${url}`;
}

export interface Park {
  id: string; name: string; slug: string; description: string; history?: string;
  latitude: number; longitude: number; openingHours: Record<string, string>;
  entryFee?: string; isActive: boolean;
  services: Array<{ id: string; type: string; name: string; description?: string }>;
  media: Array<{ id: string; url: string; type: string; isPrimary: boolean }>;
  events: Array<{ id: string; title: string; description?: string; startDate: string; endDate: string; category: string; imageUrl?: string }>;
  _count: { reviews: number };
}

export interface Review {
  id: string;
  userId: string;
  parkId: string;
  body: string;
  rating: number;
  createdAt: string;
  user: { id: string; name: string };
}

export interface ReviewData {
  reviews: Review[];
  average: number;
  total: number;
}

export const parksApi = {
  list: (search?: string) => client.get<Park[]>('/parks', { params: { search } }),
  get: (slug: string) => client.get<Park>(`/parks/${slug}`),
  getReviews: (id: string) => client.get<ReviewData>(`/parks/${id}/reviews`),
  submitReview: (id: string, data: { body: string; rating: number }) =>
    client.post(`/parks/${id}/reviews`, data),
};
