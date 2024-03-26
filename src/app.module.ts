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
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter"; 
import { MailerModule } from "@nestjs-modules/mailer";
import { EventEmitterModule } from "@nestjs/event-emitter";

@Module({
	imports: [
		UsersModule,
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [".env", ".env.development"],
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => {
				mongoose.plugin(mongoose_delete, {
					overrideMethods: true,
					indexFields: ["deletedAt"],
					deletedAt: true,
				});
				return {
					uri: `${configService.get("DATABASE_URL")}`,
				};
			},
			inject: [ConfigService],
		}),
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				transport: {
					host: "smtp.gmail.com",
					auth: {
						user: `${configService.get("USER_GMAIL_ID")}`,
						pass: `${configService.get("USER_GMAIL_APP_PASSWORD")}`, 
					},
				},
				defaults: {
					from: `Book Store < ${configService.get("USER_GMAIL_ID")} >`,
				},
				template: {
					dir: process.cwd() + "/templates",
					adapter: new HandlebarsAdapter(),
					options: {
						strict: true,
					},
				},
			}),
			inject: [ConfigService],
		}),
		EventEmitterModule.forRoot(),
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
