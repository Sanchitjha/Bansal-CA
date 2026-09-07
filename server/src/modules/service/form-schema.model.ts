import { Schema, model, Document, Types } from "mongoose";

export interface IFormField {
  fieldKey: string;
  label: string;
  type: "TEXT" | "NUMBER" | "DATE" | "SELECT" | "MULTISELECT" | "TEXTAREA" | "BOOLEAN" | "FILE";
  required: boolean;
  defaultValue?: any;
  placeholder?: string;
  regexPattern?: string;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  options?: Array<{ label: string; value: string }>;
  conditionalOn?: {
    fieldKey: string;
    equalsValue: any;
  };
}

export interface IFormSchema extends Document {
  serviceId: Types.ObjectId;
  version: number;
  title: string;
  description?: string;
  fields: IFormField[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const formFieldSchema = new Schema<IFormField>({
  fieldKey: { type: String, required: true, trim: true },
  label: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: ["TEXT", "NUMBER", "DATE", "SELECT", "MULTISELECT", "TEXTAREA", "BOOLEAN", "FILE"],
    required: true,
  },
  required: { type: Boolean, default: false },
  defaultValue: { type: Schema.Types.Mixed },
  placeholder: { type: String },
  regexPattern: { type: String },
  minLength: { type: Number },
  maxLength: { type: Number },
  minValue: { type: Number },
  maxValue: { type: Number },
  options: [
    {
      label: { type: String, required: true },
      value: { type: String, required: true },
    },
  ],
  conditionalOn: {
    fieldKey: { type: String },
    equalsValue: { type: Schema.Types.Mixed },
  },
});

const formSchemaDef = new Schema<IFormSchema>(
  {
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true, index: true },
    version: { type: Number, required: true, default: 1 },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    fields: [formFieldSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

formSchemaDef.index({ serviceId: 1, version: 1 }, { unique: true });

export const FormSchemaModel = model<IFormSchema>("FormSchema", formSchemaDef);
