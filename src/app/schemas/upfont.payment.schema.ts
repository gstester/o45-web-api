import { Schema } from 'mongoose';
import { FlatType } from '../models/enumeration';
import { mapEnum } from '../../common/util';

export const UpfrontPaymentSchema = new Schema({
    type: { type: String, enum: mapEnum(FlatType), required: true },
    basis: Number,
    usage: Number
});