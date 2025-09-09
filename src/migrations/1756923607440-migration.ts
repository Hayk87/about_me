import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1756923607440 implements MigrationInterface {
    name = 'Migration1756923607440'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "type" character varying(255) NOT NULL, "directory" character varying(2000), "size" integer, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "offers" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "content" text NOT NULL, CONSTRAINT "PK_4c88e956195bba85977da21b8f4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "offer_files" ("offer_id" integer NOT NULL, "file_id" uuid NOT NULL, CONSTRAINT "PK_f0cddedbfbf30f29996c5e0a6b7" PRIMARY KEY ("offer_id", "file_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d1377c1f373ecde3484d31bc87" ON "offer_files" ("offer_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_7e6abea4fbb14a12a2caa31fac" ON "offer_files" ("file_id") `);
        await queryRunner.query(`ALTER TABLE "offer_files" ADD CONSTRAINT "FK_d1377c1f373ecde3484d31bc871" FOREIGN KEY ("offer_id") REFERENCES "offers"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "offer_files" ADD CONSTRAINT "FK_7e6abea4fbb14a12a2caa31fac6" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "offer_files" DROP CONSTRAINT "FK_7e6abea4fbb14a12a2caa31fac6"`);
        await queryRunner.query(`ALTER TABLE "offer_files" DROP CONSTRAINT "FK_d1377c1f373ecde3484d31bc871"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7e6abea4fbb14a12a2caa31fac"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d1377c1f373ecde3484d31bc87"`);
        await queryRunner.query(`DROP TABLE "offer_files"`);
        await queryRunner.query(`DROP TABLE "offers"`);
        await queryRunner.query(`DROP TABLE "files"`);
    }

}
