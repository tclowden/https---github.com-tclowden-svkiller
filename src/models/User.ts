import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
} from 'sequelize-typescript';

@Table({ tableName: 'users', underscored: true, timestamps: true })
export class User extends Model<User> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare email: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare name: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare password_hash: string | null;

  // Sequelize will map these automatically because of `timestamps: true` + `underscored: true`
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}
