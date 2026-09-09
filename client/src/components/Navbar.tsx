"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { servicesData } from "@/data/services";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const servicesMenuRef = useRef<HTMLDivElement>(null);

  const activeServices = servicesData.filter((s) => s.isActive).sort((a, b) => a.order - b.order);

  useEffect(() => {
    const closeServicesMenu = (event: MouseEvent) => {
      if (!servicesMenuRef.current?.contains(event.target as Node)) setIsServicesOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsServicesOpen(false);
    };

    document.addEventListener("mousedown", closeServicesMenu);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeServicesMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <header className="header">
      <div className="container navbar-container">
        <Link href="/" className="logo">
          A&A<span>.</span>
        </Link>

        {/* Desktop and Mobile Menu */}
        <nav className={`nav-menu ${isMenuOpen ? "active" : ""}`} id="marketing-navigation" aria-label="Main navigation">
          <Link href="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          
          <div className="marketing-dropdown" ref={servicesMenuRef}>
            <button
              type="button"
              className="marketing-dropdown-trigger"
              onClick={() => setIsServicesOpen((open) => !open)}
              aria-expanded={isServicesOpen}
              aria-haspopup="menu"
              aria-controls="marketing-services-menu"
            >
              Services
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div
              className={`marketing-dropdown-menu ${isServicesOpen ? "is-open" : ""}`}
              id="marketing-services-menu"
              role="menu"
            >
              {activeServices.map((service) => (
                <Link
                  key={service.id}
                  href={`#service-preview`}
                  className="marketing-dropdown-link"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsServicesOpen(false);
                    // Dispatch an event to update the service detail preview tab when clicked in header
                    const event = new CustomEvent("select-preview-service", { detail: service.id });
                    window.dispatchEvent(event);
                  }}
                  role="menuitem"
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
          aria-expanded={isMenuOpen}
          aria-controls="marketing-navigation"
          type="button"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
