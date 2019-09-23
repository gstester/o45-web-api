import { ApiModelProperty } from '@nestjs/swagger';

import { IIdBaseDto, IdBaseDto } from "./id-base.dto";
import { IUpfrontPayment, UpfrontPayment } from './upfront-payment.dto';
import { FlatType } from './enumeration';

export interface ICostKey extends IIdBaseDto {
    year: number;
    
    from: Date;
    to: Date;
    
    heatingBasisCostKey: number;
    heatingUsageCostKey: number;

    waterBasisCostKey: number;
    waterUsageCostKey: number;

    upfrontPayments: Array<IUpfrontPayment>;
}

export class CostKey extends IdBaseDto implements ICostKey {
    constructor() {
        super();

        this.year = null;
        this.heatingBasisCostKey = null;
        this.heatingUsageCostKey = null;
        this.waterBasisCostKey = null;
        this.waterUsageCostKey = null;
    }

    @ApiModelProperty({ type: Number, required: true })
    year: number;
    @ApiModelProperty({ type: Date, required: true })
    from: Date;
    @ApiModelProperty({ type: Date, required: true })
    to: Date;
    @ApiModelProperty({ type: Number, required: true })
    heatingBasisCostKey: number;
    @ApiModelProperty({ type: Number, required: true })
    heatingUsageCostKey: number;
    @ApiModelProperty({ type: Number, required: true })
    waterBasisCostKey: number;
    @ApiModelProperty({ type: Number, required: true })
    waterUsageCostKey: number;

    @ApiModelProperty({ type: UpfrontPayment, required: true, isArray: true })
    upfrontPayments: Array<IUpfrontPayment>;

    static getUpfrontPayment(costKey: ICostKey, flatType: FlatType): IUpfrontPayment {
        return costKey.upfrontPayments.find(u => u.type === flatType);
    }
}