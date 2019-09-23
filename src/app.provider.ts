import { port } from './main';

export const configurationProvider = {
    provide: 'ConfigurationToken',
    useFactory: async (): Promise<void> => {

        console.log(`Starting at port ${port}`);
    }
}