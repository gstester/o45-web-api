import { Get, Post, Put, Delete, Controller, Query, Body, Param, HttpCode, ParseIntPipe  } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation, ApiImplicitParam, ApiImplicitQuery } from '@nestjs/swagger';

import { Flat, IFlat } from '../models/flat.dto';
import { FlatService } from '../services/flat.service';


@ApiUseTags('v1/flat')
@Controller('v1/flat')
export class FlatControllerV1 {
    constructor(private readonly _service: FlatService) {}

    @Get()
    @ApiOperation({ title: 'Fetch all Flats' })
    @ApiResponse({ status: 200, description: 'Call successful', type: Flat, isArray: true })
    async getTenantsAsync() : Promise<IFlat[]> {
        console.log(`[${this.constructor.name}] Enter GET`);

        const result = await this._service.getAsync();
        console.log(`[${this.constructor.name}] Leave GET`);

        return result;
    }

    @Get(':id')
    @ApiOperation({ title: 'Fetch an Flat item by id' })
    @ApiImplicitParam({ name: 'id', required: true, description: 'Id of the flat to fetch' })
    @ApiResponse({ status: 200, description: 'Call successful', type: Flat })
    async getAsync(@Param('id') id: string) : Promise<IFlat>{
        console.log(`[${this.constructor.name}] Enter GET ${id}`);

        const result = await this._service.findAsync(id);
        console.log(`[${this.constructor.name}] Leave GET ${id}`);

        return result;
    }

    // CRUD
    @Post()
    @HttpCode(201)
    @ApiOperation({ title: 'Create a Flat' })
    @ApiResponse({ status: 201, description: 'Flat created', type: Flat })
    async createAsync(@Body() flat: Flat) : Promise<IFlat> {
        return await this._service.createAsync(flat);
    }

    @Put(':id')
    @ApiOperation({ title: 'Update a Flat' })
    @ApiImplicitParam({ name: 'id', required: true, description: 'Id of the Flat to update', type: String })
    @ApiResponse({ status: 200, description: 'Flat updated', type: Flat })
    async updateAsync(@Param('id') id: string, @Body() flat: Flat) : Promise<IFlat> {
        return await this._service.updateAsync(id, flat);
    }

    @Put(':id/tenant/:tenantId')
    @ApiOperation({ title: 'Add tenant to a Flat' })
    @ApiImplicitParam({ name: 'id', required: true, description: 'Id of the Flat to update', type: String })
    @ApiImplicitParam({ name: 'tenantId', required: true, description: 'Id of the Tenant to add', type: String })
    @ApiResponse({ status: 200, description: 'Flat updated', type: Flat })
    async addTenantAsync(@Param('id') id: string, @Param('tenantId') tenantId: string, @Body() flat: Flat) : Promise<IFlat> {
        return await this._service.addTenantAsync(id, tenantId, flat);
    }

    @Delete(':id/tenant/:tenantId')
    @ApiOperation({ title: 'Delete a manufacturer' })
    @ApiImplicitParam({ name: 'id', required: true, description: 'Id of the Flat to delete' })
    @ApiImplicitParam({ name: 'tenantId', required: true, description: 'Id of the Tenant to remove', type: String })
    @ApiResponse({ status: 200, description: 'Tenent removed', type: Boolean })
    async removeTenantAsync(@Param('id') id: string, @Param('tenantId') tenantId: string) : Promise<IFlat> {
        return await this._service.removeTenantAsync(id, tenantId);
    }
}