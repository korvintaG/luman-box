import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { join } from 'path';

export function setupSwagger(app: INestApplication) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Sferatum API')
    .setDescription('API публичной базы знаний идей')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDocument, {
    customSiteTitle: 'Sferatum API',
    customCss: '.swagger-ui .topbar { display: none; }',
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha', // Сортировка тегов (контроллеров) по алфавиту
      operationsSorter: 'alpha', // Сортировка операций (эндпоинтов) по алфавиту
      // Альтернативные варианты:
      // tagsSorter: (a, b) => a.localeCompare(b), // Кастомная сортировка
      // operationsSorter: (a, b) => a.localeCompare(b), // Кастомная сортировка
    },
  });

  // Эндпоинты для получения JSON документации
  const httpAdapter = app.getHttpAdapter();
  const jsonResponse = JSON.stringify(swaggerDocument, null, 2);
  
  // Стандартный эндпоинт для встроенной кнопки Swagger UI
  // Путь должен быть полным с учетом глобального префикса 'api'
  httpAdapter.get('/api/api-json', (req: any, res: any) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(jsonResponse);
  });
  
  // Опциональное сохранение файла на диск (если установлена переменная окружения)
  if (process.env.SWAGGER_SAVE_JSON === 'true') {
    const outputPath = join(process.cwd(), 'swagger.json');
    writeFileSync(outputPath, JSON.stringify(swaggerDocument, null, 2), 'utf8');
    console.log(`Swagger JSON сохранен в: ${outputPath}`);
  }
}
