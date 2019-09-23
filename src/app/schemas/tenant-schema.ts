import { Schema } from 'mongoose';

export const TeneantSchema = new Schema({
  id: String,
  name: String,
  isChild: { type: Boolean, required: false },
  moveIn: Date,
  moveOut: Date,
  createdAt: Date,
  updatedAt: Date,
}, { collection: 'tenants', autoIndex: true, timestamps: true });

TeneantSchema.index({ id: -1 }, { unique: true });