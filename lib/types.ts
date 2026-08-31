export type Wine = {
  id: string;
  name: string;
  slug: string;
  vintage?: string | null;
  price?: number | null;
  compare_at_price?: number | null;
  image_url?: string | null;
  short_description?: string | null;
  score?: number | null;
  score_source?: string | null;
  stock?: number | null;
  producer?: { name: string } | null;
  country?: { name: string } | null;
  region?: { name: string } | null;
  category?: { name: string } | null;
};
