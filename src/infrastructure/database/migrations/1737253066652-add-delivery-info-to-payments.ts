import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddDeliveryInfoToPayments1737253066652
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('payments');

    const columnsToAdd = [
      { name: 'status', type: 'varchar' },
      { name: 'address', type: 'varchar' },
      { name: 'city', type: 'varchar' },
      { name: 'phone', type: 'varchar' },
      { name: 'department', type: 'varchar' },
      { name: 'product_quantity', type: 'int' },
    ];

    columnsToAdd.forEach(async (column) => {
      const existingColumn = table.columns.find(
        (col) => col.name === column.name,
      );
      if (!existingColumn) {
        await queryRunner.addColumn(
          'payments',
          new TableColumn({
            name: column.name,
            type: column.type,
            isNullable: true,
          }),
        );
      }
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('payments');

    const columnsToDrop = [
      'status',
      'address',
      'city',
      'phone',
      'department',
      'product_quantity',
    ];

    columnsToDrop.forEach(async (columnName) => {
      const existingColumn = table.columns.find(
        (col) => col.name === columnName,
      );
      if (existingColumn) {
        await queryRunner.dropColumn('payments', columnName);
      }
    });
  }
}
