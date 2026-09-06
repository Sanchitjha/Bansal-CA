"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { FieldError } from "@/components/ui/field-error";
import { Upload, CheckCircle2, AlertCircle, FileText, Calendar, ShieldCheck } from "lucide-react";

export type FieldType = "text" | "number" | "select" | "textarea" | "file" | "date" | "checkbox";

export interface FormFieldSchema {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  options?: { label: string; value: string }[];
  validation?: {
    min?: number;
    max?: number;
    regex?: string;
    regexMessage?: string;
  };
}

export interface DynamicFormSchema {
  version: string;
  serviceCode: string;
  serviceName: string;
  fields: FormFieldSchema[];
  requiredDocuments?: { id: string; name: string; required: boolean }[];
}

interface DynamicFormEngineProps {
  schema: DynamicFormSchema;
  onSubmit: (formData: Record<string, any>, files: Record<string, string>, snapshot: any) => Promise<void> | void;
  onCancel?: () => void;
  submitting?: boolean;
}

export function DynamicFormEngine({ schema, onSubmit, onCancel, submitting = false }: DynamicFormEngineProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const handleFileUpload = (fieldId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFiles((prev) => ({ ...prev, [fieldId]: file.name }));
      setFormData((prev) => ({ ...prev, [fieldId]: file.name }));
      if (errors[fieldId]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[fieldId];
          return next;
        });
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    for (const field of schema.fields) {
      const val = formData[field.id];

      if (field.required) {
        if (val === undefined || val === null || val === "" || (field.type === "checkbox" && !val)) {
          newErrors[field.id] = `${field.label} is mandatory.`;
          continue;
        }
      }

      if (val !== undefined && val !== "" && field.validation) {
        if (field.type === "number") {
          const num = Number(val);
          if (field.validation.min !== undefined && num < field.validation.min) {
            newErrors[field.id] = `Value must be at least ${field.validation.min}.`;
          }
          if (field.validation.max !== undefined && num > field.validation.max) {
            newErrors[field.id] = `Value must not exceed ${field.validation.max}.`;
          }
        }
        if (field.validation.regex && typeof val === "string") {
          const reg = new RegExp(field.validation.regex);
          if (!reg.test(val)) {
            newErrors[field.id] = field.validation.regexMessage || `Invalid format for ${field.label}.`;
          }
        }
      }
    }

    // Validate required documents
    if (schema.requiredDocuments) {
      for (const doc of schema.requiredDocuments) {
        if (doc.required && !uploadedFiles[doc.id]) {
          newErrors[doc.id] = `Please upload ${doc.name}.`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const requestSnapshot = {
      schemaVersion: schema.version,
      serviceCode: schema.serviceCode,
      serviceName: schema.serviceName,
      submittedAt: new Date().toISOString(),
      payload: formData,
      uploadedFiles,
    };

    onSubmit(formData, uploadedFiles, requestSnapshot);
  };

  return (
    <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden">
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Schema v{schema.version} • {schema.serviceCode}
          </div>
          <h3 className="text-base font-bold">{schema.serviceName} Application</h3>
        </div>
        <div className="flex items-center gap-1 text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Config-Driven Schema</span>
        </div>
      </div>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schema.fields.map((field) => (
              <div
                key={field.id}
                className={`space-y-1.5 ${field.type === "textarea" ? "md:col-span-2" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <Label htmlFor={field.id} className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    {field.label}
                    {field.required && <span className="text-red-500 font-bold">*</span>}
                  </Label>
                  {field.helpText && <span className="text-[11px] text-slate-400">{field.helpText}</span>}
                </div>

                {field.type === "text" && (
                  <Input
                    id={field.id}
                    placeholder={field.placeholder || `Enter ${field.label}`}
                    value={formData[field.id] || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className={errors[field.id] ? "border-red-400" : ""}
                  />
                )}

                {field.type === "number" && (
                  <Input
                    id={field.id}
                    type="number"
                    placeholder={field.placeholder || "0"}
                    value={formData[field.id] || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className={errors[field.id] ? "border-red-400" : ""}
                  />
                )}

                {field.type === "date" && (
                  <div className="relative">
                    <Input
                      id={field.id}
                      type="date"
                      value={formData[field.id] || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className={errors[field.id] ? "border-red-400" : ""}
                    />
                  </div>
                )}

                {field.type === "select" && (
                  <select
                    id={field.id}
                    value={formData[field.id] || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className={`w-full h-10 px-3 py-2 text-sm border rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                      errors[field.id] ? "border-red-400" : "border-slate-200"
                    }`}
                  >
                    <option value="">Select option...</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}

                {field.type === "textarea" && (
                  <textarea
                    id={field.id}
                    rows={3}
                    placeholder={field.placeholder || "Provide additional notes or instructions"}
                    value={formData[field.id] || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className={`w-full p-2.5 text-sm border rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                      errors[field.id] ? "border-red-400" : "border-slate-200"
                    }`}
                  />
                )}

                {field.type === "checkbox" && (
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      id={field.id}
                      type="checkbox"
                      checked={!!formData[field.id]}
                      onChange={(e) => handleInputChange(field.id, e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <label htmlFor={field.id} className="text-xs text-slate-600 cursor-pointer">
                      {field.placeholder || "I confirm the accuracy of information submitted"}
                    </label>
                  </div>
                )}

                {errors[field.id] && <FieldError message={errors[field.id]} />}
              </div>
            ))}
          </div>

          {schema.requiredDocuments && schema.requiredDocuments.length > 0 && (
            <div className="border-t border-slate-100 pt-4 mt-6">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                Required Supporting Documents
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {schema.requiredDocuments.map((doc) => {
                  const isUploaded = !!uploadedFiles[doc.id];
                  return (
                    <div
                      key={doc.id}
                      className={`p-3 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                        isUploaded
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                          : errors[doc.id]
                          ? "bg-red-50 border-red-200 text-red-800"
                          : "bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isUploaded ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Upload className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <div>
                          <div className="font-semibold">{doc.name}</div>
                          <div className="text-[10px] text-slate-400">
                            {isUploaded ? uploadedFiles[doc.id] : doc.required ? "Required file (.pdf, .jpg, .png)" : "Optional"}
                          </div>
                        </div>
                      </div>

                      <label className="cursor-pointer px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-100 rounded text-[11px] font-medium text-slate-700 shadow-sm">
                        {isUploaded ? "Replace" : "Upload"}
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => handleFileUpload(doc.id, e)}
                        />
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={submitting}
              className="bg-[#0B1528] hover:bg-[#1e293b] text-white px-6"
            >
              {submitting ? "Submitting Application..." : "Submit & Generate Request ID"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
