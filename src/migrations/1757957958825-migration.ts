import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1757957958825 implements MigrationInterface {
    name = 'Migration1757957958825'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_files" ("product_id" integer NOT NULL, "file_id" uuid NOT NULL, CONSTRAINT "PK_0a30fa26e62ccb29009c363e556" PRIMARY KEY ("product_id", "file_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d8a99936d05e5cc4688b828059" ON "product_files" ("product_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_59de9a6d2f3839532b438fffc9" ON "product_files" ("file_id") `);
        await queryRunner.query(`ALTER TABLE "product_files" ADD CONSTRAINT "FK_d8a99936d05e5cc4688b828059d" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_files" ADD CONSTRAINT "FK_59de9a6d2f3839532b438fffc9b" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_files" DROP CONSTRAINT "FK_59de9a6d2f3839532b438fffc9b"`);
        await queryRunner.query(`ALTER TABLE "product_files" DROP CONSTRAINT "FK_d8a99936d05e5cc4688b828059d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_59de9a6d2f3839532b438fffc9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d8a99936d05e5cc4688b828059"`);
        await queryRunner.query(`DROP TABLE "product_files"`);
    }

}
