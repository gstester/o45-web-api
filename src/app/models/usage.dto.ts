import { ApiModelProperty } from '@nestjs/swagger';

import { IIdBaseDto, IdBaseDto } from "./id-base.dto";
import { IFlat, Flat } from './flat.dto';
import { ICostKey, CostKey } from './cost-key.dto';

export interface IUsage extends IIdBaseDto {
    heating: number;
    water: number;
    flatId: string;
    flat: IFlat;
    costKeyId: string;
    costKey: ICostKey;
}

export class Usage extends IdBaseDto implements IUsage {
    constructor() {
        super();

        this.heating = 0;
        this.water = 0;
        this.costKey = null;
        this.costKeyId = null;
        this.flat = null;
        this.flatId = null;
    }

    @ApiModelProperty({ type: Number, required: true })
    heating: number;
    @ApiModelProperty({ type: Number, required: true })
    water: number;
    @ApiModelProperty({ type: String, required: true })
    flatId: string;
    @ApiModelProperty({ type: Flat, required: false })
    flat: IFlat;
    @ApiModelProperty({ type: String, required: true })
    costKeyId: string;
    @ApiModelProperty({ type: CostKey, required: false })
    costKey: ICostKey;
}