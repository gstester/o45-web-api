import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";

import { Model } from 'mongoose';

import { ITenantSchema } from '../schemas/interface/tenant.interface';

@Injectable()
export class TenantRepositoryService {
    constructor(@Inject('TenantModelToken') private readonly _tenantModel: Model<ITenantSchema>) { }

    public async getTenantModelAsync(id: string): Promise<ITenantSchema> {
        return this._getTenantModelAsync(id);
    }

    private async _getTenantModelAsync(id: string): Promise<ITenantSchema> {
        const query = { id: id };
        const res = await this._tenantModel.findOne(query);

        if (res == null)
            throw new HttpException(`Tenant with Id: ${id} not found`, HttpStatus.BAD_REQUEST);

        return res;
    }
}