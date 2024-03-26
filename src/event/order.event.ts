export class OrderCreatedEvent {
	constructor(
		public readonly email: string,
        public readonly template: string,
        public readonly orderInfo: {
            _id: string, 
            username: string
            address: string
            phone: string
        },
	) {}
}
