import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
} from "sequelize-typescript";

@Table({ tableName: "custom_fields", underscored: true, timestamps: true })
export class CustomField extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column(DataType.STRING) declare name: string;
  @Column(DataType.STRING) declare type: string;
  @Column(DataType.JSONB) declare config: Record<string, any> | null;
}
