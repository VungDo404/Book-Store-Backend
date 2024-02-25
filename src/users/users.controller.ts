import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Message } from '../decorators/message.decorator';
import { Public } from '@/decorators/public.decorator';
import { ObjectIdPipe } from '@/pipes/mongoId.pipe';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Message('Post a new user')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Public()
  @Message('Register')
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @Message('Get users with pagination')
  findAll(@Query() query: string) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @Message('Get the user by ID')
  findOne(@Param('id', ObjectIdPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @Message('Update the user')
  update(@Param('id', ObjectIdPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Message('Delete the user')
  remove(@Param('id', ObjectIdPipe) id: string) {
    return this.usersService.remove(id);
  }
}
