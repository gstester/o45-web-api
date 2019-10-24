import { Module } from '@nestjs/common';
import { DatabaseModule } from '../common/database';
import { TenantControllerV1 } from './controllers/tenant.controller';
import { FlatControllerV1 } from './controllers/flat.controller';
import { CostKeyControllerV1 } from './controllers/cost-key.controller';
import { TenantService } from './services/tenant.service';
import { FlatService } from './services/flat.service';
import { CostKeyService } from './services/cost-key.service';
import { o45Providers } from './providers/db-providers';
import { UsageService } from './services/usage.service';
import { SummaryService } from './services/summary.service';
import { UsageControllerV1 } from './controllers/usage.controller';
import { SummaryControllerV1 } from './controllers/summary.controller';
import { CostKeyModelService } from './services/cost-key-model.service';
import { TenantRepositoryService } from './services/tenant-repository.service';
 
@Module({
  imports: [DatabaseModule],
  controllers: [TenantControllerV1, FlatControllerV1, CostKeyControllerV1, UsageControllerV1, SummaryControllerV1],
  providers: [TenantRepositoryService, TenantService, FlatService, CostKeyService, CostKeyModelService, UsageService, SummaryService, ...o45Providers]
})
export class O45Module {}