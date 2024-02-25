import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateCartDto } from "./create-cart.dto";

export class UpdateCartDto extends PartialType(
	OmitType(CreateCartDto, ["book"] as const),
) {}
