import { Injectable, Inject, HttpStatus, HttpException } from '@nestjs/common';

import { Model } from 'mongoose';

import { of } from 'rxjs';

import { ICostKeySchema } from '../schemas/interface/cost-key.interface';
import { ICostKey } from '../models/cost-key.dto';
import { CostKeyFactory } from '../factories/cost-key.factory';
import { ObjectID } from 'bson';





@Injectable()
export class CostKeyModelService {
    constructor(
        @Inject('CostKeyModelToken') private readonly _costKeyModel: Model<ICostKeySchema>) { }


    public async getCostKeyModelAsync(id: string) {
        return await this._getCostKeyModelAsync(id);
    }

    public async findObjectIDAsync(id: string): Promise<ObjectID> {
        const model = await this._getCostKeyModelAsync(id);

        return model._id;
    }

    public createModel(data: ICostKey) {
        return new this._costKeyModel(data);
    }

    public async findCostKeyAsync(query: { id: string; }) {
        return await this._costKeyModel.findOne(query);
    }

    public async findAsync() {
        return await this._costKeyModel.find()
            .sort('year');
    }

    public async updateAsync(query: { id: string; }, costKey: ICostKey) {
        return await this._costKeyModel.updateOne(query, costKey);
    }

    private async _getCostKeyModelAsync(id: string): Promise<ICostKeySchema> {
        const query = { id: id };
        const res = await this._costKeyModel.findOne(query);

        if (res == null)
            throw new HttpException(`Costkey with Id: ${id} not found`, HttpStatus.BAD_REQUEST);

        return res;
    }


}