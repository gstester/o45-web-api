import { Injectable, Inject, HttpStatus, HttpException } from '@nestjs/common';

import { Model } from 'mongoose';

import { of } from 'rxjs';

import { ICostKeySchema } from '../schemas/interface/cost-key.interface';
import { ICostKey } from '../models/cost-key.dto';
import { CostKeyFactory } from '../factories/cost-key.factory';
import { ObjectID } from 'bson';
import { CostKeyModelService } from './cost-key-model.service';
import { UsageService } from './usage.service';

@Injectable()
export class CostKeyService {
    constructor(private readonly _modelService: CostKeyModelService, private readonly _usageService: UsageService) { }

    public async getAsync(): Promise<Array<ICostKey>> {
        const res = await this._modelService.findAsync();

        return of(res.map(t => CostKeyFactory.create(t))).toPromise();
    }

    public async getYearsAsync(): Promise<Array<number>> {
        const res = await this._modelService.findAsync();

        return of(res.map(t => t.year)).toPromise();
    }

    public async findAsync(id: string): Promise<ICostKey> {
        const res = await this._modelService.getCostKeyModelAsync(id);

        return of(CostKeyFactory.create(res)).toPromise();
    }

    public async createAsync(data: ICostKey): Promise<ICostKey> {
        this._validateCostKeyToCreate(data);

        try {
            data.id = CostKeyFactory.getId();

            const model = this._modelService.createModel(data);

            const res = await model.save();

            await this._usageService.initializeAsync(res.id);

            return of(CostKeyFactory.create(res)).toPromise();
        }
        catch (err) {
            console.error(err);

            const msg = `Error creating costKey with name ${data.year}`;
            throw new HttpException(msg, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async updateAsync(id: string, costKey: ICostKey): Promise<ICostKey> {
        this._validateCostKeyToUpdate(id, costKey);

        try {
            const query = { id: id };
            const costKeyInDb = await this._modelService.findCostKeyAsync(query);

            if (!costKeyInDb)
                throw new HttpException(`No costKey with id: ${id} found`, HttpStatus.BAD_REQUEST);

            costKey.id = id;

            const updateResult = await this._modelService.updateAsync(query, costKey);

            if (updateResult.nModified > 0) {
                console.log(`CostKey with Id ${costKey.id} updated`);
            }

            const res = await this._modelService.findCostKeyAsync(query);

            if (res)
                return of(CostKeyFactory.create(res)).toPromise();

            throw new HttpException(`Error updating costKey with id: ${id}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        catch (err) {
             console.error(err);

            throw new HttpException(`Error updating costKey with id: ${id}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private _validateCostKeyToCreate(costKey: ICostKey) {
        if (costKey.id)
            throw new HttpException(`${costKey.year} has already an Id (Creation only allowed without Id)`, HttpStatus.BAD_REQUEST);

        if (!costKey.year)
            throw new HttpException('A costkey needs a year', HttpStatus.BAD_REQUEST);
    }

    private _validateCostKeyToUpdate(id: string, costKey: ICostKey) {
        if (!costKey.year)
            throw new HttpException('A costKey needs a name', HttpStatus.BAD_REQUEST);

        if (!id)
            throw new HttpException(`${costKey.year} has no Id (Update only allowed with Id)`, HttpStatus.BAD_REQUEST);
    }


}