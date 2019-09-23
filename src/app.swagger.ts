import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { Config } from './app.config';

/*
    Encapsulation of the Swagger Configuration
*/
export class SwaggerConfiguration {
    static configure(app: INestApplication): INestApplication {
        const options = new DocumentBuilder()
            .setTitle('O45-Service')
            .setDescription('Service for O45')
            .setVersion(process.env.npm_package_version)
            .setSchemes("http")
            .setBasePath(`${Config.API_BASE_PATH}`)
            .build();

        const document = SwaggerModule.createDocument(app, options);

        SwaggerModule.setup('swagger', app, document);


        return app;
    }
}
