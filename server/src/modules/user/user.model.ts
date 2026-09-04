import { model, Schema } from "mongoose";
import { IUser } from "./user.types";

const userSchema = new Schema<IUser>(
  {
    externalAuthId: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    passwordHash: { type: String, select: false },
    roleId: { type: Schema.Types.ObjectId, ref: "Role", required: true },
    password: { type: String, select: false },
    status: {
      type: String,
      enum: ["INVITED", "ACTIVE", "SUSPENDED", "DEACTIVATED"],
      default: "INVITED",
      required: true,
    },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

userSchema.index({ status: 1 });
userSchema.index({ roleId: 1 });

export const UserModel = model<IUser>("User", userSchema);
