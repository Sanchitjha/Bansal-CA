"use client";

import { useState, useEffect, useRef } from "react";
import { servicesData, ServiceItem } from "@/data/services";

export default function ServiceDetailPreview() {
  const activeServices = servicesData
    .filter((service) => service.isActive)
    .sort((a, b) => a.order - b.order);

  const [selectedServiceId, setSelectedServiceId] = useState<string>(activeServices[0]?.id || "");
  const [activeSubTab, setActiveSubTab] = useState<string>("overview");
  const sectionRef = useRef<HTMLElement>(null);

  const selectedService = activeServices.find((s) => s.id === selectedServiceId) || activeServices[0];

  useEffect(() => {
    const handleSelectService = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const serviceId = customEvent.detail;
      if (activeServices.some((s) => s.id === serviceId)) {
        setSelectedServiceId(serviceId);
        setActiveSubTab("overview");
        
        // Smooth scroll to the preview section
        if (sectionRef.current) {
          sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };

    window.addEventListener("select-preview-service", handleSelectService);
    return () => {
      window.removeEventListener("select-preview-service", handleSelectService);
    };
  }, [activeServices]);

  if (!selectedService) return null;

  const subTabs = [
    { id: "overview", label: "Overview" },
    { id: "who-it-is-for", label: "Who It's For" },
    { id: "documents", label: "Documents Required" },
    { id: "process", label: "Our Process" },
    { id: "timeline-pricing", label: "Timeline & Pricing" },
    { id: "faqs", label: "Service FAQs" }
  ];

  return (
    <section className="section" id="service-preview" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Service Blueprint</span>
          <h2>Explore our service structures.</h2>
          <p>
            We maintain complete transparency. Select a service to see what is required, how we process it, and what to expect.
          </p>
        </div>

        <div className="service-preview-layout">
          {/* Sidebar Tabs - Services */}
          <div className="service-preview-sidebar">
            <h3 className="sidebar-title">Available Services</h3>
            {activeServices.map((service) => (
              <button
                key={service.id}
                className={`preview-tab-btn ${selectedService.id === service.id ? "active" : ""}`}
                onClick={() => {
                  setSelectedServiceId(service.id);
                  setActiveSubTab("overview");
                }}
              >
                {service.name}
              </button>
            ))}
          </div>

          {/* Details Panel - Active Service details */}
          <div className="service-preview-content">
            {/* Service Header Info */}
            <div className="preview-header">
              <div className="preview-header-left">
                <h3>{selectedService.name}</h3>
                <p className="preview-desc">{selectedService.shortDesc}</p>
              </div>
            </div>

            {/* Sub-navigation tabs (Overview, Process, documents etc.) */}
            <div 
              style={{
                display: "flex",
                gap: "1.5rem",
                borderBottom: "1px solid var(--color-border)",
                marginBottom: "2rem",
                overflowX: "auto",
                paddingBottom: "0.5rem"
              }}
            >
              {subTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  style={{
                    padding: "0.5rem 0",
                    fontSize: "0.8125rem",
                    fontWeight: activeSubTab === tab.id ? "600" : "500",
                    color: activeSubTab === tab.id ? "var(--color-orange)" : "var(--color-text-secondary)",
                    borderBottom: activeSubTab === tab.id ? "2px solid var(--color-orange)" : "2px solid transparent",
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap"
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Active Sub-tab Content Area */}
            <div style={{ flex: 1, minHeight: "220px" }}>
              {activeSubTab === "overview" && (
                <div>
                  <h4 className="preview-section-title">Overview</h4>
                  <p style={{ fontSize: "0.9375rem", lineHeight: "1.7", color: "var(--color-text-primary)" }}>
                    {selectedService.details.overview}
                  </p>
                </div>
              )}

              {activeSubTab === "who-it-is-for" && (
                <div>
                  <h4 className="preview-section-title">Who It's For</h4>
                  <ul className="preview-list">
                    {selectedService.details.whoItIsFor.map((item, idx) => (
                      <li key={idx} className="preview-list-item">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeSubTab === "documents" && (
                <div>
                  <h4 className="preview-section-title">Documents Required</h4>
                  <ul className="preview-list">
                    {selectedService.details.documentsRequired.map((doc, idx) => (
                      <li key={idx} className="preview-list-item">
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeSubTab === "process" && (
                <div>
                  <h4 className="preview-section-title">Process Workflow</h4>
                  <div className="preview-process">
                    {selectedService.details.process.map((step, idx) => (
                      <div key={idx} className="preview-process-step">
                        <span className="preview-process-num">0{idx + 1}</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSubTab === "timeline-pricing" && (
                <div>
                  <div className="preview-meta-row">
                    <div>
                      <h4 className="preview-section-title">Expected Timeline</h4>
                      <p className="preview-meta-value">{selectedService.details.timeline}</p>
                    </div>
                    <div>
                      <h4 className="preview-section-title">Pricing Details</h4>
                      <p className="preview-meta-value">{selectedService.details.pricing}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeSubTab === "faqs" && (
                <div>
                  <h4 className="preview-section-title">Frequently Asked Questions</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {selectedService.details.faqs.map((faq, idx) => (
                      <div key={idx} style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "1rem" }}>
                        <h5 style={{ fontSize: "0.9375rem", color: "var(--color-navy)", marginBottom: "0.35rem", fontWeight: "600" }}>
                          {faq.question}
                        </h5>
                        <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action CTA */}
            <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1.75rem", marginTop: "2rem" }}>
              <a href="#final-cta" className="btn btn-primary">
                Get a Quote for this Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
