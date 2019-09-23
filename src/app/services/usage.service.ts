import { Injectable, Inject, HttpStatus, HttpException } from '@nestjs/common';

import { Model } from 'mongoose';

import { of } from 'rxjs';

import { IUsageSchema } from '../schemas/interface/usage.interface';
import { IUsage, Usage } from '../models/usage.dto';
import { UsageFactory } from '../factories/usage.factory';
import { FlatService } from './flat.service';
import { ObjectID } from 'bson';
import { CostKeyModelService } from './cost-key-model.service';
import { ICostKey } from '../models/cost-key.dto';
import { ICostKeySchema } from '../schemas/interface/cost-key.interface';
import { IFlatSchema } from '../schemas/interface/flat.interface';

@Injectable()
export class UsageService {
    constructor(
        @Inject('UsageModelToken') private readonly _usageModel: Model<IUsageSchema>,
        private readonly _flatService: FlatService, private readonly _costKeyService: CostKeyModelService) { }

    public async initializeAsync(costKeyId: string): Promise<void> {
        const usage: IUsage = Object.assign({}, new Usage(), {
            costKeyId: costKeyId,
            flatId: ''
        });

        const flats = await this._flatService.getAsync();

        const usages = flats.map(async f => {
            const res: IUsage = Object.assign({}, usage);
            res.flatId = f.id;

            await this.createAsync(res);

            return res;
        });
    }

    public async getAsync(): Promise<Array<IUsage>> {
        await this.initializeAsync('ex4j1b1hfftrc');
        const flatPopulate = { path: 'flat', populate: { path: 'tenants' } };
        const res = await this._usageModel.find()
            .populate('flat')
            .populate(flatPopulate)
            .populate('costKey')
            .sort('createdAt');

        return of(res.map(t => UsageFactory.create(t))).toPromise();
    }

    public async getCostKeyModelAsync(id: string) {
        return await this._getCostKeyModelAsync(id);
    }

    public async findAsync(id: string): Promise<IUsage> {
        const res = await this._getCostKeyModelAsync(id);

        return of(UsageFactory.create(res)).toPromise();
    }

    private async _getCostKeyModelAsync(id: string): Promise<IUsageSchema> {
        const query = { id: id };
        const res = await this._usageModel.findOne(query).populate('flat').populate('costKey');

        if (res == null)
            throw new HttpException(`Costkey with Id: ${id} not found`, HttpStatus.BAD_REQUEST);

        return res;
    }

    private async _hasToCreate(costKey: ICostKeySchema, flat: IFlatSchema): Promise<boolean> {
        const usage = await this._usageModel.findOne({'flat': flat._id, 'costKey': costKey._id}).exec();

        const count = await this._usageModel.count({'flat': flat._id, 'costKey': costKey._id}).exec();

        return count === 0;
    }

    public async createAsync(data: IUsage): Promise<IUsage> {
        this._validateToCreate(data);

        try {
            data.id = UsageFactory.getId();

            const model = new this._usageModel(data);

            const flatModel = await this._flatService.getFlatModelAsync(data.flatId);

            model.flat = flatModel;
            model.flatId = flatModel.id;

            const costKeyModel = await this._costKeyService.getCostKeyModelAsync(data.costKeyId);

            model.costKey = costKeyModel;
            model.costKeyId = costKeyModel.id;

            if (!await this._hasToCreate(costKeyModel, flatModel)) 
                return null;

            const saved = await model.save();

            const res = await this._usageModel.findOne({ id: saved.id });

            return of(UsageFactory.create(saved)).toPromise();
        }
        catch (err) {
            console.error(err);

            const msg = `Error creating usage with costkey ${data.costKey}`;
            throw new HttpException(msg, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async updateAsync(id: string, usage: IUsage): Promise<IUsage> {
        this._validateToUpdate(id, usage);

        try {
            const query = { id: id };
            const usageInDb = await this._usageModel.findOne(query);

            if (!usageInDb)
                throw new HttpException(`No costKey with id: ${id} found`, HttpStatus.BAD_REQUEST);

            usage.id = id;

            const flatModel = await this._flatService.getFlatModelAsync(usage.flatId);
            const costKeyModel = await this._costKeyService.getCostKeyModelAsync(usage.costKeyId);

            usageInDb.flat = flatModel;
            usageInDb.costKey = costKeyModel;

            usageInDb.heating = usage.heating;
            usageInDb.water = usage.water;

            await usageInDb.save();

            const res = await this._usageModel.findOne(query).populate('flat').populate('costKey').populate('flat.tenants');

            if (res)
                return of(UsageFactory.create(res)).toPromise();

            throw new HttpException(`Error updating costKey with id: ${id}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        catch (err) {
            console.error(err);

            throw new HttpException(`Error updating costKey with id: ${id}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async findUsage(costKeyId: string): Promise<Array<IUsage>> {
        try {
            const query = { costKeyId: costKeyId };

            const models = await this._usageModel.find(query).populate('flat').populate('costKey');

            return of(models.map(m => UsageFactory.create(m))).toPromise();
        }
        catch (err) {
            console.error(err);

            throw new HttpException(`ussage error`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async findUsageByObjectIDAsync(costKey: ObjectID): Promise<Array<IUsage>> {
        try {
            const query = { costKey: costKey };

            const models = await this._usageModel.find(query).populate({ path: 'flat', populate: { path: 'tenants' } }).populate('costKey');

            const result = models.map(m => UsageFactory.create(m)).sort(this._compare);
            return of(result).toPromise();;
        }
        catch (err) {
            console.error(err);

            throw new HttpException(`ussage error`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private _compare(a: IUsage, b: IUsage): number {
        if (a.id === b.id) return 0;

        if (!b) return 1;

        if (!a) return -1;

        if (a.flat.name > b.flat.name) return 1;

        return -1;
    }

    private _validateToCreate(usage: IUsage) {
        if (usage.id)
            throw new HttpException(`${usage.id} has already an Id (Creation only allowed without Id)`, HttpStatus.BAD_REQUEST);

        if (usage.heating === undefined || usage.heating === null)
            throw new HttpException('A usage needs heating', HttpStatus.BAD_REQUEST);

        if (usage.water === undefined || usage.water === null)
            throw new HttpException('A usage needs water', HttpStatus.BAD_REQUEST);
    }

    private _validateToUpdate(id: string, usage: IUsage) {
        if (usage.heating === undefined || usage.heating === null)
            throw new HttpException('A usage needs heating', HttpStatus.BAD_REQUEST);

        if (usage.water === undefined || usage.water === null)
            throw new HttpException('A usage needs heating', HttpStatus.BAD_REQUEST);

        if (!id)
            throw new HttpException(`${usage.heating} has no Id (Update only allowed with Id)`, HttpStatus.BAD_REQUEST);
    }


}