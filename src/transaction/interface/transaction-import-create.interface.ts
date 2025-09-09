export interface TransactionDetailsInterface {
  product_id: number;
  count: number;
}

export interface TransactionImportCreateInterface {
  details: TransactionDetailsInterface[];
}
