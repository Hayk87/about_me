import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1757958603151 implements MigrationInterface {
    name = 'Migration1757958603151'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "main_photo_id" uuid`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "UQ_1c0db21f78126ea2c70de4059a8" UNIQUE ("main_photo_id")`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_1c0db21f78126ea2c70de4059a8" FOREIGN KEY ("main_photo_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_1c0db21f78126ea2c70de4059a8"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "UQ_1c0db21f78126ea2c70de4059a8"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "main_photo_id"`);
    }

}
