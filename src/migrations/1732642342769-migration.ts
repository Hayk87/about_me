import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1732642342769 implements MigrationInterface {
  name = 'Migration1732642342769';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "translates" ("id" SERIAL NOT NULL, "key" character varying(255) NOT NULL, "value" jsonb NOT NULL, CONSTRAINT "UQ_9610569a9d0644b5260dbdcc3d6" UNIQUE ("key"), CONSTRAINT "PK_9108f7b22b9f9d8b30c8c19104a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rights" ("id" SERIAL NOT NULL, "code" character varying(150) NOT NULL, "title" jsonb NOT NULL, CONSTRAINT "UQ_a77fdb5f257f971af5484e3c62c" UNIQUE ("code"), CONSTRAINT "PK_afafc4832726585c98fff471fea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "staffs" ("id" SERIAL NOT NULL, "title" jsonb NOT NULL, CONSTRAINT "PK_f3fec5e06209b46afdf8accf117" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction-exports" ("id" SERIAL NOT NULL, "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "amount" double precision NOT NULL, "operator_id" integer, CONSTRAINT "PK_98098d3166c9f76bd9751fb8bae" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction-export-details" ("id" SERIAL NOT NULL, "price" double precision NOT NULL, "count" double precision NOT NULL, "amount" double precision NOT NULL, "transaction_id" integer, "product_id" integer, "product_category_id" integer, "measurement_id" integer, CONSTRAINT "PK_e0d9125a027ed0dcad638812c75" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product-categories" ("id" SERIAL NOT NULL, "title" jsonb NOT NULL, "is_deleted" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_f9bdf09ab48752543ef050654db" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction-import-details" ("id" SERIAL NOT NULL, "price" double precision NOT NULL, "count" double precision NOT NULL, "amount" double precision NOT NULL, "transaction_id" integer, "product_id" integer, "product_category_id" integer, "measurement_id" integer, CONSTRAINT "PK_0c7f0e1bf65b13e9f1da3d6aedf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "measurements" ("id" SERIAL NOT NULL, "title" jsonb NOT NULL, "is_deleted" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_3c0e7812563f27fd68e8271661b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "products" ("id" SERIAL NOT NULL, "title" jsonb NOT NULL, "is_deleted" boolean NOT NULL DEFAULT false, "quantity" double precision NOT NULL, "buy_price" double precision NOT NULL, "sell_price" double precision NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "measurement_id" integer, "category_id" integer, "created_system_user_id" integer, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "system-user" ("id" SERIAL NOT NULL, "first_name" character varying(255) NOT NULL, "last_name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(500) NOT NULL, "secret" character varying(64) NOT NULL, "is_root" boolean NOT NULL DEFAULT false, "is_blocked" boolean NOT NULL DEFAULT false, "is_deleted" boolean NOT NULL DEFAULT false, "authenticator" jsonb, "authenticator_enabled" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "staff_id" integer, CONSTRAINT "UQ_e0be12f1c48c70dbc02e5a7b99b" UNIQUE ("email"), CONSTRAINT "PK_d24910007d529f4fbcb99575cc5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction-imports" ("id" SERIAL NOT NULL, "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "amount" double precision NOT NULL, "operator_id" integer, CONSTRAINT "PK_24b83b5a5472439753008617a13" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "system-user-tokens" ("id" SERIAL NOT NULL, "token" character varying(255) NOT NULL, "login_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "expiration" TIMESTAMP WITH TIME ZONE NOT NULL, "logout_at" TIMESTAMP WITH TIME ZONE, "system_user" integer, CONSTRAINT "PK_fc0165ba470497bfab41a37a6ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "staffs_rights" ("staff_id" integer NOT NULL, "right_id" integer NOT NULL, CONSTRAINT "PK_465eeace232439a344d856e2e16" PRIMARY KEY ("staff_id", "right_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e94577f1d9153d74368d85ed14" ON "staffs_rights" ("staff_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ce1d12a178f4366caf5f44e9dc" ON "staffs_rights" ("right_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction-exports" ADD CONSTRAINT "FK_0685a1c12e5c3b9a7edfa752106" FOREIGN KEY ("operator_id") REFERENCES "system-user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction-export-details" ADD CONSTRAINT "FK_7fa802cb598b1747cd3cc38d715" FOREIGN KEY ("transaction_id") REFERENCES "transaction-exports"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction-export-details" ADD CONSTRAINT "FK_3f5a265e1110242270654580b94" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction-export-details" ADD CONSTRAINT "FK_9244cedfbe8c93423e78abc4a34" FOREIGN KEY ("product_category_id") REFERENCES "product-categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction-export-details" ADD CONSTRAINT "FK_4e921f7892ff25e9a933d8cb130" FOREIGN KEY ("measurement_id") REFERENCES "measurements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction-import-details" ADD CONSTRAINT "FK_bd832d7e93835a22345ab8f00a7" FOREIGN KEY ("transaction_id") REFERENCES "transaction-imports"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction-import-details" ADD CONSTRAINT "FK_77212c338f8ce9df352a5c626ca" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction-import-details" ADD CONSTRAINT "FK_a4fa3cec5a1fce88f1bc0812543" FOREIGN KEY ("product_category_id") REFERENCES "product-categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction-import-details" ADD CONSTRAINT "FK_abf5507b34a2b0e3d56f3ca57f3" FOREIGN KEY ("measurement_id") REFERENCES "measurements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_ba489b480d7cdc158a358dfb974" FOREIGN KEY ("measurement_id") REFERENCES "measurements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_9a5f6868c96e0069e699f33e124" FOREIGN KEY ("category_id") REFERENCES "product-categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_4256a733f7f0205c9ab0e30191a" FOREIGN KEY ("created_system_user_id") REFERENCES "system-user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "system-user" ADD CONSTRAINT "FK_379e30424ed902335a205a42aa6" FOREIGN KEY ("staff_id") REFERENCES "staffs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction-imports" ADD CONSTRAINT "FK_adb84fde2c1172bd630114d2f18" FOREIGN KEY ("operator_id") REFERENCES "system-user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "system-user-tokens" ADD CONSTRAINT "FK_5aeca0019c522aee002529a5766" FOREIGN KEY ("system_user") REFERENCES "system-user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "staffs_rights" ADD CONSTRAINT "FK_e94577f1d9153d74368d85ed149" FOREIGN KEY ("staff_id") REFERENCES "staffs"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "staffs_rights" ADD CONSTRAINT "FK_ce1d12a178f4366caf5f44e9dc1" FOREIGN KEY ("right_id") REFERENCES "rights"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "staffs_rights" DROP CONSTRAINT "FK_ce1d12a178f4366caf5f44e9dc1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "staffs_rights" DROP CONSTRAINT "FK_e94577f1d9153d74368d85ed149"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system-user-tokens" DROP CONSTRAINT "FK_5aeca0019c522aee002529a5766"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction-imports" DROP CONSTRAINT "FK_adb84fde2c1172bd630114d2f18"`,
    );
    await queryRunner.query(
      `ALTER TABLE "system-user" DROP CONSTRAINT "FK_379e30424ed902335a205a42aa6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_4256a733f7f0205c9ab0e30191a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_9a5f6868c96e0069e699f33e124"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_ba489b480d7cdc158a358dfb974"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction-import-details" DROP CONSTRAINT "FK_abf5507b34a2b0e3d56f3ca57f3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction-import-details" DROP CONSTRAINT "FK_a4fa3cec5a1fce88f1bc0812543"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction-import-details" DROP CONSTRAINT "FK_77212c338f8ce9df352a5c626ca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction-import-details" DROP CONSTRAINT "FK_bd832d7e93835a22345ab8f00a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction-export-details" DROP CONSTRAINT "FK_4e921f7892ff25e9a933d8cb130"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction-export-details" DROP CONSTRAINT "FK_9244cedfbe8c93423e78abc4a34"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction-export-details" DROP CONSTRAINT "FK_3f5a265e1110242270654580b94"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction-export-details" DROP CONSTRAINT "FK_7fa802cb598b1747cd3cc38d715"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction-exports" DROP CONSTRAINT "FK_0685a1c12e5c3b9a7edfa752106"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ce1d12a178f4366caf5f44e9dc"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e94577f1d9153d74368d85ed14"`,
    );
    await queryRunner.query(`DROP TABLE "staffs_rights"`);
    await queryRunner.query(`DROP TABLE "system-user-tokens"`);
    await queryRunner.query(`DROP TABLE "transaction-imports"`);
    await queryRunner.query(`DROP TABLE "system-user"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "measurements"`);
    await queryRunner.query(`DROP TABLE "transaction-import-details"`);
    await queryRunner.query(`DROP TABLE "product-categories"`);
    await queryRunner.query(`DROP TABLE "transaction-export-details"`);
    await queryRunner.query(`DROP TABLE "transaction-exports"`);
    await queryRunner.query(`DROP TABLE "staffs"`);
    await queryRunner.query(`DROP TABLE "rights"`);
    await queryRunner.query(`DROP TABLE "translates"`);
  }
}
