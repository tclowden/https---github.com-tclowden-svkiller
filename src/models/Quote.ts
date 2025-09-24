import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
} from "sequelize-typescript";

@Table({ tableName: "quotes", underscored: true, timestamps: true })
export class Quote extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column(DataType.STRING) name?: string;
  @Column(DataType.STRING) opportunity?: string;
  @Column(DataType.UUID) opportunity_id?: string;
  @Column(DataType.STRING) customer?: string;
  @Column(DataType.UUID) customer_id?: string;
  @Column(DataType.STRING) sales_order?: string;
  @Column(DataType.STRING) project_manager?: string;
  @Column(DataType.STRING) sales_rep?: string;
  @Column(DataType.STRING) associated_custom_field_ids?: string;
  @Column(DataType.STRING) transaction_type?: string;
}
