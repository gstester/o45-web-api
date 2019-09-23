import { Get, Post, Put, Delete, Controller, Query, Body, Param, HttpCode, ParseIntPipe  } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation, ApiImplicitParam, ApiImplicitQuery } from '@nestjs/swagger';

import { CostKey, ICostKey } from '../models/cost-key.dto';
import { CostKeyService } from '../services/cost-key.service';

@ApiUseTags('v1/costkey')
@Controller('v1/costkey')
export class CostKeyControllerV1 {
    constructor(private readonly _service: CostKeyService) {}

    @Get()
    @ApiOperation({ title: 'Fetch all CostKeys' })
    @ApiResponse({ status: 200, description: 'Call successful', type: CostKey, isArray: true })
    async getAsync() : Promise<ICostKey[]> {
        console.log(`[${this.constructor.name}] Enter GET`);

        const result = await this._service.getAsync();
        console.log(`[${this.constructor.name}] Leave GET`);

        return result;
    }

    @Get('years')
    @ApiOperation({ title: 'Fetch all Usages' })
    @ApiResponse({ status: 200, description: 'Call successful', type: Number, isArray: true })
    async getYearsAsync() : Promise<number[]> {
        console.log(`[${this.constructor.name}] Enter GET`);

        const result = await this._service.getYearsAsync();
        console.log(`[${this.constructor.name}] Leave GET`);

        return result;
    }

    @Get(':id')
    @ApiOperation({ title: 'Fetch an costkey item by id' })
    @ApiImplicitParam({ name: 'id', required: true, description: 'Id of the costkey to fetch' })
    @ApiResponse({ status: 200, description: 'Call successful', type: CostKey })
    async findAsync(@Param('id') id: string) : Promise<ICostKey>{
        console.log(`[${this.constructor.name}] Enter GET ${id}`);

        const result = await this._service.findAsync(id);
        console.log(`[${this.constructor.name}] Leave GET ${id}`);

        return result;
    }

    // CRUD

    @Post()
    @HttpCode(201)
    @ApiOperation({ title: 'Create a costkey' })
    @ApiResponse({ status: 201, description: 'Manufacturer created', type: CostKey })
    async createAsync(@Body() costKey: CostKey) : Promise<ICostKey> {
        return await this._service.createAsync(costKey);
    }

    @Put(':id')
    @ApiOperation({ title: 'Update a costkey' })
    @ApiImplicitParam({ name: 'id', required: true, description: 'Id of the costkey to update', type: String })
    @ApiResponse({ status: 200, description: 'CostKey updated', type: CostKey })
    async updateManufacturerAsync(@Param('id') id: string, @Body() costkey: CostKey) : Promise<ICostKey> {
        return await this._service.updateAsync(id, costkey);
    }

    // @Delete(':id')
    // @ApiOperation({ title: 'Delete a manufacturer' })
    // @ApiImplicitParam({ name: 'id', required: true, description: 'Id of the manufacturer to delete' })
    // @ApiResponse({ status: 200, description: 'Manufacturer deleted', type: Boolean })
    // async deleteManufacturerAsync(@Param('id', ParseIntPipe) id: number) : Promise<boolean> {
    //     return await this._service.deleteManufacturerAsync(id);
    // }
}