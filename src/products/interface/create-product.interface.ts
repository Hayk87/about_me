export interface CreateProductInterface {
  title: Record<string, string>;
  category_id: number;
  measurement_id: number;
  quantity: number;
  buy_price: number;
  sell_price: number;
}
