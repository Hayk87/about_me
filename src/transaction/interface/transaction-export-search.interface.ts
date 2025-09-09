export interface TransactionExportSearchInterface {
  page: number;
  limit?: number;
  created_from?: string;
  created_to?: string;
  amount_from?: number;
  amount_to?: number;
  system_user_id?: number;
}
