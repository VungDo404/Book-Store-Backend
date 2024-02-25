import { Injectable } from "@nestjs/common";
import { CreateBookDto } from "./dto/create-book.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Book, BookDocument } from "./schemas/book.schema";
import { SoftDeleteModel } from "mongoose-delete";
import { Service } from "@/shared/service";

@Injectable()
export class BookService extends Service<Book> {
	constructor(
		@InjectModel(Book.name)
		private bookModel: SoftDeleteModel<BookDocument>,
	) {
		super(bookModel);
	}
	category() {
		return this.bookModel.find().select("category").exec();
	}
	create(createBookDto: CreateBookDto) {
		return new this.bookModel(createBookDto).save(); 
	}
}
