import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';
import { UsersModule } from '@/users/users.module';
import { BookModule } from '@/book/book.module';
import { OrderModule } from '@/order/order.module';

@Module({
  imports: [
    UsersModule,
    BookModule, 
    OrderModule
  ],
  controllers: [DatabaseController],
  providers: [DatabaseService],
})
export class DatabaseModule {}
