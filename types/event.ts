export interface Event {
  id: string;
  title: string;
  description: string | null;
  src: string | null;
  alt: string | null;
  badge: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export type EventOption = Pick<Event, "id" | "title"> & {
  badge?: string | null;
};
