class SearchProductInterface {
  lang: string;
  all?: string;
  page: number;
  limit?: number;
  title?: string;
  category_id?: number;
  measurement_id?: number;
  quantity_from?: number;
  quantity_to?: number;
  buy_price_from?: number;
  buy_price_to?: number;
  sell_price_from?: number;
  sell_price_to?: number;
}
