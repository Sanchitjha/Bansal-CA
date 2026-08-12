import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="section final-cta" id="final-cta">
      <div className="container final-cta-container">
        <span className="eyebrow" style={{ color: "var(--color-orange)" }}>Get in Touch</span>
        <h2>Let’s make your finances simpler.</h2>
        <p>
          Talk to our team about your accounting, tax, and compliance requirements. Get a free consultation and let us take the complexity off your shoulders.
        </p>
        <Link href="mailto:info@bansalassociates.com" className="btn btn-primary" style={{ minWidth: "220px" }}>
          Get a Free Consultation
        </Link>
      </div>
    </section>
  );
}
