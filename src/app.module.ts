import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesModule } from './files/files.module';
import { BookModule } from './book/book.module';
import { OrderModule } from './order/order.module';
import { DatabaseModule } from './database/database.module';
import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import mongoose from 'mongoose';
const mongoose_delete = require('mongoose-delete');
@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        mongoose.plugin(mongoose_delete, { overrideMethods: true });
        return {
          uri: `${configService.get('DATABASE_URL')}`,
        }
        
      },
      inject: [ConfigService],
    }),
    FilesModule,
    BookModule,
    OrderModule,
    DatabaseModule,
    CartModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
