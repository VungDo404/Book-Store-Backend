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
import { NewPasswordDto } from "./dto/new-password.dto";
@Injectable()
export class UsersService extends Service<User> {
	readonly defaultPassword: string = "123456";
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
		const user = await this.userModel.findOne({ email }).exec();
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

	async bulkCreateUser(createUserDto: CreateUserDto[]) {
		const validUsers = [];
		for (const user of createUserDto) {
			const existingUser = await this.userModel.findOne({
				email: user.email,
			});
			if (!existingUser)
				validUsers.push({
					...user,
					password: await this.hashPassword(user.password),
				});
		}
		const res = await this.userModel.insertMany(validUsers);

		return {
			countSuccess: res.length,
			countError: createUserDto.length - res.length,
			message: null,
		};
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

	async newPassword(newPasswordDto: NewPasswordDto) {
		const userInfo = this.validateUser(
			newPasswordDto.email,
			newPasswordDto.oldpass,
		);
		if (userInfo) {
			this.userModel
				.updateOne(
					{ email: newPasswordDto.email },
					{
						password: await this.hashPassword(
							newPasswordDto.newpass,
						),
					},
				)
				.exec();
			return "";
		}
		throw new NotFoundException(
			`The user with email ${newPasswordDto.email} does not exist`,
		);
	}

	async seeding(): Promise<boolean> {
		const count = await this.userModel.countDocuments();
		if (!count) {
			await this.userModel.insertMany([
				{
					fullName: "ADMIN",
					password: await this.hashPassword(this.defaultPassword),
					email: "admin@gmail.com",
					phone: "0123456789",
					role: "ADMIN",
					avatar: "21232f297a57a5a743894a0e4a801fc3-1710227641511.png",
				},
				{
					fullName: "User",
					password: await this.hashPassword(this.defaultPassword),
					email: "user@gmail.com",
					phone: "0123456789",
					role: "USER",
					avatar: "ee11cbb19052e40b07aac0ca060c23ee-1710227672382",
				},
				{
					fullName: "TESTING",
					password: await this.hashPassword(this.defaultPassword),
					email: "testing@gmail.com",
					phone: "0123456789",
					role: "USER",
					avatar: "download-14edf5f985c9efbeafdba108ab63709a3-1710227692167.png",
				},
			]);
			return true; 
		}
		return false; 
	}

	async getCount(): Promise<number>{
		return this.userModel.countDocuments();
	}
}
