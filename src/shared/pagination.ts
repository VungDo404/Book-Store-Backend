import { Injectable } from "@nestjs/common";
import aqp from "api-query-params";
import mongoose from "mongoose";
import { SoftDeleteModel } from "mongoose-delete";

@Injectable()
export class Pagination<T = { new(...args: any[]): any }> {
	constructor(
		public model: SoftDeleteModel<
			mongoose.Document<unknown, {}, T> &
				T &
				Required<{
					_id: string | mongoose.Types.ObjectId;
				}>,
			{}
		>,
	) {}
	findAll = async (query: string) => {
		const { limit = 10, filter, sort } = aqp(query, {
			limitKey: "pageSize",
		});
		const { current = 1 } = filter;
		delete filter.current;
		const total = await this.model.countDocuments(filter).exec();
		const pages = Math.ceil(total / limit);
		const result = await this.model.find(filter)
			.select("-password")
			// @ts-ignore: Unreachable code error
			.sort(sort ?? {})
			.skip((<number>current - 1) * limit)
			.limit(limit)
			.exec();
		const meta = {
			current,
			pageSize: limit,
			pages,
			total,
		};
		return { meta, result };
	};
}
