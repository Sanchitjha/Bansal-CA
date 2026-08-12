"use client";

import { servicesData } from "@/data/services";

// Helper component for crisp SVG icons
function ServiceIcon({ type }: { type: string }) {
  const iconProps = {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "service-icon"
  };

  switch (type) {
    case "tax":
      return (
        <svg {...iconProps}>
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case "gst":
      return (
        <svg {...iconProps}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "incorporation":
      return (
        <svg {...iconProps}>
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
          <line x1="9" y1="22" x2="9" y2="16" />
          <line x1="15" y1="22" x2="15" y2="16" />
          <line x1="9" y1="16" x2="15" y2="16" />
          <path d="M8 6h8" />
          <path d="M8 10h8" />
        </svg>
      );
    case "bookkeeping":
      return (
        <svg {...iconProps}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5V4.5z" />
          <line x1="8" y1="6" x2="16" y2="6" />
          <line x1="8" y1="11" x2="16" y2="11" />
        </svg>
      );
    case "foreign":
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    case "payroll":
      return (
        <svg {...iconProps}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <line x1="16" y1="2" x2="16" y2="4" />
          <line x1="8" y1="2" x2="8" y2="4" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <path d="M12 14v4" />
          <path d="M9 16h6" />
        </svg>
      );
    case "withholding":
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <line x1="22" y1="5" x2="2" y2="19" />
        </svg>
      );
    case "1099":
      return (
        <svg {...iconProps}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M8 12h3" />
          <path d="M8 16h8" />
        </svg>
      );
    default:
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      );
  }
}

export default function ServiceGrid() {
  const activeServices = servicesData
    .filter((service) => service.isActive)
    .sort((a, b) => a.order - b.order);

  const handleExplore = (serviceId: string) => {
    // Select the service in the Detail Preview section dynamically
    const event = new CustomEvent("select-preview-service", { detail: serviceId });
    window.dispatchEvent(event);
  };

  return (
    <section className="section" id="services">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Our Expertise</span>
          <h2>Everything your business needs to stay compliant.</h2>
          <p>
            From regulatory corporate filings to operational bookkeeping, we provide tailored financial compliance and tax advisory services.
          </p>
        </div>

        <div className="services-grid">
          {activeServices.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-icon-wrapper">
                <ServiceIcon type={service.icon} />
              </div>
              <h3 className="service-name">{service.name}</h3>
              <p className="service-desc">{service.shortDesc}</p>
              <a
                href="#service-preview"
                className="service-link"
                onClick={() => handleExplore(service.id)}
              >
                Explore Service
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.16669 7H12.8334M12.8334 7L7.00002 1.16667M12.8334 7L7.00002 12.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
