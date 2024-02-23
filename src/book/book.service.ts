import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Book, BookDocument } from "./schemas/book.schema";
import { SoftDeleteModel } from "mongoose-delete";
import mongoose from "mongoose";
import { Pagination } from "@/shared/pagination";

@Injectable()
export class BookService extends Pagination<Book> {
	constructor(
		@InjectModel(Book.name)
		private bookModel: SoftDeleteModel<BookDocument>,
	) {
		super(bookModel);
	}
	create(createBookDto: CreateBookDto) {
		return new this.bookModel(createBookDto).save();
	}

	findOne(id: string) {
		return this.bookModel.findById(id).select("author").exec();
	}

	category() {
		return this.bookModel.find().select("category").exec();
	}

	update(id: string, updateBookDto: UpdateBookDto) {
		if (!mongoose.isValidObjectId(id)) {
			throw new NotFoundException(`No book found with id ${id}`);
		}
		return this.bookModel.updateOne({ _id: id }, updateBookDto).exec();
	}

	remove(id: string) {
		if (!mongoose.isValidObjectId(id)) {
			throw new NotFoundException(`No book found with id ${id}`);
		}
		return this.bookModel.deleteById(id).exec();
	}
}
