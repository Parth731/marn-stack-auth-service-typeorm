import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTenantIdForeignKey1735393776968 implements MigrationInterface {
  name = 'AddTenantIdForeignKey1735393776968';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_d910616a293b89c84deb5b416f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "tanantId" TO "tenantId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_c58f7e88c286e5e3478960a998b" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_c58f7e88c286e5e3478960a998b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "tenantId" TO "tanantId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_d910616a293b89c84deb5b416f5" FOREIGN KEY ("tanantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
