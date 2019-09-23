import { Schema } from 'mongoose';
import { UpfrontPaymentSchema } from './upfont.payment.schema';

export const CostKeySchema = new Schema({
  id: String,
  year: Number,

  from: Date,
  to: Date,

  heatingBasisCostKey: Number,
  heatingUsageCostKey: Number,

  waterBasisCostKey: Number,
  waterUsageCostKey: Number,

  upfrontPayments: [UpfrontPaymentSchema],

  createdAt: Date,
  updatedAt: Date,
}, { collection: 'costkeys', autoIndex: true, timestamps: true });

