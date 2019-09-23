import { Document } from 'mongoose';
import { IFlatSchema } from './flat.interface';
import { ICostKeySchema } from './cost-key.interface';

export interface IUsageSchema extends Document {
    id: string;
    heating: number;
    water: number;
    flatId: string;
    flat: IFlatSchema;
    costKeyId: string;
    costKey: ICostKeySchema;
    createdAt: Date;
    updatedAt: Date;
}