import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
} from "sequelize-typescript";

@Table({
  tableName: "custom_field_options",
  underscored: true,
  timestamps: true,
})
export class CustomFieldOption extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column(DataType.UUID) declare custom_field_id: string;

  @Column(DataType.STRING) declare label: string;
  @Column(DataType.STRING) declare value: string;
  @Column(DataType.INTEGER) declare sort_order: number;
}
