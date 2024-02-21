import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({type: mongoose.Schema.Types.ObjectId, auto: true})
  _id: string | mongoose.Types.ObjectId;

  @Prop({ required: true, type: String})
  fullName: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ required: true, type: String })
  email: string;

  @Prop({ type: String })
  phone: string;

  @Prop({ required: true, type: String})
  role: string;

  @Prop({ type: String })
  avatar: string;

  @Prop({ type: String })
  refreshToken: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
