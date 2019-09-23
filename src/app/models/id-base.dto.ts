import { ApiModelProperty } from '@nestjs/swagger';

export interface IIdBaseDto {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export class IdBaseDto implements IIdBaseDto {
    constructor() {
        this.id = null;
        this.createdAt = null;
        this.updatedAt = null;
    }
    
    @ApiModelProperty({ type: Number, required: false })
    id: string;
    @ApiModelProperty({ type: Date, required: false })
    createdAt: Date;
    @ApiModelProperty({ type: Date, required: false })
    updatedAt: Date;
}