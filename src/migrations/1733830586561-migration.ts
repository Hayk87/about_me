import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1733830586561 implements MigrationInterface {
  name = 'Migration1733830586561';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction-export-details" ADD "buy_price" double precision NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction-export-details" DROP COLUMN "buy_price"`,
    );
  }
}
