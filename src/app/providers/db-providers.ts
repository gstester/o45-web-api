import { Connection } from 'mongoose';

import { CostKeySchema } from '../schemas/cost-key.schema';
import { TeneantSchema } from '../schemas/tenant-schema';
import { FlatSchema } from '../schemas/flat.schema';
import { UsageSchema } from '../schemas/usage.schema';


export const o45Providers = [
  {
    provide: 'CostKeyModelToken',
    useFactory: (connection: Connection) => connection.model('CostKey', CostKeySchema),
    inject: ['DbConnectionToken'],
  },
  {
    provide: 'TenantModelToken',
    useFactory: (connection: Connection) => connection.model('Tenant', TeneantSchema),
    inject: ['DbConnectionToken'],
  },
  {
    provide: 'FlatModelToken',
    useFactory: (connection: Connection) => connection.model('Flat', FlatSchema),
    inject: ['DbConnectionToken'],
  },
  {
    provide: 'UsageModelToken',
    useFactory: (connection: Connection) => connection.model('Usage', UsageSchema),
    inject: ['DbConnectionToken'],
  },
];