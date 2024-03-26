import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OnEvent } from "@nestjs/event-emitter";
import { OrderCreatedEvent } from "./event/order.event";

@Injectable()
export class AppService {
	constructor(
		private readonly mailerService: MailerService,
		private configService: ConfigService,
	) {}

	getHello(): string {
		return "Hello World!";
	}
	sendingMail(payload: OrderCreatedEvent) {
		this.mailerService
			.sendMail({
				to: payload.email,
				from: this.configService.get("USER_GMAIL_ID"),
				subject: `BookStore has received your order #${payload.orderInfo._id} `,
				template: payload.template,
				context: {
					orderInfo: {...payload.orderInfo, email: payload.email},
				},
			})
			.then((success) => {})
			.catch((err) => {
				console.log(err);
			});

		return "";
	}

	@OnEvent("order.created")
	handleOrderCreatedEvent(payload: OrderCreatedEvent) {
		this.sendingMail(payload);
	}
}
