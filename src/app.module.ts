import { Module, ValidationPipe } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { FilesModule } from "./files/files.module";
import { BookModule } from "./book/book.module";
import { OrderModule } from "./order/order.module";
import { DatabaseModule } from "./database/database.module";
import { CartModule } from "./cart/cart.module";
import { AuthModule } from "./auth/auth.module";
import mongoose from "mongoose";
import { JwtAccessTokenAuthGuard } from "./guard/jwt.access-token.guard";
import { APP_GUARD, APP_PIPE } from "@nestjs/core";
const mongoose_delete = require("mongoose-delete");
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
					uri: `${configService.get("DATABASE_URL")}`,
				};
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
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: JwtAccessTokenAuthGuard,
		},
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    },
	],
})
export class AppModule {}
