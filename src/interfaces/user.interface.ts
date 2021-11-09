import { Model } from 'sequelize';

interface Attributes {
  id: number;
  name?: string;
  email: string;
  password: string;
  type: number;
  token?: string;
  status: number;
  subscribed: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
  updatedBy: number;
  deletedAt?: Date;
}

export default interface User extends Model<Attributes>, Attributes {}
