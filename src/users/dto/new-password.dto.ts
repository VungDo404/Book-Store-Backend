import { IsEmail, IsString } from "class-validator";

export class NewPasswordDto{
    @IsEmail()
    @IsString()
    email: string

    @IsString()
    oldpass: string

    @IsString()
    newpass: string
}