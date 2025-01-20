import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreatePaymentsTable1736961694777 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('payments');
    if (!tableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'products',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            { name: 'name', type: 'text' },
            { name: 'price', type: 'integer' },
            { name: 'image_url', type: 'text' },
            { name: 'stock', type: 'integer' },
            {
              name: 'deleted_at',
              type: 'timestamp',
              isNullable: true,
            },
            {
              name: 'created_at',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
            {
              name: 'updated_at',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
              onUpdate: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
      );

      await queryRunner.createTable(
        new Table({
          name: 'payments',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            { name: 'transaction_id', type: 'text' },
            { name: 'amount', type: 'decimal' },
            { name: 'reference', type: 'text' },
            { name: 'product_id', type: 'uuid' },
            {
              name: 'created_at',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
      );

      await queryRunner.createForeignKey(
        'payments',
        new TableForeignKey({
          columnNames: ['product_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'products',
          onDelete: 'CASCADE',
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const productsTableExists = await queryRunner.hasTable('payments');
    const paymentsTableExists = await queryRunner.hasTable('payments');
    if (paymentsTableExists) {
      const table = await queryRunner.getTable('payments');
      const foreignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('product_id') !== -1,
      );

      if (foreignKey) {
        await queryRunner.dropForeignKey('payments', foreignKey);
      }

      await queryRunner.dropTable('payments');
    }
    if (productsTableExists) {
      await queryRunner.dropTable('products');
    }
  }
}
