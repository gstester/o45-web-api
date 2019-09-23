import { Get, Post, Put, Delete, Controller, Query, Body, Param, HttpCode, ParseIntPipe  } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation, ApiImplicitParam, ApiImplicitQuery } from '@nestjs/swagger';

import { Usage, IUsage } from '../models/usage.dto';

import { UsageService } from '../services/usage.service';

@ApiUseTags('v1/usage')
@Controller('v1/usage')
export class UsageControllerV1 {
    constructor(private readonly _service: UsageService) {}

    @Get()
    @ApiOperation({ title: 'Fetch all Usages' })
    @ApiResponse({ status: 200, description: 'Call successful', type: Usage, isArray: true })
    async getAsync() : Promise<IUsage[]> {
        console.log(`[${this.constructor.name}] Enter GET`);

        const result = await this._service.getAsync();
        console.log(`[${this.constructor.name}] Leave GET`);

        return result;
    }

    @Get(':id')
    @ApiOperation({ title: 'Fetch an usage item by id' })
    @ApiImplicitParam({ name: 'id', required: true, description: 'Id of the usage to fetch' })
    @ApiResponse({ status: 200, description: 'Call successful', type: Usage })
    async findAsync(@Param('id') id: string) : Promise<IUsage>{
        return await this._service.findAsync(id);
    }

    // CRUD

    @Post()
    @HttpCode(201)
    @ApiOperation({ title: 'Create a usage' })
    @ApiResponse({ status: 201, description: 'Manufacturer created', type: Usage })
    async createAsync(@Body() costKey: Usage) : Promise<IUsage> {
        console.log(`[${this.constructor.name}] Enter GET`);

        const result = await this._service.createAsync(costKey);
        console.log(`[${this.constructor.name}] Leave GET`);

        return result;
    }

    @Put(':id')
    @ApiOperation({ title: 'Update a usage' })
    @ApiImplicitParam({ name: 'id', required: true, description: 'Id of the usage to update', type: String })
    @ApiResponse({ status: 200, description: 'Usage updated', type: Usage })
    async updateManufacturerAsync(@Param('id') id: string, @Body() usage: Usage) : Promise<IUsage> {
        console.log(`[${this.constructor.name}] Enter GET ${id}`);

        const result = await this._service.updateAsync(id, usage);
        console.log(`[${this.constructor.name}] Leave GET ${id}`);

        return result;
    }

    // @Delete(':id')
    // @ApiOperation({ title: 'Delete a manufacturer' })
    // @ApiImplicitParam({ name: 'id', required: true, description: 'Id of the manufacturer to delete' })
    // @ApiResponse({ status: 200, description: 'Manufacturer deleted', type: Boolean })
    // async deleteManufacturerAsync(@Param('id', ParseIntPipe) id: number) : Promise<boolean> {
    //     return await this._service.deleteManufacturerAsync(id);
    // }
}