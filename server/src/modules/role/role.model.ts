import { model, Schema } from "mongoose";
import { IRole } from "./role.types";

const roleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true, unique: true, trim: true, uppercase: true },
    permissions: [{ type: String, trim: true }],
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

export const RoleModel = model<IRole>("Role", roleSchema);
