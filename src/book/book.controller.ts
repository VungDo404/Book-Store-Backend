import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Query,
	Put,
} from "@nestjs/common";
import { BookService } from "./book.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { Message } from "@/decorators/message.decorator";
import { ObjectIdPipe } from "@/pipes/mongoId.pipe";
import { Public } from "@/decorators/public.decorator";

@Public()
@Controller("book")
export class BookController {
	constructor(private readonly bookService: BookService) {}

	@Post()
	@Message("Post a new book")
	create(@Body() createBookDto: CreateBookDto) {
		return this.bookService.create(createBookDto);
	}

	@Get()
	@Message("Get books with pagination")
	findAll(@Query() query: string) {
		return this.bookService.findAll(query);
	}

	@Get("category")
	@Message("Get book's category")
	getCategory() {
		return this.bookService.category();
	}

	@Get(":id")
	@Message("Get book by id")
	findOne(@Param("id", ObjectIdPipe) id: string) {
		return this.bookService.findOne(id);
	}

	@Put(":id")
	@Message("Update the book")
	update(
		@Param("id", ObjectIdPipe) id: string,
		@Body() updateBookDto: UpdateBookDto,
	) {
		return this.bookService.update(id, updateBookDto);
	}

	@Delete(":id")
	@Message("Delete the book")
	remove(@Param("id", ObjectIdPipe) id: string) {
		return this.bookService.remove(id);
	}
}
