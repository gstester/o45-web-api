import { ApiModelProperty } from '@nestjs/swagger';
import { IIdBaseDto, IdBaseDto } from "./id-base.dto";
import { ITenant, Tenant } from './tenant.dto';
import { FlatType } from './enumeration';
import { mapEnum } from '../../common/util';

export interface IFlat extends IIdBaseDto {
    type: FlatType;
    name: string;
    description: string;
    basisParts: number;

    tenants: ITenant[];
    tenantCount: number;
}

export class Flat extends IdBaseDto implements IFlat {
    constructor() {
        super();
        this.type = null;
        this.name = null;
        this.description = null;
        this.basisParts = null;

        this.tenantCount = null;
        this.tenants = null;
    }

    @ApiModelProperty({ type: String, enum: mapEnum(FlatType), required: true })
    type: FlatType;
    @ApiModelProperty({ type: String, required: false })
    name: string;
    @ApiModelProperty({ type: String, required: false })
    description: string;
    @ApiModelProperty({ type: Number, required: false })
    basisParts: number;

    @ApiModelProperty({ type: Tenant, required: false, isArray: true })
    tenants: ITenant[];
    @ApiModelProperty({ type: Number, required: false })
    tenantCount: number;
}