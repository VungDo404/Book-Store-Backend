import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { CreateBookDto } from "./dto/create-book.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Book, BookDocument } from "./schemas/book.schema";
import { SoftDeleteModel } from "mongoose-delete";
import { Service } from "@/shared/service";
import { ObjectId } from "mongoose";
import { BOOK_SEEDING } from "./book.seeding";
import { UpdateBookDto } from "./dto/update-book.dto";

@Injectable()
export class BookService extends Service<Book> {
	constructor(
		@InjectModel(Book.name)
		private bookModel: SoftDeleteModel<BookDocument>,
	) {
		super(bookModel);
	}
	category() {
		return this.bookModel
			.find()
			.select("category -_id")
			.sort({ category: 1 })
			.exec()
			.then((categories) => {
				return categories.map((category) => category.category);
			});
	}
	create(createBookDto: CreateBookDto) {
		return new this.bookModel(createBookDto).save();
	}
	async updateBookQuantity(_id: string | ObjectId, quantity: number) {
		const res  = (await this.bookModel.findById(_id));
		const bookDetail = res ? res.toObject() : null; 
		if (!bookDetail)
			throw new NotFoundException(
				"Cannot found the book with given book id"
			);
		if (bookDetail.quantity > quantity) {
			await this.bookModel.updateOne(
				{ _id },
				{ quantity: bookDetail.quantity - quantity },
			);
		} else
			throw new BadRequestException(
				"You have exceeded the current book's quantity",
			);
	}
	async seeding(): Promise<boolean> {
		const count = await this.bookModel.countDocuments();
		if (!count) {
			await this.bookModel.insertMany(BOOK_SEEDING);
			return true;
		}
		return false;
	}
	async getCount(): Promise<number> {
		return this.bookModel.countDocuments();
	}
	update(id: string, updateDto: UpdateBookDto) {
		return this.model.updateOne({ _id: id }, updateDto).exec();
	}
}
