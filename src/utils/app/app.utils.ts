import type { INestApplication } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IS_PUBLIC_KEY_META } from 'src/common/constant';
import { getMiddleware } from 'swagger-stats';

export const AppUtils = {
  setupSwagger(app: INestApplication, configService: ConfigService<Configs, true>) {
    const userName = configService.get('app.swaggerUser', { infer: true });
    const passWord = configService.get('app.swaggerPass', { infer: true });
    const appName = configService.get('app.name', { infer: true });

    const swaggerOptions = {
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
      tryItOutEnabled: false,
      displayOperationId: true,
      persistAuthorization: true,
      operationsSorter: (a: { get: (argument: string) => string }, b: { get: (argument: string) => string }) => {
        const methodsOrder = ['get', 'post', 'put', 'patch', 'delete', 'options', 'trace'];
        let result = methodsOrder.indexOf(a.get('method')) - methodsOrder.indexOf(b.get('method'));

        if (result === 0) result = a.get('path').localeCompare(b.get('path'));

        return result;
      }
    };

    const options = new DocumentBuilder()
      .setTitle('API Documentation')
      .addBearerAuth()
      .setLicense('MIT', 'https://opensource.org/licenses/MIT')
      .setDescription('Documentation for Movie with me API')
      .setVersion('1.0.0')
      .build();

    const document = SwaggerModule.createDocument(app, options, {});
    const paths = Object.values(document.paths);

    for (const path of paths) {
      const methods = Object.values(path) as { security: string[] }[];

      for (const method of methods) {
        if (Array.isArray(method.security) && method.security.includes(IS_PUBLIC_KEY_META)) method.security = [];
      }
    }

    app.use(
      getMiddleware({
        swaggerSpec: document,
        authentication: true,
        hostname: appName,
        uriPath: '/stats',
        onAuthenticate: (_request: any, username: string, password: string) => {
          return username === userName && password === passWord;
        }
      })
    );

    SwaggerModule.setup('doc', app, document, {
      explorer: true,
      swaggerOptions
    });
  }
};
