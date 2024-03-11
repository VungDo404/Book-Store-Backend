import { IsEmail, IsMongoId, IsString } from "class-validator"

export class AccountDto{
    @IsMongoId()
    _id: string
    @IsEmail()
    email: string
    @IsString()
    fullName: string 
    @IsString()
    role: string
    @IsString()
    avatar: string 
    @IsString()
    phone: string
}