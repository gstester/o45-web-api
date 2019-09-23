import { mapDto, getId } from '../../common/util';
import { IUsage, Usage } from '../models/usage.dto';
import { FlatFactory } from './flat.factory';
import { CostKeyFactory } from './cost-key.factory';
import { IUsageSchema } from '../schemas/interface/usage.interface';


export class UsageFactory {
    public static create(model: IUsageSchema) : IUsage {
        const res = mapDto(model, Usage);

        if (model.flat) {
            res.flat = FlatFactory.create(model.flat);
            res.flatId = res.flat.id;
        }

        if (model.costKey) {
            res.costKey = CostKeyFactory.create(model.costKey);
            res.costKeyId = res.costKey.id;
        }
        
        return res;
    }

    public static generateFromJson(data) : IUsage {
        let usage = Object.create(Usage.prototype) as IUsage;
        usage =  Object.assign(data, JSON, {});

        return usage;
    }

    public static getId() : string {
        return getId();
    }
}