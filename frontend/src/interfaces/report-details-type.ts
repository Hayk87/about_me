export interface ReportDetailsType {
  resultType: 'result' | 'xls' | 'xlsx' | 'csv';
  reportType: 'imports' | 'exports' | 'both';
  created_start: string;
  created_end: string;
  amount_start?: number;
  amount_end?: number;
  product_ids?: number[];
  operator_ids?: number[];
  staff_ids?: number[];
  trs?: object;
  lngCode?: string;
}