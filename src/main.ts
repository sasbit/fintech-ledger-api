import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "@app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Get configuration service
  const configService = app.get(ConfigService);
  
  // Get port from configuration
  const port = configService.get<number>('port');
  
  // Listen on configured port
  await app.listen(port);
  
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Environment: ${configService.get<string>('nodeEnv')}`);
  console.log(` Database: ${configService.get<string>('database.uri')}`);
}

bootstrap();
