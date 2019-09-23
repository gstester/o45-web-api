import { mapDto, getId } from '../../common/util';

import { IFlat, Flat } from '../models/flat.dto';
import { TenantFactory } from './tenant.factory';
import { IFlatSchema } from '../schemas/interface/flat.interface';

export class FlatFactory {
    public static create(model: IFlatSchema) : IFlat {
        const res =  mapDto(model, Flat);

        if (model.tenants) {
            res.tenants = model.tenants.map(t => TenantFactory.create(t));
            res.tenantCount = res.tenants.length;
        }
        else {
            res.tenantCount = 0;
        }
            
        return res;
    }

    public static generateFromJson(data) : IFlat {
        let flat = Object.create(Flat.prototype) as IFlat;
        flat =  Object.assign(data, JSON, {});

        return flat;
    }

    public static getId() : string {
        return getId();
    }
}