import { Injectable, Inject, HttpStatus, HttpException } from '@nestjs/common';

import { Model } from 'mongoose';

import { of, merge } from 'rxjs';

import { IFlat, Flat } from '../models/flat.dto';

import { IFlatSchema } from '../schemas/interface/flat.interface';
import { FlatFactory } from '../factories/flat.factory';
import { TenantService } from './tenant.service';
import { ITenant } from '../models/tenant.dto';


@Injectable()
export class FlatService {
    constructor(@Inject('FlatModelToken') private readonly _flatModel: Model<IFlatSchema>, private readonly _tenantService: TenantService) { }

    public async getAsync(): Promise<Array<IFlat>> {
        const res = await this._flatModel.find().populate('tenants')
            .sort('year');

        return of(res.map(t => FlatFactory.create(t))).toPromise();
    }

    public async getFlatModelAsync(id: string) {
        return await this._getFlatModelAsync(id);
    }

    public async findAsync(id: string): Promise<IFlat> {
        const res = await this._getFlatModelAsync(id);

        return of(FlatFactory.create(res)).toPromise();
    }

    private async _getFlatModelAsync(id: string): Promise<IFlatSchema> {
        const query = { id: id };
        const res = await this._flatModel.findOne(query).populate('tenants');

        if (res == null)
            throw new HttpException(`Flat with Id: ${id} not found`, HttpStatus.BAD_REQUEST);

        return res;
    }

    public async createAsync(data: IFlat): Promise<IFlat> {
        this._validateFlatToCreate(data);

        try {
            data.id = FlatFactory.getId();

            if (!data.tenants)
                data.tenants = new Array<ITenant>();

            const model = new this._flatModel(data);

            const tenantModels = await Promise.all(data.tenants.map(t => this._tenantService.getTenantModelAsync(t.id)));

            model.tenants = tenantModels;

            await model.save();

            return of(FlatFactory.create(model)).toPromise();
        }
        catch (err) {
            console.error(err);

            const msg = `Error creating flat with name ${data.name}`;
            throw new HttpException(msg, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async updateAsync(id: string, flat: IFlat): Promise<IFlat> {
        this._validateFlatToUpdate(id, flat);

        try {
            const query = { id: id };
            const flatInDb = await this._flatModel.findOne(query);

            if (!flatInDb)
                throw new HttpException(`No flat with id: ${id} found`, HttpStatus.BAD_REQUEST);

            Object.keys(flat).forEach(k => {
                console.log(k);
                flatInDb[k] = flat[k];
            });

            const tenantModels = await Promise.all(flat.tenants.map(t => this._tenantService.getTenantModelAsync(t.id)));

            flatInDb.tenants = tenantModels;

            await flatInDb.save();

            return of(FlatFactory.create(flatInDb)).toPromise();
        }
        catch (err) {
            console.error(err);

            throw new HttpException(`Error updating flat with id: ${id}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async addTenantAsync(id: string, tenantId: string, flat: IFlat): Promise<IFlat> {
        this._validateFlatToUpdate(id, flat);

        try {
            const query = { id: id };
            const flatInDb = await this._flatModel.findOne(query);

            if (!flatInDb)
                throw new HttpException(`No flat with id: ${id} found`, HttpStatus.BAD_REQUEST);

            const tenantModel = await this._tenantService.getTenantModelAsync(tenantId);

            if (!tenantModel)
                throw new HttpException(`Tenant ${tenantId} not found to add`, HttpStatus.BAD_REQUEST);

            flatInDb.tenants.push(tenantModel);

            await flatInDb.save();

            const res = await this._getFlatModelAsync(id);

            if (res)
                return of(FlatFactory.create(res)).toPromise();

            throw new HttpException(`Error updating flat with id: ${id}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        catch (err) {
            console.error(err);

            throw new HttpException(`Error updating flat with id: ${id}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async removeTenantAsync(id: string, tenantId: string): Promise<IFlat> {
        try {
            const query = { id: id };
            const flatInDb = await this._flatModel.findOne(query);

            if (!flatInDb)
                throw new HttpException(`No flat with id: ${id} found`, HttpStatus.BAD_REQUEST);

            const tenantModel = await this._tenantService.getTenantModelAsync(tenantId);

            if (!tenantModel)
                throw new HttpException(`Tenant ${tenantId} not found to add`, HttpStatus.BAD_REQUEST);

            const idx = flatInDb.tenants.findIndex(t => t.id == tenantModel.id);

            flatInDb.tenants = flatInDb.tenants.splice(idx, 1);

            await flatInDb.save();

            const res = await this._getFlatModelAsync(id);

            if (res)
                return of(FlatFactory.create(res)).toPromise();

            throw new HttpException(`Error updating flat with id: ${id}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        catch (err) {
            console.error(err);

            throw new HttpException(`Error updating flat with id: ${id}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private _validateFlatToCreate(flat: IFlat) {
        if (flat.id)
            throw new HttpException(`${flat.name} has already an Id (Creation only allowed without Id)`, HttpStatus.BAD_REQUEST);

        if (!flat.name)
            throw new HttpException('A costkey needs a year', HttpStatus.BAD_REQUEST);
    }

    private _validateFlatToUpdate(id: string, flat: IFlat) {
        if (!flat.name)
            throw new HttpException('A manufacturer needs a name', HttpStatus.BAD_REQUEST);

        if (!id)
            throw new HttpException(`${flat.name} has no Id (Update only allowed with Id)`, HttpStatus.BAD_REQUEST);
    }


}