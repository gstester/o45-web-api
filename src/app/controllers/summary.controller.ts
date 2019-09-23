import { Get, Post, Put, Delete, Controller, Query, Body, Param, HttpCode, ParseIntPipe  } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation, ApiImplicitParam, ApiImplicitQuery } from '@nestjs/swagger';

import { SummaryService } from '../services/summary.service';
import { SummaryEntry, ISummaryEntry } from '../models/summary';


@ApiUseTags('v1/summary')
@Controller('v1/summary')
export class SummaryControllerV1 {
    constructor(private readonly _service: SummaryService) {}

    @Get(':costkeyId')
    @ApiOperation({ title: 'Fetch all Flats' })
    @ApiImplicitParam({ name: 'costkeyId', required: true, description: 'Id of the costkey to fetch summary' })
    @ApiResponse({ status: 200, description: 'Call successful', type: SummaryEntry, isArray: true })
    async getSummaryAsync(@Param('costkeyId') costkeyId: string) : Promise<Array<ISummaryEntry>> {
        return await this._service.getAsync(costkeyId);
    }

    @Post(':costkeyId')
    @ApiOperation({ title: 'Fetch all Flats' })
    @ApiImplicitParam({ name: 'costkeyId', required: true, description: 'Id of the costkey to fetch summary' })
    @ApiResponse({ status: 200, description: 'Call successful', type: SummaryEntry, isArray: true })
    async saveSummaryAsync(@Param('costkeyId') costkeyId: string) : Promise<Array<ISummaryEntry>> {
        return await this._service.saveAsync(costkeyId);
    }
}