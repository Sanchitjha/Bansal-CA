"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useSelfClient } from "@/components/self-client/SelfClientProvider";
import { servicesData } from "@/data/services";
import type { SelfClientCase } from "@/data/selfClientMock";

const activeServices = servicesData.filter((s) => s.isActive).sort((a, b) => a.order - b.order);

export default function NewServiceRequestPage() {
  const { addCase } = useSelfClient();
  const [serviceId, setServiceId] = useState(activeServices[0]?.id || "");
  const [notes, setNotes] = useState("");
  const [createdCase, setCreatedCase] = useState<SelfClientCase | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const service = activeServices.find((s) => s.id === serviceId);
    if (!service) return;

    const priceMatch = service.details.pricing.match(/\$(\d+)/);
    const amount = priceMatch ? Number(priceMatch[1]) : 0;

    const newCase = addCase({
      serviceId: service.id,
      serviceName: service.name,
      amount,
      notes: notes.trim() || undefined,
    });
    setCreatedCase(newCase);
    setNotes("");
  };

  if (createdCase) {
    return (
      <div className="portal-panel">
        <h1>Request submitted</h1>
        <p>
          Your request for <strong>{createdCase.serviceName}</strong> has been created as case{" "}
          <strong>{createdCase.id}</strong>. Our team will review it and update the status shortly.
        </p>
        <div className="portal-form-actions">
          <Link href={`/self-client/cases/${createdCase.id}`} className="btn btn-primary">
            View Case
          </Link>
          <button type="button" className="btn btn-secondary" onClick={() => setCreatedCase(null)}>
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  const selectedService = activeServices.find((s) => s.id === serviceId);

  return (
    <div>
      <div className="portal-page-header">
        <div>
          <h1>New Service Request</h1>
          <p>Select a service to start a new case. Pricing and requirements are shown before you submit.</p>
        </div>
      </div>

      <div className="portal-two-col">
        <div className="portal-panel">
          <form className="portal-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="service">Service</label>
              <select
                id="service"
                className="form-select"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
              >
                {activeServices.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="notes">Notes (optional)</label>
              <textarea
                id="notes"
                className="form-textarea"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tell us anything relevant about your requirement..."
                rows={4}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Submit Request
            </button>
          </form>
        </div>

        {selectedService && (
          <div className="portal-panel">
            <div className="portal-panel-header">
              <h2>{selectedService.name}</h2>
            </div>
            <p className="preview-desc">{selectedService.details.overview}</p>
            <div className="preview-meta-row">
              <div>
                <span className="preview-section-title">Timeline</span>
                <p className="preview-meta-value">{selectedService.details.timeline}</p>
              </div>
              <div>
                <span className="preview-section-title">Pricing</span>
                <p className="preview-meta-value">{selectedService.details.pricing}</p>
              </div>
            </div>
            <span className="preview-section-title">Documents Required</span>
            <ul className="preview-list">
              {selectedService.details.documentsRequired.map((doc) => (
                <li key={doc} className="preview-list-item">{doc}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
