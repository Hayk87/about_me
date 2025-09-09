class SearchProductInterface {
  lang: string;
  all?: string;
  page: number;
  limit?: number;
  title?: string;
  code?: string;
  category_id?: number;
  price_from?: number;
  price_to?: number;
}
