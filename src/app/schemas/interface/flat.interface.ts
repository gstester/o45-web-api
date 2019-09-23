import { Document } from 'mongoose';
import { ITenantSchema } from './tenant.interface';
import { FlatType } from '../../models/enumeration';

export interface IFlatSchema extends Document {
    id: string,
    type: FlatType,
    name: string,
    description: string,
    basisParts: number,

    tenants: ITenantSchema[];
    tenantCount: number,
    createdAt: Date,
    updatedAt: Date,
}