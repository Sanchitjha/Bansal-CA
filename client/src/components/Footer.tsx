import Link from "next/link";
import { servicesData } from "@/data/services";

export default function Footer() {
  const activeServices = servicesData
    .filter((s) => s.isActive)
    .sort((a, b) => a.order - b.order)
    .slice(0, 5); // Display top 5 in footer to keep clean

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          {/* Brand Info Column */}
          <div>
            <div className="footer-logo">
              A&A<span>.</span>
            </div>
            <p className="footer-desc">
              Amit Bansal & Associates (A&A) is a professional accounting, taxation, compliance, and business advisory firm. We help enterprises stay compliant while focusing on sustainable business growth.
            </p>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="footer-col-title">Services</h4>
            <ul className="footer-links">
              {activeServices.map((service) => (
                <li key={service.id}>
                  <Link href="#services" className="footer-link">
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="footer-col-title">Company</h4>
            <ul className="footer-links">
              <li>
                <Link href="#about" className="footer-link">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#why-choose-us" className="footer-link">
                  Why A&A
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="footer-link">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#faq" className="footer-link">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="footer-col-title">Resources</h4>
            <ul className="footer-links">
              <li>
                <Link href="#resources" className="footer-link">
                  Insights & Articles
                </Link>
              </li>
              <li>
                <Link href="#resources" className="footer-link">
                  Tax Updates
                </Link>
              </li>
              <li>
                <Link href="#resources" className="footer-link">
                  Compliance Checklists
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="footer-col-title">Contact Us</h4>
            <div className="footer-contact-info">
              <p className="footer-contact-item">
                <strong>Enquiries:</strong><br />
                info@bansalassociates.com
              </p>
              <p className="footer-contact-item">
                <strong>Phone:</strong><br />
                +1 (555) 019-2834
              </p>
              <p className="footer-contact-item">
                <strong>Office:</strong><br />
                402 Ocean Drive, Suite 12B,<br />
                Miami, FL 33139
              </p>
            </div>
          </div>
        </div>

        {/* Legal and Copyright bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Amit Bansal & Associates. All rights reserved.</p>
          <div className="footer-legal-links">
            <Link href="#" className="footer-legal-link">
              Privacy Policy
            </Link>
            <Link href="#" className="footer-legal-link">
              Terms & Conditions
            </Link>
            <Link href="#" className="footer-legal-link">
              Refund & Cancellation Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
