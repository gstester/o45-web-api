import { ApiModelProperty } from '@nestjs/swagger';

import { IIdBaseDto, IdBaseDto } from "./id-base.dto";
import { IFlat, Flat } from './flat.dto';

export interface ITenant extends IIdBaseDto {
    name: string;
    isChild: boolean;
    moveIn: Date;
    moveOut: Date;
    flat?: IFlat;
    flatName?: string;
}

export class Tenant extends IdBaseDto implements ITenant {
    constructor() {
        super();

        this.name = null;
        this.isChild = false;
        this.moveIn = null;
        this. moveOut = null;
        this.flat = null;
        this.flatName = null;
    }

    @ApiModelProperty({ type: String, required: false })
    name: string;
    @ApiModelProperty({ type: Boolean, required: false })
    isChild: boolean;
    @ApiModelProperty({ type: String, format: 'date-time', example:'2018-11-21',  required: false })
    moveIn: Date;
    @ApiModelProperty({ type: String, format: 'date-time', example:'2018-11-21',  required: false })
    moveOut: Date;
    @ApiModelProperty({ type: Flat,  required: false })
    flat?: IFlat;
    @ApiModelProperty({ type: String, required: false })
    flatName?: string;
}