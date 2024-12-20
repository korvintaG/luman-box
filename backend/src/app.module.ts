import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorsModule } from './authors/authors.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author  } from './authors/entities/author.entity';
import { configProvider } from './app.config.provider';


@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: configProvider.useValue.database.username,
    password: configProvider.useValue.database.password,
    database: configProvider.useValue.database.databaseName,
    entities: [Author],
    synchronize: true,
  }), AuthorsModule],
  controllers: [AppController],
  providers: [configProvider, AppService],
})
export class AppModule {}
