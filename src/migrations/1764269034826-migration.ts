import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1764269034826 implements MigrationInterface {
    name = 'Migration1764269034826'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "translates" ("id" SERIAL NOT NULL, "key" character varying(255) NOT NULL, "value" jsonb NOT NULL, CONSTRAINT "UQ_9610569a9d0644b5260dbdcc3d6" UNIQUE ("key"), CONSTRAINT "PK_9108f7b22b9f9d8b30c8c19104a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rights" ("id" SERIAL NOT NULL, "code" character varying(150) NOT NULL, "title" jsonb NOT NULL, CONSTRAINT "UQ_a77fdb5f257f971af5484e3c62c" UNIQUE ("code"), CONSTRAINT "PK_afafc4832726585c98fff471fea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "staffs" ("id" SERIAL NOT NULL, "title" jsonb NOT NULL, CONSTRAINT "PK_f3fec5e06209b46afdf8accf117" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product-categories" ("id" SERIAL NOT NULL, "title" jsonb NOT NULL, "code" character varying(255) NOT NULL, "is_deleted" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_f9bdf09ab48752543ef050654db" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "offers" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "content" text NOT NULL, CONSTRAINT "PK_4c88e956195bba85977da21b8f4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "type" character varying(255) NOT NULL, "directory" character varying(2000), "size" integer, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "code" character varying(255) NOT NULL, "link" character varying, "title" jsonb NOT NULL, "short_content" jsonb, "content" jsonb, "is_public" boolean NOT NULL DEFAULT false, "order" integer NOT NULL DEFAULT '0', "is_deleted" boolean NOT NULL DEFAULT false, "price" integer, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "category_id" integer, "created_system_user_id" integer, "main_photo_id" uuid, CONSTRAINT "UQ_7cfc24d6c24f0ec91294003d6b8" UNIQUE ("code"), CONSTRAINT "REL_1c0db21f78126ea2c70de4059a" UNIQUE ("main_photo_id"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "system-user" ("id" SERIAL NOT NULL, "first_name" character varying(255) NOT NULL, "last_name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(500) NOT NULL, "secret" character varying(64) NOT NULL, "is_root" boolean NOT NULL DEFAULT false, "is_blocked" boolean NOT NULL DEFAULT false, "is_deleted" boolean NOT NULL DEFAULT false, "authenticator" jsonb, "authenticator_enabled" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "staff_id" integer, CONSTRAINT "UQ_e0be12f1c48c70dbc02e5a7b99b" UNIQUE ("email"), CONSTRAINT "PK_d24910007d529f4fbcb99575cc5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "system-user-tokens" ("id" SERIAL NOT NULL, "token" character varying(255) NOT NULL, "login_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "expiration" TIMESTAMP WITH TIME ZONE NOT NULL, "logout_at" TIMESTAMP WITH TIME ZONE, "system_user" integer, CONSTRAINT "PK_fc0165ba470497bfab41a37a6ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "staffs_rights" ("staff_id" integer NOT NULL, "right_id" integer NOT NULL, CONSTRAINT "PK_465eeace232439a344d856e2e16" PRIMARY KEY ("staff_id", "right_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e94577f1d9153d74368d85ed14" ON "staffs_rights" ("staff_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_ce1d12a178f4366caf5f44e9dc" ON "staffs_rights" ("right_id") `);
        await queryRunner.query(`CREATE TABLE "offer_files" ("offer_id" integer NOT NULL, "file_id" uuid NOT NULL, CONSTRAINT "PK_f0cddedbfbf30f29996c5e0a6b7" PRIMARY KEY ("offer_id", "file_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d1377c1f373ecde3484d31bc87" ON "offer_files" ("offer_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_7e6abea4fbb14a12a2caa31fac" ON "offer_files" ("file_id") `);
        await queryRunner.query(`CREATE TABLE "product_files" ("product_id" integer NOT NULL, "file_id" uuid NOT NULL, CONSTRAINT "PK_0a30fa26e62ccb29009c363e556" PRIMARY KEY ("product_id", "file_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d8a99936d05e5cc4688b828059" ON "product_files" ("product_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_59de9a6d2f3839532b438fffc9" ON "product_files" ("file_id") `);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_9a5f6868c96e0069e699f33e124" FOREIGN KEY ("category_id") REFERENCES "product-categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_4256a733f7f0205c9ab0e30191a" FOREIGN KEY ("created_system_user_id") REFERENCES "system-user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_1c0db21f78126ea2c70de4059a8" FOREIGN KEY ("main_photo_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "system-user" ADD CONSTRAINT "FK_379e30424ed902335a205a42aa6" FOREIGN KEY ("staff_id") REFERENCES "staffs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "system-user-tokens" ADD CONSTRAINT "FK_5aeca0019c522aee002529a5766" FOREIGN KEY ("system_user") REFERENCES "system-user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "staffs_rights" ADD CONSTRAINT "FK_e94577f1d9153d74368d85ed149" FOREIGN KEY ("staff_id") REFERENCES "staffs"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "staffs_rights" ADD CONSTRAINT "FK_ce1d12a178f4366caf5f44e9dc1" FOREIGN KEY ("right_id") REFERENCES "rights"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "offer_files" ADD CONSTRAINT "FK_d1377c1f373ecde3484d31bc871" FOREIGN KEY ("offer_id") REFERENCES "offers"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "offer_files" ADD CONSTRAINT "FK_7e6abea4fbb14a12a2caa31fac6" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_files" ADD CONSTRAINT "FK_d8a99936d05e5cc4688b828059d" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_files" ADD CONSTRAINT "FK_59de9a6d2f3839532b438fffc9b" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_files" DROP CONSTRAINT "FK_59de9a6d2f3839532b438fffc9b"`);
        await queryRunner.query(`ALTER TABLE "product_files" DROP CONSTRAINT "FK_d8a99936d05e5cc4688b828059d"`);
        await queryRunner.query(`ALTER TABLE "offer_files" DROP CONSTRAINT "FK_7e6abea4fbb14a12a2caa31fac6"`);
        await queryRunner.query(`ALTER TABLE "offer_files" DROP CONSTRAINT "FK_d1377c1f373ecde3484d31bc871"`);
        await queryRunner.query(`ALTER TABLE "staffs_rights" DROP CONSTRAINT "FK_ce1d12a178f4366caf5f44e9dc1"`);
        await queryRunner.query(`ALTER TABLE "staffs_rights" DROP CONSTRAINT "FK_e94577f1d9153d74368d85ed149"`);
        await queryRunner.query(`ALTER TABLE "system-user-tokens" DROP CONSTRAINT "FK_5aeca0019c522aee002529a5766"`);
        await queryRunner.query(`ALTER TABLE "system-user" DROP CONSTRAINT "FK_379e30424ed902335a205a42aa6"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_1c0db21f78126ea2c70de4059a8"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_4256a733f7f0205c9ab0e30191a"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_9a5f6868c96e0069e699f33e124"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_59de9a6d2f3839532b438fffc9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d8a99936d05e5cc4688b828059"`);
        await queryRunner.query(`DROP TABLE "product_files"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7e6abea4fbb14a12a2caa31fac"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d1377c1f373ecde3484d31bc87"`);
        await queryRunner.query(`DROP TABLE "offer_files"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ce1d12a178f4366caf5f44e9dc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e94577f1d9153d74368d85ed14"`);
        await queryRunner.query(`DROP TABLE "staffs_rights"`);
        await queryRunner.query(`DROP TABLE "system-user-tokens"`);
        await queryRunner.query(`DROP TABLE "system-user"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "files"`);
        await queryRunner.query(`DROP TABLE "offers"`);
        await queryRunner.query(`DROP TABLE "product-categories"`);
        await queryRunner.query(`DROP TABLE "staffs"`);
        await queryRunner.query(`DROP TABLE "rights"`);
        await queryRunner.query(`DROP TABLE "translates"`);
    }

}
