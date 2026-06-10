import client from './client';

export interface Park {
  id: string; name: string; slug: string; description: string; history?: string;
  latitude: number; longitude: number; openingHours: Record<string, string>;
  entryFee?: string; isActive: boolean;
  services: Array<{ id: string; type: string; name: string; description?: string }>;
  media: Array<{ id: string; url: string; type: string; isPrimary: boolean }>;
  events: Array<{ id: string; title: string; startDate: string; endDate: string; category: string }>;
  _count: { reviews: number };
}

export interface ReviewData {
  reviews: Array<{ id: string; body: string; rating: number; createdAt: string; user: { name: string } }>;
  average: number;
  total: number;
}

export const parksApi = {
  list: (search?: string) => client.get<Park[]>('/parks', { params: { search } }),
  get: (id: string) => client.get<Park>(`/parks/${id}`),
  getReviews: (id: string) => client.get<ReviewData>(`/parks/${id}/reviews`),
  submitReview: (id: string, data: { body: string; rating: number }) =>
    client.post(`/parks/${id}/reviews`, data),
};
