"use client";

import { useState, useRef } from "react";
import { faqsData } from "@/data/faqs";

export default function FAQAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);
  const activeFaqs = faqsData.filter((f) => f.isActive).sort((a, b) => a.order - b.order);

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="section" id="faq">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">FAQ</span>
          <h2>Frequently asked questions.</h2>
          <p>
            Find immediate answers regarding onboarding steps, security, timelines, and payment plans.
          </p>
        </div>

        <div className="faq-layout">
          {activeFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} className={`faq-item ${isOpen ? "open" : ""}`}>
                <button
                  className="faq-question-btn"
                  onClick={() => toggleFAQ(faq.id)}
                  aria-expanded={isOpen}
                >
                  {faq.question}
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div 
                  className="faq-answer-panel"
                  style={{
                    maxHeight: isOpen ? "250px" : "0",
                    transition: "max-height 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease"
                  }}
                >
                  <div className="faq-answer-content">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
