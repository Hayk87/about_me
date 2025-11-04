import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1762283991562 implements MigrationInterface {
    name = 'Migration1762283991562'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "short_content" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "short_content"`);
    }

}
