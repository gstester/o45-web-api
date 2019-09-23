import { mapDto, getId } from '../../common/util';

import { IUpfrontPaymentSchema } from '../schemas/interface/upfront-payment.interface';
import { IUpfrontPayment, UpfrontPayment } from '../models/upfront-payment.dto';


export class UpfrontPaymentFactory {
    public static create(model: IUpfrontPaymentSchema) : IUpfrontPayment {
        return mapDto(model, UpfrontPayment);
    }

    public static generateFromJson(data) : IUpfrontPayment {
        let costKey = Object.create(UpfrontPayment.prototype) as IUpfrontPayment;
        costKey =  Object.assign(data, JSON, {});

        return costKey;
    }
}