export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  isActive: boolean;
  order: number;
}

export const faqsData: FAQItem[] = [
  {
    id: "getting-started",
    question: "How do I get started?",
    answer: "Getting started is straightforward. Click 'Get a Free Consultation' to set up a call with an advisor, or explore our Services, choose the one that fits your requirements, and share your details. A dedicated expert will be assigned to review your case within 24 hours.",
    isActive: true,
    order: 1
  },
  {
    id: "documents-required",
    question: "What documents do I need?",
    answer: "The required documents vary based on the service. For income tax filing, you typically need Form 16, bank statements, and investment proofs. For company incorporation, we require identity proofs (PAN/Aadhaar/Passport) and proof of registered office address. Detailed document checklists are provided upon service selection.",
    isActive: true,
    order: 2
  },
  {
    id: "service-timeline",
    question: "How long does a service take?",
    answer: "Timelines depend on government processing queues and document completeness. Routine filings like ITR or GST take 3 to 5 business days, while registrations such as Company Incorporation or GST registration generally take 7 to 10 business days.",
    isActive: true,
    order: 3
  },
  {
    id: "payment-methods",
    question: "How do I make a payment?",
    answer: "We support secure online payments including credit/debit cards, net banking, UPI, and bank wire transfers. An invoice with a payment link is sent after we finalize your service scope, and payment rules depend on the milestone model selected.",
    isActive: true,
    order: 4
  },
  {
    id: "track-online",
    question: "Can I track my service online?",
    answer: "Yes, absolutely. Once onboarding is complete, you will receive login credentials for our Client Portal. Through the portal, you can upload documents, chat directly with your dedicated advisor, track the real-time progress of your filings, and download completed tax/incorporation certificates.",
    isActive: true,
    order: 5
  }
];
