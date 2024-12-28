import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTenantIdForeignKey1735386467762 implements MigrationInterface {
  name = 'AddTenantIdForeignKey1735386467762';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "tanantId" integer`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_d910616a293b89c84deb5b416f5" FOREIGN KEY ("tanantId") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_d910616a293b89c84deb5b416f5"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "tanantId"`);
  }
}
