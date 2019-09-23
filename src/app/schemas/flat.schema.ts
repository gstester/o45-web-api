import { Schema } from 'mongoose';
import { FlatType } from '../models/enumeration';
import { mapEnum } from '../../common/util';

export const FlatSchema = new Schema({
  id: String,
  type: { type: String, enum: mapEnum(FlatType), required: true },
  name: String,
  description: String,
  basisParts: Number,

  tenants: [{ type: Schema.Types.ObjectId, ref: 'Tenant'}],
  createdAt: Date,
  updatedAt: Date,
}, { collection: 'flats', autoIndex: true, timestamps: true });


