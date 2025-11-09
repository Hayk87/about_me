import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1762704467961 implements MigrationInterface {
    name = 'Migration1762704467961'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "is_public" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "products" ADD "order" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "order"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "is_public"`);
    }

}
