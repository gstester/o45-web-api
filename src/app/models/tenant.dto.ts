import { ApiModelProperty } from '@nestjs/swagger';

import { IIdBaseDto, IdBaseDto } from "./id-base.dto";

export interface ITenant extends IIdBaseDto {
    name: string;
    isChild: boolean;
    moveIn: Date,
    moveOut: Date,    
}

export class Tenant extends IdBaseDto implements ITenant {
    constructor() {
        super();

        this.name = null;
        this.isChild = false;
        this.moveIn = null;
        this. moveOut = null;
    }

    @ApiModelProperty({ type: String, required: false })
    name: string;
    @ApiModelProperty({ type: Boolean, required: false })
    isChild: boolean;
    @ApiModelProperty({ type: String, format: 'date-time', example:'2018-11-21',  required: false })
    moveIn: Date;
    @ApiModelProperty({ type: String, format: 'date-time', example:'2018-11-21',  required: false })
    moveOut: Date;
}