import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "@app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  
  
  const config = new DocumentBuilder()
    .setTitle('Simple Ledger API')
    .setDescription('A simplified double-entry ledger API with hash chaining')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  await app.listen(port);
  
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Environment: ${configService.get<string>('nodeEnv')}`);
  console.log(`Database: ${configService.get<string>('database.uri')}`);
}

bootstrap();
