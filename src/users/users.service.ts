import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { SoftDeleteModel } from 'mongoose-delete';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
  ) {}
  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
  async create(createUserDto: CreateUserDto) {
    const count = await this.userModel
      .countDocuments({ email: createUserDto.email })
      .exec();
    if (count >= 1) {
      throw new ConflictException('Email already exists');
    }
    const hash = await this.hashPassword(createUserDto.password);
    const createdCat = new this.userModel({ ...createUserDto, password: hash });
    return createdCat.save();
  }

  async findAll(query: string) {
    const { limit, filter, sort } = aqp(query, {
      limitKey: 'pageSize',
    });
    const { current } = filter;
    delete filter.current;
    const total = await this.userModel.countDocuments(filter).exec();
    const pages = Math.ceil(total / limit);
    const result = await this.userModel
      .find(filter)
      .select('-password')
      // @ts-ignore: Unreachable code error
      .sort(sort ?? {})
      .skip((current - 1) * limit)
      .limit(limit)
      .exec();
    const meta = {
      current,
      pageSize: limit,
      pages,
      total,
    };
    return { meta, result };
  }

  findOne(id: string) {
    return this.userModel.findById(id).exec();
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    if (!mongoose.isValidObjectId(id)) {
      throw new NotFoundException(`No user found with id ${id}`);
    }
    return this.userModel.updateOne({ _id: id }, updateUserDto).exec();
  }

  remove(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new NotFoundException(`No user found with id ${id}`);
    }
    return this.userModel.deleteById(id).exec();
  }
}
