import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as Excel from 'exceljs';
import * as dayjs from 'dayjs';
import { TransactionService } from '../transaction/transaction.service';
import { In, And, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { SearchByDetailsInterface } from './interface/search-by-details.interface';
import { TotalReportInterface } from './interface/total-report.interface';

@Injectable()
export class ReportsService {
  constructor(private transactionService: TransactionService) {}

  getWhereConditionsForReportDetails(post: SearchByDetailsInterface) {
    const where: any = {};
    if (post.created_start && post.created_end) {
      where.created = And(
        MoreThanOrEqual(new Date(`${post.created_start} 00:00:00`)),
        LessThanOrEqual(new Date(`${post.created_end} 23:59:59`)),
      );
    } else if (post.created_start) {
      where.created = And(
        MoreThanOrEqual(new Date(`${post.created_start} 00:00:00`)),
      );
    } else if (post.created_end) {
      where.created = And(
        LessThanOrEqual(new Date(`${post.created_end} 23:59:59`)),
      );
    }
    if (post.amount_start && post.amount_end) {
      where.amount = And(
        MoreThanOrEqual(post.amount_start),
        LessThanOrEqual(post.amount_end),
      );
    } else if (post.amount_start) {
      where.amount = And(MoreThanOrEqual(post.amount_start));
    } else if (post.amount_end) {
      where.amount = And(LessThanOrEqual(post.amount_end));
    }
    if (post.product_ids && post.product_ids.length) {
      where.details = { product: { id: In(post.product_ids) } };
    }
    if (post.operator_ids && post.operator_ids.length) {
      where.operator = { id: In(post.operator_ids) };
    }
    if (post.staff_ids && post.staff_ids.length) {
      where.operator = { ...where.operator, staff: { id: In(post.staff_ids) } };
    }
    return where;
  }

  async getReportDetails(post: SearchByDetailsInterface, res: Response) {
    const relations = {
      details: {
        product: true,
        product_category: true,
        measurement: true,
      },
      operator: {
        staff: true,
      },
    };
    const where = this.getWhereConditionsForReportDetails(post);
    const requests: any = { imports: null, exports: null };
    switch (post.reportType) {
      case 'imports':
        requests.imports =
          this.transactionService.getTransactionImportRepository();
        break;
      case 'exports':
        requests.exports =
          this.transactionService.getTransactionExportRepository();
        break;
      case 'both':
        requests.imports =
          this.transactionService.getTransactionImportRepository();
        requests.exports =
          this.transactionService.getTransactionExportRepository();
        break;
    }
    const [resultsImports, resultsExports] = await Promise.all([
      requests.imports?.find({ relations, where }),
      requests.exports?.find({ relations, where }),
    ]);
    switch (post.resultType) {
      case 'result':
        return res.json({ resultsImports, resultsExports });
      default:
        return this.exportReportDetails(
          post,
          resultsImports,
          resultsExports,
          res,
        );
    }
  }

  async exportReportDetails(
    post: SearchByDetailsInterface,
    resultsImports: any,
    resultsExports: any,
    res: Response,
  ) {
    const fileName = 'report-with-details';
    switch (post.resultType) {
      case 'xls':
      case 'xlsx':
      case 'csv':
        this.excelBuilder(post.resultType, fileName, res, (worksheet: any) => {
          let i = 1;
          worksheet.mergeCells(`A${i}:J${i}`);
          worksheet.getCell(`A${i}`).value = post.trs?.report_by_details;
          if (resultsImports) {
            i += 2;
            worksheet.mergeCells(`A${i}:J${i}`);
            worksheet.getCell(`A${i}`).value =
              post.trs?.report_report_type_imports;
            i += 1;
            worksheet.getCell(`A${i}`).value = post.trs?.created_at;
            worksheet.getCell(`B${i}`).value = post.trs?.transaction_amount;
            worksheet.getCell(`C${i}`).value = post.trs?.system_user;
            worksheet.getCell(`D${i}`).value = post.trs?.staff_title;
            for (const item of resultsImports) {
              i += 1;
              worksheet.getCell(`A${i}`).value = dayjs(item.created).format(
                'DD/MM/YYYY',
              );
              worksheet.getCell(`B${i}`).value = item.amount;
              worksheet.getCell(`C${i}`).value =
                item.operator.first_name + ' ' + item.operator.last_name;
              worksheet.getCell(`D${i}`).value =
                item.operator.staff?.title?.[post.lngCode];
              i += 1;
              worksheet.getCell(`E${i}`).value =
                post.trs?.product_categories + ' / ' + post.trs?.products;
              worksheet.getCell(`F${i}`).value = post.trs?.products_quantity;
              worksheet.getCell(`G${i}`).value = post.trs?.products_buy_price;
              worksheet.getCell(`H${i}`).value = post.trs?.total_price;
              let amountTotal = 0;
              for (const row of item.details) {
                i += 1;
                worksheet.getCell(`E${i}`).value =
                  row.product_category.title?.[post.lngCode] +
                  ' / ' +
                  row.product.title?.[post.lngCode];
                worksheet.getCell(`F${i}`).value =
                  `${row.count} ${row.measurement.title?.[post.lngCode]}`;
                worksheet.getCell(`G${i}`).value = row.price;
                worksheet.getCell(`H${i}`).value = row.amount;
                amountTotal += row.amount;
              }
              i += 1;
              worksheet.getCell(`H${i}`).value = amountTotal;
            }
          }
          if (resultsExports) {
            i += 2;
            worksheet.mergeCells(`A${i}:J${i}`);
            worksheet.getCell(`A${i}`).value =
              post.trs?.report_report_type_exports;
            i += 1;
            worksheet.getCell(`A${i}`).value = post.trs?.created_at;
            worksheet.getCell(`B${i}`).value = post.trs?.transaction_amount;
            worksheet.getCell(`C${i}`).value = post.trs?.system_user;
            worksheet.getCell(`D${i}`).value = post.trs?.staff_title;
            for (const item of resultsExports) {
              i += 1;
              worksheet.getCell(`A${i}`).value = dayjs(item.created).format(
                'DD/MM/YYYY',
              );
              worksheet.getCell(`B${i}`).value = item.amount;
              worksheet.getCell(`C${i}`).value =
                item.operator.first_name + ' ' + item.operator.last_name;
              worksheet.getCell(`D${i}`).value =
                item.operator.staff?.title?.[post.lngCode];
              i += 1;
              worksheet.getCell(`E${i}`).value =
                post.trs?.product_categories + ' / ' + post.trs?.products;
              worksheet.getCell(`F${i}`).value = post.trs?.products_quantity;
              worksheet.getCell(`G${i}`).value = post.trs?.products_buy_price;
              worksheet.getCell(`H${i}`).value =
                post.trs?.total + ' / ' + post.trs?.products_buy_price;
              worksheet.getCell(`I${i}`).value = post.trs?.products_sell_price;
              worksheet.getCell(`J${i}`).value =
                post.trs?.total + ' / ' + post.trs?.products_sell_price;
              worksheet.getCell(`K${i}`).value =
                post.trs?.total + ' / ' + post.trs?.products_income;
              let buyAmountTotal = 0;
              let sellAmountTotal = 0;
              let incomeTotal = 0;
              for (const row of item.details) {
                i += 1;
                const buyAmount = row.buy_price * row.count;
                const amount = row.price * row.count;
                const income = (row.price - row.buy_price) * row.count;
                worksheet.getCell(`E${i}`).value =
                  row.product_category.title?.[post.lngCode] +
                  ' / ' +
                  row.product.title?.[post.lngCode];
                worksheet.getCell(`F${i}`).value =
                  `${row.count} ${row.measurement.title?.[post.lngCode]}`;
                worksheet.getCell(`G${i}`).value = row.buy_price;
                worksheet.getCell(`H${i}`).value = buyAmount;
                worksheet.getCell(`I${i}`).value = row.price;
                worksheet.getCell(`J${i}`).value = amount;
                worksheet.getCell(`K${i}`).value = income;
                buyAmountTotal += buyAmount;
                sellAmountTotal += amount;
                incomeTotal += income;
              }
              i += 1;
              worksheet.getCell(`H${i}`).value = buyAmountTotal;
              worksheet.getCell(`J${i}`).value = sellAmountTotal;
              worksheet.getCell(`K${i}`).value = incomeTotal;
            }
          }
        });
        break;
    }
  }

  async getTotalReport(post: TotalReportInterface, res: Response) {
    const requests: any = {
      imports: { instance: null, table: null },
      exports: { instance: null, table: null },
    };
    let where: string | string[] = [];
    const whereData: any = [];
    let i = 1;
    if (post.created_start) {
      where.push(`t.created >= $${i}`);
      whereData.push(`${post.created_start} 00:00:00`);
      i += 1;
    }
    if (post.created_end) {
      where.push(`t.created <= $${i}`);
      whereData.push(`${post.created_end} 23:59:59`);
      i += 1;
    }
    if (post.operator_ids && post.operator_ids.length) {
      where.push(`t.operator_id = ANY($${i})`);
      whereData.push(post.operator_ids);
    }
    where = where.join(' and ');
    if (where) {
      where = `where ${where}`;
    }
    switch (post.reportType) {
      case 'imports':
        requests.imports.instance =
          this.transactionService.getTransactionImportRepository();
        requests.imports.table = 'transaction-imports';
        break;
      case 'exports':
        requests.exports.instance =
          this.transactionService.getTransactionExportRepository();
        requests.exports.table = 'transaction-exports';
        break;
      case 'both':
        requests.imports.instance =
          this.transactionService.getTransactionImportRepository();
        requests.exports.instance =
          this.transactionService.getTransactionExportRepository();
        requests.imports.table = 'transaction-imports';
        requests.exports.table = 'transaction-exports';
        break;
    }
    const queryForImport = `select
                       t.operator_id,
                       su.first_name as operator_first_name,
                       su.last_name as operator_last_name,
                       su.email as operator_email,
                       sum(amount) as total_amount
                from "${requests.imports.table}" t
                left join "system-user" su on su.id = t.operator_id
                ${where}
                group by operator_id, su.first_name, su.last_name, su.email;`;
    const queryForExport = `select
                       t.operator_id,
                       su.first_name as operator_first_name,
                       su.last_name as operator_last_name,
                       su.email as operator_email,
                       sum(td.buy_price * td.count) as buy_amount,
                       sum(td.price * td.count) as sell_amount
                from "${requests.exports.table}" t
                left join "system-user" su on su.id = t.operator_id
                left join "transaction-export-details" td on t.id = td.transaction_id
                ${where}
                group by operator_id, su.first_name, su.last_name, su.email;`;
    const [resultsImports, resultsExports] = await Promise.all([
      requests.imports.instance?.query(queryForImport, whereData),
      requests.exports.instance?.query(queryForExport, whereData),
    ]);
    switch (post.resultType) {
      case 'result':
        return res.json({ resultsImports, resultsExports });
      default:
        return this.totalReportDetails(
          post,
          resultsImports,
          resultsExports,
          res,
        );
    }
  }

  totalReportDetails(
    post: SearchByDetailsInterface,
    resultsImports: any,
    resultsExports: any,
    res: Response,
  ) {
    const fileName = 'report-with-total';
    switch (post.resultType) {
      case 'xls':
      case 'xlsx':
      case 'csv':
        this.excelBuilder(post.resultType, fileName, res, (worksheet: any) => {
          let i = 1;
          worksheet.mergeCells(`A${i}:D${i}`);
          worksheet.getCell(`A${i}`).value = post.trs?.report_by_totality;
          if (resultsImports?.length) {
            i += 2;
            worksheet.mergeCells(`A${i}:D${i}`);
            worksheet.getCell(`A${i}`).value =
              post.trs?.report_report_type_imports;
            i += 1;
            worksheet.getCell(`A${i}`).value = post.trs?.first_name;
            worksheet.getCell(`B${i}`).value = post.trs?.last_name;
            worksheet.getCell(`C${i}`).value = post.trs?.email;
            worksheet.getCell(`D${i}`).value = post.trs?.transaction_amount;
            i += 1;
            let total = 0;
            for (const item of resultsImports) {
              total += item.total_amount;
              worksheet.getCell(`A${i}`).value = item.operator_first_name;
              worksheet.getCell(`B${i}`).value = item.operator_last_name;
              worksheet.getCell(`C${i}`).value = item.operator_email;
              worksheet.getCell(`D${i}`).value = item.total_amount;
              i += 1;
            }
            worksheet.getCell(`A${i}`).value = post.trs?.total;
            worksheet.getCell(`D${i}`).value = total;
          }
          if (resultsExports?.length) {
            i += 2;
            worksheet.mergeCells(`A${i}:D${i}`);
            worksheet.getCell(`A${i}`).value =
              post.trs?.report_report_type_exports;
            i += 1;
            worksheet.getCell(`A${i}`).value = post.trs?.first_name;
            worksheet.getCell(`B${i}`).value = post.trs?.last_name;
            worksheet.getCell(`C${i}`).value = post.trs?.email;
            worksheet.getCell(`D${i}`).value = post.trs?.products_buy_price;
            worksheet.getCell(`E${i}`).value = post.trs?.products_sell_price;
            worksheet.getCell(`F${i}`).value = post.trs?.products_income;
            i += 1;
            let buyPriceTotal = 0;
            let sellPriceTotal = 0;
            let incomeTotal = 0;
            for (const item of resultsExports) {
              const income = item.sell_amount - item.buy_amount;
              buyPriceTotal += item.buy_amount;
              sellPriceTotal += item.sell_amount;
              incomeTotal += income;
              worksheet.getCell(`A${i}`).value = item.operator_first_name;
              worksheet.getCell(`B${i}`).value = item.operator_last_name;
              worksheet.getCell(`C${i}`).value = item.operator_email;
              worksheet.getCell(`D${i}`).value = item.buy_amount;
              worksheet.getCell(`E${i}`).value = item.sell_amount;
              worksheet.getCell(`F${i}`).value = income;
              i += 1;
            }
            worksheet.getCell(`A${i}`).value = post.trs?.total;
            worksheet.getCell(`D${i}`).value = buyPriceTotal;
            worksheet.getCell(`E${i}`).value = sellPriceTotal;
            worksheet.getCell(`F${i}`).value = incomeTotal;
          }
        });
        break;
    }
  }

  async excelBuilder(
    extension: string,
    filename: string,
    res: Response,
    cb: (w: any) => void,
  ) {
    const workbook = new Excel.Workbook();
    workbook.addWorksheet('My Sheet');
    const worksheet = workbook.getWorksheet(1);
    await cb(worksheet);
    const fileName = `${filename}.${extension}`;
    const fileData =
      await workbook[extension === 'csv' ? 'csv' : 'xlsx'].writeBuffer();
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.end(fileData);
  }
}
