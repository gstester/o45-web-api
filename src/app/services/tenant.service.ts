import { Injectable, Inject, HttpStatus, HttpException } from '@nestjs/common';

import { Model } from 'mongoose';

import { of } from 'rxjs';

import { ITenant } from '../models/tenant.dto';
import { ITenantSchema } from '../schemas/interface/tenant.interface';
import { TenantFactory } from '../factories/tenant.factory';




@Injectable()
export class TenantService {
    constructor(
        @Inject('TenantModelToken') private readonly _tenantModel: Model<ITenantSchema>) { }

    public async getAsync(): Promise<Array<ITenant>> {
        const res = await this._tenantModel.find()
            .sort('name');

        return of(res.map(t => TenantFactory.create(t))).toPromise();
    }

    public async getTenantModelAsync(id: string) {
        return await this._getTenantModelAsync(id);
    }

    public async findAsync(id: string): Promise<ITenant> {
        const res = await this._getTenantModelAsync(id);

        return of(TenantFactory.create(res)).toPromise();
    }

    private async _getTenantModelAsync(id: string): Promise<ITenantSchema> {
        const query = { id: id };
        const res = await this._tenantModel.findOne(query);

        if (res == null)
            throw new HttpException(`Tenant with Id: ${id} not found`, HttpStatus.BAD_REQUEST);

        return res;
    }



    public async createAsync(data: ITenant): Promise<ITenant> {
        this._validateToCreate(data);

        try {
            if (!data.isChild)
                data.isChild = false;
                
            data.id = TenantFactory.getId();

            const model = new this._tenantModel(data);

            const res = await model.save();

            return of(TenantFactory.create(res)).toPromise();
        }
        catch (err) {
            console.error(err);

            const msg = `Error creating tenant with name ${data.name}`;
            throw new HttpException(msg, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async updateAsync(id: string, tenant: ITenant): Promise<ITenant> {
        this._validateToUpdate(id, tenant);

        try {
            const query = { id: id };
            const tenantInDb = await this._tenantModel.findOne(query);

            if (!tenantInDb)
                throw new HttpException(`No tenant with id: ${id} found`, HttpStatus.BAD_REQUEST);

            tenant.id = id;

            const updateResult = await this._tenantModel.updateOne(query, tenant);

            if (updateResult.nModified > 0) {
                console.log(`Tenant with Id ${tenant.id} updated`);
            }

            const res = await this._tenantModel.findOne(query);

            if (res)
                return of(TenantFactory.create(res)).toPromise();

            throw new HttpException(`Error updating tenant with id: ${id}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        catch (err) {
            console.error(err);

            throw new HttpException(`Error updating tenant with id: ${id}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


   

    private _validateToCreate(tenant: ITenant) {
        if (tenant.id)
            throw new HttpException(`${tenant.name} has already an Id (Creation only allowed without Id)`, HttpStatus.BAD_REQUEST);

        if (!tenant.name)
            throw new HttpException('A costkey needs a year', HttpStatus.BAD_REQUEST);
    }

    private _validateToUpdate(id: string, tenant: ITenant) {
        if (!tenant.name)
            throw new HttpException('A manufacturer needs a name', HttpStatus.BAD_REQUEST);

        if (!id)
            throw new HttpException(`${tenant.name} has no Id (Update only allowed with Id)`, HttpStatus.BAD_REQUEST);
    }


}