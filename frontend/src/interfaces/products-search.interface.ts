export interface ProductsSearchInterface {
  lang: string;
  page: number | string;
  limit?: number;
  title?: string;
  category_id?: number | string;
  measurement_id?: number | string;
  quantity_from?: number | string;
  quantity_to?: number | string;
  buy_price_from?: number | string;
  buy_price_to?: number | string;
  sell_price_from?: number | string;
  sell_price_to?: number | string;
}
