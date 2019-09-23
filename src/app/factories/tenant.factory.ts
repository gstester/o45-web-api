import { mapDto, getId } from '../../common/util';
import { ITenant, Tenant } from '../models/tenant.dto';
import { ITenantSchema } from '../schemas/interface/tenant.interface';

export class TenantFactory {
    public static create(model: ITenantSchema) : ITenant {
        return mapDto(model, Tenant);
    }

    public static generateFromJson(data) : ITenant {
        let tenant = Object.create(Tenant.prototype) as ITenant;
        tenant =  Object.assign(data, JSON, {});

        return tenant;
    }

    public static getId() : string {
        return getId();
    }
}