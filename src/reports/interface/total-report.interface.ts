export interface TotalReportInterface {
  resultType: 'result' | 'xls' | 'xlsx' | 'csv';
  reportType: 'imports' | 'exports' | 'both';
  created_start?: string;
  created_end?: string;
  operator_ids?: number[];
  trs?: any;
}
