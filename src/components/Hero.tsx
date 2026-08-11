import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="section hero">
      <div className="container hero-grid">
        <div className="hero-content">
          <span className="eyebrow">Tax • Accounting • Compliance</span>
          <h1 className="hero-title">
            Tax & Accounting,<br />
            Made Simple.
          </h1>
          <p className="hero-description">
            From tax compliance and bookkeeping to business registrations and payroll, A&A helps businesses stay compliant while focusing on what matters — growth.
          </p>
          <div className="hero-ctas">
            <Link href="#final-cta" className="btn btn-primary">
              Get a Free Consultation
            </Link>
            <Link href="#services" className="btn btn-secondary">
              Explore Services
            </Link>
          </div>
          <div className="hero-trust-statement">
            Trusted by businesses for reliable accounting & compliance.
          </div>
        </div>

        <div className="hero-image-wrapper">
          <div className="hero-image-decor"></div>
          <div className="hero-image-container">
            <Image
              src="/assets/consultation.png"
              alt="Professional accounting and consultation at Amit Bansal & Associates"
              width={600}
              height={600}
              priority
              quality={90}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
