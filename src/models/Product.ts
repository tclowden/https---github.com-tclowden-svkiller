import { Table, Column, Model, DataType, PrimaryKey, Default } from 'sequelize-typescript';

@Table({ tableName: 'products', underscored: true, timestamps: true })
export class Product extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column(DataType.STRING) name?: string;
  @Column(DataType.STRING) unit_of_measure?: string;
  @Column(DataType.STRING) cost_per_uom?: string;
}