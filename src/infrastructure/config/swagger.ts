import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as apiInfo from './api-info';

const config = new DocumentBuilder()
  .setTitle(apiInfo.TITLE)
  .setDescription(apiInfo.DESCRIPTION)
  .setVersion(apiInfo.VERSION)
  .addTag(apiInfo.PREFIX);

apiInfo.SERVERS.forEach((server) => {
  config.addServer(server.host, server.description);
});

export const setup = (app: INestApplication) => {
  const document = SwaggerModule.createDocument(app, config.build());
  SwaggerModule.setup(apiInfo.PREFIX, app, document, {
    customSiteTitle: apiInfo.TITLE,
  });
};
