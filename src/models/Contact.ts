import { Table, Column, Model, DataType, PrimaryKey, Default } from 'sequelize-typescript';

@Table({ tableName: 'contacts', underscored: true, timestamps: true })
export class Contact extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column(DataType.STRING) first_name?: string;
  @Column(DataType.STRING) last_name?: string;
  @Column(DataType.STRING) phone_number?: string;
  @Column(DataType.STRING) status?: string;
  @Column(DataType.STRING) is_active?: string;
  @Column(DataType.STRING) street_address?: string;
  @Column(DataType.STRING) city?: string;
  @Column(DataType.STRING) state?: string;
  @Column(DataType.STRING) zip?: string;
  @Column(DataType.STRING) email?: string;
  @Column(DataType.STRING) roles?: string;
}