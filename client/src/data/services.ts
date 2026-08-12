export interface ServiceDetailSection {
  overview: string;
  whoItIsFor: string[];
  documentsRequired: string[];
  process: string[];
  timeline: string;
  pricing: string;
  faqs: { question: string; answer: string }[];
}

export interface ServiceItem {
  id: string;
  name: string;
  shortDesc: string;
  icon: string;
  details: ServiceDetailSection;
  isActive: boolean;
  order: number;
}

export const servicesData: ServiceItem[] = [
  {
    id: "income-tax",
    name: "Income Tax Return Filing",
    shortDesc: "End-to-end tax preparation and filing for individuals, partner firms, and corporate entities, ensuring compliance and maximizing tax deductions.",
    icon: "tax",
    isActive: true,
    order: 1,
    details: {
      overview: "Our Income Tax Return Filing service provides comprehensive assistance in preparing, reviewing, and filing tax returns. We handle all complexities of income sources, deductions, and foreign tax credits, ensuring complete compliance with the latest tax laws.",
      whoItIsFor: [
        "Salaried individuals with complex investment portfolios",
        "Proprietorships, LLP, and partnership firms",
        "Private and Public Limited companies",
        "Non-resident Indians (NRIs) with Indian income sources"
      ],
      documentsRequired: [
        "Form 16 / Form 16A",
        "Bank statements for the financial year",
        "Investment proofs (80C, 80D, etc.)",
        "Capital gains statements from brokers"
      ],
      process: [
        "Upload your tax documents via our secure client portal",
        "A dedicated tax expert reviews your documents and prepares tax computations",
        "Draft tax calculation shared with you for approval",
        "Final return is electronically filed, and ITR-V acknowledgment is shared"
      ],
      timeline: "3 to 5 business days after all documents are received.",
      pricing: "Starting at $75 for individuals, varying by complexity and business revenue.",
      faqs: [
        {
          question: "When is the deadline to file my income tax return?",
          answer: "The standard deadline is July 31st for individuals and non-audit cases, and October 31st for corporate or audit cases, unless extended by the tax department."
        },
        {
          question: "What happens if I miss the filing deadline?",
          answer: "Filing after the deadline attracts a late filing fee and interest on any outstanding tax liabilities. It may also restrict you from carrying forward certain capital losses."
        }
      ]
    }
  },
  {
    id: "gst-compliance",
    name: "GST Registration & Compliance",
    shortDesc: "Seamless GST registration, monthly/quarterly return filings, reconciliation, and representation for all types of businesses.",
    icon: "gst",
    isActive: true,
    order: 2,
    details: {
      overview: "We offer end-to-end GST support, from getting your new registration to filing regular returns (GSTR-1, GSTR-3B, GSTR-9) and reconciling Input Tax Credit (ITC) to prevent leakages and ensure full legal compliance.",
      whoItIsFor: [
        "New businesses crossing the threshold limit of turnover",
        "E-commerce sellers selling goods online",
        "Service providers operating across state borders",
        "Existing businesses seeking outsourcing of GST compliance"
      ],
      documentsRequired: [
        "PAN card of the business/promoters",
        "Aadhaar card of promoters",
        "Proof of business address (Rent agreement / Electricity bill)",
        "Bank account authorization details"
      ],
      process: [
        "Information gathering and eligibility check",
        "Document collection and application preparation",
        "Submission on GST portal and follow-up with officer",
        "Issuance of GSTIN and setup of monthly compliance schedule"
      ],
      timeline: "4 to 7 business days depending on government approval times.",
      pricing: "Monthly retainer models starting at $40/month.",
      faqs: [
        {
          question: "Is GST registration mandatory for all online sellers?",
          answer: "Yes, selling goods through e-commerce platforms generally requires mandatory GST registration irrespective of your annual turnover."
        },
        {
          question: "How often do I need to file GST returns?",
          answer: "GST returns are typically filed monthly. However, eligible small taxpayers with a turnover up to 5 Crore can choose the quarterly QRMP scheme."
        }
      ]
    }
  },
  {
    id: "company-incorporation",
    name: "Company Incorporation & Registrations",
    shortDesc: "Form your Private Limited, LLP, OPC, or Partnership firm with ease, including PAN, TAN, MSME, and Startup India registrations.",
    icon: "incorporation",
    isActive: true,
    order: 3,
    details: {
      overview: "Launch your business on a solid legal foundation. We handle the entire incorporation process including name approval, drafting Charter documents (MoA/AoA), securing Director Identification Numbers (DIN), Digital Signatures (DSC), and obtaining core operational licenses.",
      whoItIsFor: [
        "Entrepreneurs looking to start a new business venture",
        "Sole proprietorships wanting to scale to a corporate structure",
        "Foreign companies establishing subsidiaries or branch offices",
        "Co-founders launching a startup looking to raise equity capital"
      ],
      documentsRequired: [
        "Proposed unique names for the company",
        "Self-attested identity proof (PAN, Passport) of directors",
        "Address proof (Voter ID, Utility bill) of directors",
        "NOC from owner and utility bill for registered office address"
      ],
      process: [
        "Digital Signature Certificate (DSC) application",
        "Company Name Reservation (RUN application)",
        "Filing of SPICe+ incorporation forms with Ministry of Corporate Affairs",
        "Receipt of Certificate of Incorporation, PAN, TAN, and bank account setup"
      ],
      timeline: "7 to 10 business days, subject to government processing schedules.",
      pricing: "Packages start at $150 (excluding state-specific government stamp duties).",
      faqs: [
        {
          question: "What is the minimum number of directors for a Private Limited Company?",
          answer: "A minimum of two directors and two shareholders is required to register a Private Limited Company."
        },
        {
          question: "Can a foreign national be a director in an Indian company?",
          answer: "Yes, a foreign national can be a director. However, at least one director on the board must be a resident of India."
        }
      ]
    }
  },
  {
    id: "accounting-bookkeeping",
    name: "Accounting & Bookkeeping",
    shortDesc: "Accurate and reliable bookkeeping, monthly financial reporting, bank reconciliations, and balance sheet preparation.",
    icon: "bookkeeping",
    isActive: true,
    order: 4,
    details: {
      overview: "Maintain clean financial records with our professional accounting and bookkeeping services. We act as your remote back-office finance department, keeping your ledgers reconciled, generating accurate P&L statements, and ensuring you are audit-ready at all times.",
      whoItIsFor: [
        "Small to medium business owners who want to focus on operations",
        "Startups looking for professional accounting without hiring full-time staff",
        "Firms requiring GAAP/IFRS compliant financial reporting",
        "E-commerce businesses with high-volume digital transactions"
      ],
      documentsRequired: [
        "Bank and credit card statements",
        "Sales invoices and purchase bills",
        "Payroll reports and employee expense receipts",
        "Access to accounting software (QuickBooks, Xero, Zoho, etc.)"
      ],
      process: [
        "Connect bank accounts and accounting software",
        "Weekly categorisation of transactions and invoice matching",
        "Monthly bank and ledger reconciliation",
        "Delivery of financial statement package (P&L, Balance Sheet, Cash Flow)"
      ],
      timeline: "Delivered monthly, within 10 days of the close of the month.",
      pricing: "Flexible pricing models based on transaction volume, starting at $120/month.",
      faqs: [
        {
          question: "Which accounting systems do you support?",
          answer: "We support major accounting platforms including QuickBooks Online, Xero, Zoho Books, Tally Prime, and Sage."
        },
        {
          question: "Do you provide payroll support along with bookkeeping?",
          answer: "Yes, we offer fully integrated payroll processing as an add-on to our bookkeeping packages."
        }
      ]
    }
  },
  {
    id: "foreign-accounting",
    name: "Foreign Accounting & Taxes",
    shortDesc: "Specialized US/UK/Canada accounting, corporate tax preparation, sales tax filings, and cross-border advisory.",
    icon: "foreign",
    isActive: true,
    order: 5,
    details: {
      overview: "Expand your horizons globally. We specialize in cross-border tax advisory, international corporate filings, transfer pricing consulting, and foreign asset disclosures. We ensure compliance in both domestic and international tax jurisdictions.",
      whoItIsFor: [
        "Expatriates and dual citizens with overseas income or assets",
        "Domestic companies with foreign subsidiaries or joint ventures",
        "Foreign businesses looking to set up liaison offices in India",
        "Contractors working with overseas clients"
      ],
      documentsRequired: [
        "Details of foreign assets and accounts (FBAR requirements)",
        "Foreign income tax returns and tax residency certificates",
        "Intercompany transaction agreements (Transfer pricing)",
        "Withholding tax certificates (e.g. Form 1042-S)"
      ],
      process: [
        "Initial residency and double taxation treaty analysis",
        "Preparation of foreign asset disclosures and tax calculations",
        "Cross-border transfer pricing verification",
        "Filing of international tax returns (Form 1120-F, FBAR, etc.)"
      ],
      timeline: "10 to 15 business days depending on complexity.",
      pricing: "Bespoke pricing based on country-specific rules and asset volumes.",
      faqs: [
        {
          question: "What is FBAR, and do I need to file it?",
          answer: "FBAR (Report of Foreign Bank and Financial Accounts) is required for US persons who have a financial interest in or signature authority over foreign financial accounts exceeding $10,000 at any time during the calendar year."
        },
        {
          question: "How does a Double Taxation Avoidance Agreement (DTAA) help me?",
          answer: "DTAA ensures you do not pay tax twice on the same income in two different countries by providing tax credits or exemptions."
        }
      ]
    }
  },
  {
    id: "payroll-taxes",
    name: "Payroll Taxes — 940/941",
    shortDesc: "Accurate processing of payroll, filing of Form 941 (Quarterly Federal Return) and Form 940 (Annual Federal Unemployment Tax Return).",
    icon: "payroll",
    isActive: true,
    order: 6,
    details: {
      overview: "We take the headache out of payroll. Our payroll service handles salary calculations, withholding deductions, and ensures timely filing of Federal Form 941 (employer's quarterly tax return) and Form 940 (FUTA return), protecting your business from costly IRS penalties.",
      whoItIsFor: [
        "US-based small businesses with full-time or part-time employees",
        "Foreign corporations employing remote workers in the US",
        "Startups looking to set up their first compliant payroll system"
      ],
      documentsRequired: [
        "Employer Identification Number (EIN)",
        "Employee W-4 forms",
        "Timesheets and wage rates for the period",
        "State tax registration numbers"
      ],
      process: [
        "Payroll schedule configuration and employee onboarding",
        "Periodic pay calculation, net pay calculation, and tax withholding",
        "Filing of Form 941 quarterly to report withheld taxes and social security",
        "Filing of Form 940 annually for Federal Unemployment Tax (FUTA)"
      ],
      timeline: "Ongoing periodic processing (weekly, bi-weekly, or monthly). Returns filed quarterly and annually.",
      pricing: "Starting at $50/month + $4 per active employee.",
      faqs: [
        {
          question: "What is the difference between Form 941 and Form 940?",
          answer: "Form 941 is filed quarterly to report federal income tax, social security, and Medicare taxes withheld from employees' pay. Form 940 is filed annually to report and pay Federal Unemployment Tax (FUTA) which is paid solely by the employer."
        },
        {
          question: "When are Form 941 filings due?",
          answer: "They are due on the last day of the month following the end of the quarter: April 30, July 31, October 31, and January 31."
        }
      ]
    }
  },
  {
    id: "withholding-w2",
    name: "Withholding & W-2 Filings",
    shortDesc: "Annual preparation and filing of employee W-2 statements, state withholding reconciliations, and transmittals.",
    icon: "withholding",
    isActive: true,
    order: 7,
    details: {
      overview: "Ensure compliance at year-end. We prepare, distribute, and file Form W-2 for all employees, and file the Form W-3 transmittal with the Social Security Administration (SSA). We also reconcile state and local withholding returns to ensure perfect balance.",
      whoItIsFor: [
        "Employers with W-2 employees needing annual year-end reporting",
        "HR managers looking to outsource tax document generation",
        "Firms transitioning from manual paper reporting to electronic SSA filing"
      ],
      documentsRequired: [
        "Annual payroll summaries and employee ledgers",
        "Accurate employee addresses and Social Security Numbers",
        "Reconciled Forms 941 filed throughout the year"
      ],
      process: [
        "Reconciliation of yearly payroll runs with quarterly tax filings",
        "Draft W-2 preview shared with company for data check",
        "Electronic filing with the SSA and state tax authorities",
        "Secure delivery of digital and printable W-2s to your employees"
      ],
      timeline: "Completed in January for the preceding calendar year. Deadline to file and distribute is January 31st.",
      pricing: "Pricing starts at a base setup fee of $50 + $5 per W-2 card generated.",
      faqs: [
        {
          question: "What is the deadline for sending W-2s to employees?",
          answer: "Employers must distribute W-2 forms to employees and file them with the SSA by January 31st of the following year."
        },
        {
          question: "What happens if there is an error on a filed W-2?",
          answer: "We file Form W-2c (Corrected Wage and Tax Statement) and Form W-3c transmittal to rectify errors in names, SSNs, or reported amounts."
        }
      ]
    }
  },
  {
    id: "1099-filings",
    name: "1099 Filings",
    shortDesc: "Annual reporting of non-employee compensation (1099-NEC, 1099-MISC) for independent contractors and service providers.",
    icon: "1099",
    isActive: true,
    order: 8,
    details: {
      overview: "Stay compliant with contractor compliance guidelines. We help you identify eligible vendors, collect Form W-9, verify tax IDs, and prepare and electronically file Forms 1099-NEC and 1099-MISC with the IRS and state authorities.",
      whoItIsFor: [
        "Businesses hiring freelancers, virtual assistants, or external contractors",
        "Property management firms paying rent to non-corporate landlords",
        "Service businesses working with outsourced agencies"
      ],
      documentsRequired: [
        "Completed Form W-9 from each vendor/contractor",
        "Total payments ledger for each vendor for the tax year",
        "Company EIN and filing permissions"
      ],
      process: [
        "Vendor list audit and threshold review ($600 rule)",
        "TIN verification and document checks",
        "Preparation of Forms 1099-NEC and 1099-MISC",
        "Electronic filing with the IRS (via FIRE system) and distribution to contractors"
      ],
      timeline: "Prepared and filed in January. 1099-NEC filings must be submitted by January 31st.",
      pricing: "Starting at $45 base fee + $4 per contractor form.",
      faqs: [
        {
          question: "Who is required to receive a Form 1099-NEC?",
          answer: "Any individual, sole proprietor, partnership, or estate to whom you paid $600 or more during the year for services in the course of your trade or business."
        },
        {
          question: "Do I need to file a 1099 for a corporation?",
          answer: "Generally, payments to corporations (including S Corps and C Corps) do not require a Form 1099, except for attorney payments or medical/health payments."
        }
      ]
    }
  }
];
