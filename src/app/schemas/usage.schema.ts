import { Schema } from 'mongoose';

export const UsageSchema = new Schema({
  id: String,
  heating: Number,
  water: Number,
  flat: { type: Schema.Types.ObjectId, ref: 'Flat' },
  costKey: { type: Schema.Types.ObjectId, ref: 'CostKey' },
  createdAt: Date,
  updatedAt: Date,
}, { collection: 'usage', autoIndex: true, timestamps: true });

