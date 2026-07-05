import client from './client';

export interface Event {
  id: string; title: string; description: string;
  startDate: string; endDate: string;
  category: 'CULTURAL' | 'FESTIVAL' | 'COMMUNITY' | 'SEASONAL';
  imageUrl?: string;
  park: { id: string; name: string; slug: string };
}

export const eventsApi = {
  list: () => client.get<Event[]>('/events'),
};
