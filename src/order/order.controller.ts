import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Message } from '@/decorators/message.decorator';
import { ObjectIdPipe } from '@/pipes/mongoId.pipe';
import { User } from '@/decorators/user.decorator';
import { AccountDto } from '@/auth/dto/account.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Message('Create an order')
  create(@Body() createOrderDto: CreateOrderDto, @User() user: AccountDto) {
    return this.orderService.create(createOrderDto, user._id);
  }

  @Get()
  @Message('Get orders with pagination')
  findAll(@Query() query: string) {
    return this.orderService.findAll(query);
  }

  @Get('history')
  @Message('Get orders with user id')
  findOrderByUserId(@User('_id') id: string) {
    return this.orderService.findOrderByUserId(id);
  }

  @Get(':id')
  @Message('Get a order by id')
  findOne(@Param('id', ObjectIdPipe) id: string) {
    return this.orderService.findOne(id);
  }

  @Put(':id')
  @Message('Update an order by id')
  update(@Param('id', ObjectIdPipe) id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @Message('Delete an order by id')
  remove(@Param('id', ObjectIdPipe) id: string) {
    return this.orderService.remove(id);
  }
}
