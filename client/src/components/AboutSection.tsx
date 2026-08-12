import Image from "next/image";
import Link from "next/link";

export default function AboutSection() {
  return (
    <section className="section" id="about">
      <div className="container about-grid">
        <div className="about-image-wrapper">
          <div className="about-image-decor"></div>
          <div className="about-image-container">
            <Image
              src="/assets/team.png"
              alt="Amit Bansal & Associates team collaborating in a modern office"
              width={600}
              height={600}
              quality={90}
            />
          </div>
        </div>

        <div className="about-content">
          <span className="eyebrow">About the Firm</span>
          <h2>More than numbers.<br />A partner for your business.</h2>
          <p>
            At Amit Bansal & Associates (A&A), we believe that professional accounting and tax advisory go far beyond math. We serve as strategic partners for growing businesses, translating complex tax codes and compliance guidelines into actionable insights.
          </p>
          <p>
            Our experienced team of advisors, accountants, and consultants handles all aspects of corporate registration, ongoing bookkeeping, payroll administration, and tax filing. We give business owners the freedom to build their ventures, secure in the knowledge that their compliance is managed by experts.
          </p>
          <Link href="#final-cta" className="btn btn-secondary btn-link">
            Learn About A&A
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.16669 7H12.8334M12.8334 7L7.00002 1.16667M12.8334 7L7.00002 12.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
