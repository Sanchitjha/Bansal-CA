import { BadRequestException } from "../../common/errors/http-exception";
import { FormSchemaModel, IFormSchema, IFormField } from "./form-schema.model";

export class DynamicFormService {
  public async validateFormData(serviceId: string, version: number, data: Record<string, any>): Promise<void> {
    const schema = await FormSchemaModel.findOne({ serviceId, version, isActive: true });
    if (!schema) {
      // If no dynamic form schema is explicitly published, bypass dynamic validation
      return;
    }

    this.validateFields(schema.fields, data);
  }

  public validateFields(fields: IFormField[], data: Record<string, any>): void {
    const errors: string[] = [];

    for (const field of fields) {
      // Check conditional visibility
      if (field.conditionalOn) {
        const parentVal = data[field.conditionalOn.fieldKey];
        if (parentVal !== field.conditionalOn.equalsValue) {
          continue; // Skip validation if field condition is not met
        }
      }

      const val = data[field.fieldKey];

      // Required check
      if (field.required && (val === undefined || val === null || val === "")) {
        errors.push(`Field '${field.label}' (${field.fieldKey}) is required.`);
        continue;
      }

      if (val === undefined || val === null || val === "") {
        continue; // Optional empty field
      }

      // Regex validation
      if (field.regexPattern) {
        const regex = new RegExp(field.regexPattern);
        if (!regex.test(String(val))) {
          errors.push(`Field '${field.label}' does not match required pattern.`);
        }
      }

      // String length check
      if (field.type === "TEXT" || field.type === "TEXTAREA") {
        const str = String(val);
        if (field.minLength !== undefined && str.length < field.minLength) {
          errors.push(`Field '${field.label}' must be at least ${field.minLength} characters.`);
        }
        if (field.maxLength !== undefined && str.length > field.maxLength) {
          errors.push(`Field '${field.label}' must be at most ${field.maxLength} characters.`);
        }
      }

      // Number bounds check
      if (field.type === "NUMBER") {
        const num = Number(val);
        if (isNaN(num)) {
          errors.push(`Field '${field.label}' must be a valid number.`);
        } else {
          if (field.minValue !== undefined && num < field.minValue) {
            errors.push(`Field '${field.label}' must be at least ${field.minValue}.`);
          }
          if (field.maxValue !== undefined && num > field.maxValue) {
            errors.push(`Field '${field.label}' must be at most ${field.maxValue}.`);
          }
        }
      }

      // Select / Multiselect validation
      if (field.type === "SELECT" && field.options && field.options.length > 0) {
        const validValues = field.options.map((o) => o.value);
        if (!validValues.includes(String(val))) {
          errors.push(`Invalid option selected for '${field.label}'.`);
        }
      }
    }

    if (errors.length > 0) {
      throw new BadRequestException(`Form validation failed: ${errors.join(" ")}`);
    }
  }
}
