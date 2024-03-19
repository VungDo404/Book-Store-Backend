import { SchemaClass, UpdateDto } from "@/interfaces/service.interface";
import aqp from "api-query-params";
import mongoose from "mongoose";
import { SoftDeleteModel } from "mongoose-delete";

export abstract class Service<T extends SchemaClass> {
	selectValue: string;
	constructor(
		public model: SoftDeleteModel<
			mongoose.Document<unknown, {}, T> &
				T &
				Required<{
					_id: string | mongoose.Types.ObjectId;
				}>,
			{}
		>,
		selectValue: string = ""
	) {
		this.selectValue = selectValue; 
	}
	findAll = async (query: string) => {
		const {
			limit = 20,
			filter,
			sort,
		} = aqp(query, {
			limitKey: "pageSize",
		});
		const { current = 1 } = filter;
		delete filter.current;
		const total = await this.model.countDocuments(filter).exec();
		const pages = Math.ceil(total / limit);
		const result = await this.model
			.find(filter)
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
	remove(id: string) {
		return this.model.deleteById(id).exec();
	}
	findOne(id: string) {
		return this.model.findById(id, this.selectValue).exec();
	}
}
