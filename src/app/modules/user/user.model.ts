import { model, Schema } from "mongoose";
import { IsActive, IUser, Role } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "name is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "name is required"],
      unique: true,
      trim: true,
    },
    picture: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    commissionRate: {
      type: Number,
    },
  },
  { versionKey: false, timestamps: true }
);

export const User = model<IUser>("User", userSchema);
