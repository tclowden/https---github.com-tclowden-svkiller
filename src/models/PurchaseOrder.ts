import { Table, Column, Model, DataType, PrimaryKey, Default } from 'sequelize-typescript';

@Table({ tableName: 'purchase_orders', underscored: true, timestamps: true })
export class PurchaseOrder extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column(DataType.STRING) name?: string;
  @Column(DataType.STRING) transaction_type?: string;
  @Column(DataType.STRING) associated_custom_field_ids?: string;
}