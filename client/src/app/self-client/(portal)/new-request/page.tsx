"use client";

import { useState } from "react";
import Link from "next/link";
import { useSelfClient } from "@/components/self-client/SelfClientProvider";
import { servicesData } from "@/data/services";
import { SERVICE_SCHEMAS } from "@/data/serviceSchemas";
import { DynamicFormEngine } from "@/components/forms/DynamicFormEngine";
import type { SelfClientCase } from "@/data/selfClientMock";
import { CheckCircle2, ShieldCheck, FileText, Clock, Layers } from "lucide-react";
import { toast } from "sonner";

const activeServices = servicesData.filter((s) => s.isActive).sort((a, b) => a.order - b.order);

export default function NewServiceRequestPage() {
  const { addCase } = useSelfClient();
  const [serviceId, setServiceId] = useState(activeServices[0]?.id || "income-tax");
  const [createdCase, setCreatedCase] = useState<SelfClientCase | null>(null);
  const [submittedSnapshot, setSubmittedSnapshot] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const selectedService = activeServices.find((s) => s.id === serviceId);
  const dynamicSchema = SERVICE_SCHEMAS[serviceId] || {
    version: "1.0.0",
    serviceCode: serviceId.toUpperCase(),
    serviceName: selectedService?.name || "Professional Service",
    fields: [
      {
        id: "generalRequirements",
        name: "generalRequirements",
        label: "Specific Filing / Advisory Instructions",
        type: "textarea",
        placeholder: "Provide complete details about your requirement...",
        required: true,
      },
      {
        id: "consent",
        name: "consent",
        label: "Verification Confirmation",
        type: "checkbox",
        placeholder: "I certify that all details and documents provided are genuine.",
        required: true,
      },
    ],
    requiredDocuments: [
      { id: "doc-id-proof", name: "Identity Proof (PAN / Aadhar)", required: true },
      { id: "doc-financial", name: "Relevant Financial Records", required: false },
    ],
  };

  const handleDynamicSubmit = async (formData: Record<string, any>, files: Record<string, string>, snapshot: any) => {
    if (!selectedService) return;
    setSubmitting(true);

    const priceMatch = selectedService.details.pricing.match(/\$(\d+)/);
    const amount = priceMatch ? Number(priceMatch[1]) : 75;

    const requestSummary = Object.entries(formData)
      .filter(([k]) => k !== "declaration" && k !== "consent")
      .map(([k, v]) => `${k}: ${v}`)
      .join(" | ");

    try {
      const newCase = await addCase({
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        amount,
        notes: `[Schema v${snapshot.schemaVersion}] ${requestSummary}`,
      });
      setCreatedCase(newCase);
      setSubmittedSnapshot(snapshot);
      toast.success(`Service request submitted successfully! Case ID: ${newCase.id}`);
    } catch (err) {
      console.error("Failed to submit request", err);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (createdCase) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <span className="text-[10px] bg-blue-100 text-blue-800 font-mono px-2 py-0.5 rounded font-bold uppercase">
              Request ID: {createdCase.id}
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">Application Submitted Successfully</h1>
            <p className="text-sm text-slate-500 max-w-lg mx-auto mt-1">
              Your request for <strong>{createdCase.serviceName}</strong> has been routed to an expert compliance team member.
            </p>
          </div>

          {submittedSnapshot && (
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-left text-xs max-w-xl mx-auto space-y-2">
              <div className="flex items-center justify-between text-slate-500 pb-1 border-b border-slate-200">
                <span className="font-semibold">Immutable Schema Version:</span>
                <span className="font-mono text-slate-700">v{submittedSnapshot.schemaVersion}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 pb-1 border-b border-slate-200">
                <span className="font-semibold">Timestamp:</span>
                <span className="text-slate-700">{new Date(submittedSnapshot.submittedAt).toLocaleString()}</span>
              </div>
              <div className="text-slate-500">
                <span className="font-semibold">Documents Attached:</span>{" "}
                <span className="text-emerald-700 font-medium">
                  {Object.values(submittedSnapshot.uploadedFiles).join(", ") || "Uploaded via form"}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-3 pt-4">
            <Link
              href="/self-client/cases"
              className="px-5 py-2.5 bg-[#0B1528] hover:bg-[#1e293b] text-white rounded-lg text-sm font-semibold shadow-sm"
            >
              Track Case in Dashboard
            </Link>
            <button
              type="button"
              onClick={() => {
                setCreatedCase(null);
                setSubmittedSnapshot(null);
              }}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold"
            >
              Submit Another Service
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
            Config-Driven Service Submission
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">New Service Application</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Choose a service from our catalog. Dynamic form requirements and document checklists load automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Service Selector & Dynamic Form */}
        <div className="lg:col-span-8 space-y-6">
          {/* Service Selector Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Step 1: Choose Service from Catalog
            </label>
            <select
              id="service"
              className="w-full h-11 px-3 text-sm font-medium border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-slate-900"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
            >
              {activeServices.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} — {service.details.pricing}
                </option>
              ))}
            </select>
          </div>

          {/* Dynamic Form Engine */}
          <div>
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Step 2: Complete Dynamic Service Schema
            </div>
            <DynamicFormEngine
              key={serviceId}
              schema={dynamicSchema}
              onSubmit={handleDynamicSubmit}
              submitting={submitting}
            />
          </div>
        </div>

        {/* Right Column: Service Specifications & Overview */}
        {selectedService && (
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded font-bold uppercase">
                  {(selectedService as any).category || selectedService.id.toUpperCase()}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1.5">{selectedService.name}</h2>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{selectedService.details.overview}</p>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" /> SLA Timeline
                  </div>
                  <div className="text-xs font-bold text-slate-800 mt-1">{selectedService.details.timeline}</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Layers className="w-3 h-3" /> Pricing
                  </div>
                  <div className="text-xs font-bold text-blue-900 mt-1">{selectedService.details.pricing}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Required Documents & Process
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {(selectedService.details?.documentsRequired || selectedService.details?.process || []).slice(0, 3).map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

