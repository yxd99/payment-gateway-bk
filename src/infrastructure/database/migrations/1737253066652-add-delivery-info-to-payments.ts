import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddDeliveryInfoToPayments1737253066652
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('payments', [
      new TableColumn({
        name: 'status',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'address',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'city',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'phone',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'department',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'product_quantity',
        type: 'int',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('payments', [
      'status',
      'address',
      'city',
      'phone',
      'department',
      'product_quantity',
    ]);
  }
}
