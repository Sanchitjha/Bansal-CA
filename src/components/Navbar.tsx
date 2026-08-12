"use client";

import { useState } from "react";
import Link from "next/link";
import { servicesData } from "@/data/services";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState("EN");

  const activeServices = servicesData.filter((s) => s.isActive).sort((a, b) => a.order - b.order);

  return (
    <header className="header">
      <div className="container navbar-container">
        <Link href="/" className="logo">
          A&A<span>.</span>
        </Link>

        {/* Desktop and Mobile Menu */}
        <nav className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <Link href="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          
          <div className="nav-item-dropdown">
            <button className="dropdown-trigger">
              Services
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="dropdown-menu">
              {activeServices.map((service) => (
                <Link
                  key={service.id}
                  href={`#service-preview`}
                  className="dropdown-link"
                  onClick={() => {
                    setIsMenuOpen(false);
                    // Dispatch an event to update the service detail preview tab when clicked in header
                    const event = new CustomEvent("select-preview-service", { detail: service.id });
                    window.dispatchEvent(event);
                  }}
                >
                  {service.name}
                </Link>
              ))}
            </div>
          </div>

          <Link href="#about" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            About Us
          </Link>
          <Link href="#resources" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Resources
          </Link>
          <Link href="#faq" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Contact
          </Link>

          {/* Mobile Actions (Visible only inside hamburger list) */}
          <div className="nav-actions-mobile" style={{ display: "none" }}>
            <Link href="/self-client/login" className="btn btn-secondary" onClick={() => setIsMenuOpen(false)}>
              Login
            </Link>
            <Link href="#final-cta" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>
              Get a Free Consultation
            </Link>
          </div>
        </nav>

        {/* Right Side Actions */}
        <div className="nav-actions">
          {/* Language Selector */}
          <div className="lang-selector">
            <button className="lang-btn">
              {activeLanguage}
              <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L4 4L7 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="lang-dropdown">
              <button className="lang-option" onClick={() => setActiveLanguage("EN")}>
                EN (English)
              </button>
              <button className="lang-option" onClick={() => setActiveLanguage("ES")}>
                ES (Español)
              </button>
            </div>
          </div>

          <ThemeToggle />

          <Link href="/self-client/login" className="login-link">
            Login
          </Link>
          <Link href="#final-cta" className="btn btn-primary">
            Get a Free Consultation
          </Link>
        </div>

        {/* Hamburger Menu Toggle */}
        <button
          className={`menu-toggle ${isMenuOpen ? "active" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
