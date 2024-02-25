import {
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import * as bcrypt from "bcrypt";
import { SoftDeleteModel } from "mongoose-delete";
import { Service } from "@/shared/service";
@Injectable()
export class UsersService extends Service<User> {
	constructor(
		@InjectModel(User.name)
		private userModel: SoftDeleteModel<UserDocument>,
	) {
		super(userModel, "-password");
	}
	async hashPassword(password: string) {
		const salt = await bcrypt.genSalt();
		const hash = await bcrypt.hash(password, salt);
		return hash;
	}
	async validateUser(email: string, pass: string): Promise<any> {
		const user = await this.userModel
			.findOne({ email }, null, { lean: true })
			.exec();
		if (user) {
			const isMatch = await bcrypt.compare(pass, user.password);
			if (isMatch) {
				delete user.password;
				return user;
			}
		}
		return null;
	}
	async createUser(createUserDto: CreateUserDto) {
		const count = await this.userModel
			.countDocuments({ email: createUserDto.email })
			.exec();
		if (count >= 1) {
			throw new ConflictException("Email already exists");
		}
		const hash = await this.hashPassword(createUserDto.password);
		const createdUser = new this.userModel({
			...createUserDto,
			password: hash,
		});
		const { password, ...rest } = (await createdUser.save()).toObject();
		return { _id: rest._id, fullName: rest.fullName, email: rest.email };
	}

	findByRefreshToken(refreshToken: string) {
		return this.userModel
			.findOne({ refreshToken }, { lean: 1 })
			.select("-password")
			.exec();
	}

	updateRefreshToken(id: string, refreshToken: string) {
		if (!mongoose.isValidObjectId(id)) {
			throw new NotFoundException(`No user found with id ${id}`);
		}
		return this.userModel.updateOne({ _id: id }, { refreshToken }).exec();
	}
}
