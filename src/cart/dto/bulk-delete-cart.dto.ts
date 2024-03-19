import { IsArray, IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class BulkDeleteCartDto{
    @IsArray()
    @IsNotEmpty()
    @IsString({each: true})
    @IsMongoId({each: true})
    id: string[]
}