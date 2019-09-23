import { Get, Post, Put, Delete, Controller, Query, Body, Param, HttpCode, ParseIntPipe  } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation, ApiImplicitParam, ApiImplicitQuery } from '@nestjs/swagger';

import { Tenant, ITenant } from '../models/tenant.dto';
import { TenantService } from '../services/tenant.service';

@ApiUseTags('v1/tenant')
@Controller('v1/tenant')
export class TenantControllerV1 {
    constructor(private readonly _service: TenantService) {}

    @Get()
    @ApiOperation({ title: 'Fetch all Tenants' })
    @ApiResponse({ status: 200, description: 'Call successful', type: Tenant, isArray: true })
    async getTenantsAsync() : Promise<ITenant[]> {
        console.log(`[${this.constructor.name}] Enter GET`);

        const result = await this._service.getAsync();
        console.log(`[${this.constructor.name}] Leave GET`);

        return result;
    }

    @Get(':id')
    @ApiOperation({ title: 'Fetch an Tenant item by id' })
    @ApiImplicitParam({ name: 'id', required: true, description: 'Id of the costkey to fetch' })
    @ApiResponse({ status: 200, description: 'Call successful', type: Tenant })
    async getManufacturerByIdAsync(@Param('id') id: string) : Promise<ITenant>{
        console.log(`[${this.constructor.name}] Enter GET ${id}`);

        const result = await this._service.findAsync(id);
        console.log(`[${this.constructor.name}] Leave GET ${id}`);

        return result;
    }

    // CRUD

    @Post()
    @HttpCode(201)
    @ApiOperation({ title: 'Create a Tenant' })
    @ApiResponse({ status: 201, description: 'Tenant created', type: Tenant })
    async createManufacturerAsync(@Body() tenant: Tenant) : Promise<ITenant> {
        return await this._service.createAsync(tenant);
    }

    @Put(':id')
    @ApiOperation({ title: 'Update a Tenant' })
    @ApiImplicitParam({ name: 'id', required: true, description: 'Id of the Tenant to update', type: String })
    @ApiResponse({ status: 200, description: 'Tenant updated', type: Tenant })
    async updateManufacturerAsync(@Param('id') id: string, @Body() tenant: Tenant) : Promise<ITenant> {
        return await this._service.updateAsync(id, tenant);
    }

    // @Delete(':id')
    // @ApiOperation({ title: 'Delete a manufacturer' })
    // @ApiImplicitParam({ name: 'id', required: true, description: 'Id of the manufacturer to delete' })
    // @ApiResponse({ status: 200, description: 'Manufacturer deleted', type: Boolean })
    // async deleteManufacturerAsync(@Param('id', ParseIntPipe) id: number) : Promise<boolean> {
    //     return await this._service.deleteManufacturerAsync(id);
    // }
}