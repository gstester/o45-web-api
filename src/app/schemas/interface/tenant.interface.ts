import { Document } from 'mongoose';

export interface ITenantSchema extends Document {
  id: string;
  name: string;
  isChild: boolean;
  moveIn: Date,
  moveOut: Date,
  createdAt: Date;
  updatedAt: Date;
}
