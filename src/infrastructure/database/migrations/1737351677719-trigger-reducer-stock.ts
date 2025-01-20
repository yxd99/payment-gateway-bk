import { MigrationInterface, QueryRunner } from 'typeorm';

export class TriggerReducerStock1737351677719 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE OR REPLACE FUNCTION update_product_stock_after_payment()
            RETURNS TRIGGER AS $$
            BEGIN
                -- Verificamos si el status del pago es 'APPROVED'
                IF NEW.status = 'APPROVED' THEN
                    -- Actualizamos el stock del producto correspondiente
                    UPDATE products
                    SET stock = stock - NEW.product_quantity
                    WHERE id = NEW.product_id;
                END IF;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

    await queryRunner.query(`
            CREATE TRIGGER trigger_update_product_stock
            AFTER INSERT ON payments
            FOR EACH ROW
            EXECUTE FUNCTION update_product_stock_after_payment();
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar el trigger
    await queryRunner.query(`
            DROP TRIGGER IF EXISTS trigger_update_product_stock ON payments;
        `);

    // Eliminar el procedimiento almacenado
    await queryRunner.query(`
            DROP FUNCTION IF EXISTS update_product_stock_after_payment();
        `);
  }
}
