import { Document } from 'mongoose';
import { FlatType } from '../../models/enumeration';

export interface IUpfrontPaymentSchema extends Document {
    type: FlatType;
    basis: number;
    usage: number;
}
