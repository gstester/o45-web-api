import { CostKey, ICostKey } from '../models/cost-key.dto';
import { mapDto, getId } from '../../common/util';
import { ICostKeySchema } from '../schemas/interface/cost-key.interface';
import { UpfrontPaymentFactory } from './upfront-payment.factory';


export class CostKeyFactory {
    public static create(model: ICostKeySchema) : ICostKey {
        const result = mapDto(model, CostKey);

        if (model.upfrontPayments)
            result.upfrontPayments = model.upfrontPayments.map(u => UpfrontPaymentFactory.create(u));

        return result;
    }

    public static generateFromJson(data) : ICostKey {
        let costKey = Object.create(CostKey.prototype) as ICostKey;
        costKey =  Object.assign(data, JSON, {});

        return costKey;
    }

    public static getId() : string {
        return getId();
    }
}