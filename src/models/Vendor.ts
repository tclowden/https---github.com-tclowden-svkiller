import { Table, Column, Model, DataType, PrimaryKey, Default } from 'sequelize-typescript';

@Table({ tableName: 'vendors', underscored: true, timestamps: true })
export class Vendor extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column(DataType.STRING) name?: string;
  @Column(DataType.STRING) street_address?: string;
  @Column(DataType.STRING) city?: string;
  @Column(DataType.STRING) state?: string;
  @Column(DataType.STRING) zip?: string;
  @Column(DataType.STRING) payment_terms?: string;
  @Column(DataType.STRING) primary_contact?: string;
  @Column(DataType.STRING) primary_phone_number?: string;
  @Column(DataType.STRING) primary_email?: string;
  @Column(DataType.STRING) billing_contact?: string;
  @Column(DataType.STRING) billing_phone_number?: string;
  @Column(DataType.STRING) billing_email?: string;
  @Column(DataType.STRING) associated_custom_field_ids?: string;
}