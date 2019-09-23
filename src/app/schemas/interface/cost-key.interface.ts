import { Document } from 'mongoose';
import { IUpfrontPaymentSchema } from './upfront-payment.interface';

export interface ICostKeySchema extends Document {
    id: string;
    year: number;

    from: Date;
    to: Date;

    heatingBasisCostKey: number;
    heatingUsageCostKey: number;

    waterBasisCostKey: number;
    waterUsageCostKey: number;

    upfrontPayments: Array<IUpfrontPaymentSchema>;

    createdAt: Date;
    updatedAt: Date;
}