import { Table, Column, Model, DataType, PrimaryKey, Default } from 'sequelize-typescript';

@Table({ tableName: 'responses', underscored: true, timestamps: true })
export class Response extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column(DataType.STRING) associated_transaction_id?: string;
  @Column(DataType.STRING) associated_transaction_type?: string;
  @Column(DataType.STRING) associated_field_name?: string;
  @Column(DataType.STRING) value?: string;
}