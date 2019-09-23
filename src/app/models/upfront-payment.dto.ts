import { ApiModelProperty } from '@nestjs/swagger';

import { FlatType } from './enumeration';
import { mapEnum } from '../../common/util';

export interface IUpfrontPayment {
    type: FlatType;
    basis: number;
    usage: number;
}

export class UpfrontPayment implements IUpfrontPayment {
    constructor() {
        this.type = null;
        this.basis = null;
        this.usage = null;
    }
    @ApiModelProperty({ type: String, enum: mapEnum(FlatType), required: true })
    type: FlatType;
    @ApiModelProperty({ type: Number, required: false })
    basis: number;
    @ApiModelProperty({ type: Number, required: false })
    usage: number;
}