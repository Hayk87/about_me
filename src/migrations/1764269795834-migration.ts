import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1764269795834 implements MigrationInterface {
    name = 'Migration1764269795834'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product-categories" ADD "is_public" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product-categories" DROP COLUMN "is_public"`);
    }

}
