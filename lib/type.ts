export interface Book {
  id: string;
  name: string;
  uri: string;
  type: string;
  size: number;
  addedAt: number;
  lastReadAt: number;
  meta?: Metadata;
}

export interface Metadata {
  cover?: string | null;
  author?: string | null;
  title?: string | null;
  description?: string | null;
  language?: string | null;
  publisher?: string | null;
  rights?: string | null;
}
