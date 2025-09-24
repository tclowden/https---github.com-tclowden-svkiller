import { Model, PrimaryKey, Column, Default, IsUUID, DataType } from 'sequelize-typescript';


export abstract class BaseModel<T> extends Model<T> {
@IsUUID(4)
@Default(DataType.UUIDV4)
@PrimaryKey
@Column(DataType.UUID)
declare id: string;
}