import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { Types } from "mongoose";

@Injectable()
export class ObjectIdPipe implements PipeTransform<any, Types.ObjectId> {
	transform(value: any) {
		if (!Types.ObjectId.isValid(value)) {
			throw new BadRequestException("Invalid ObjectId");
		} 
		return value;
	}
}
