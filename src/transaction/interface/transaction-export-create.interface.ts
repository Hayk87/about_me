export interface TransactionExportDetailsInterface {
  product_id: number;
  count: number;
  buy_price: number;
}

export interface TransactionExportCreateInterface {
  details: TransactionExportDetailsInterface[];
}
