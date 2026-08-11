export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Choose a Service",
      desc: "Select the specific tax, incorporation, or accounting service your business requires from our curated offerings."
    },
    {
      num: "02",
      title: "Share Your Requirements",
      desc: "Upload the necessary documents securely and share details of your query using our structured, simple questionnaires."
    },
    {
      num: "03",
      title: "Our Team Gets to Work",
      desc: "A dedicated compliance expert reviews your submission, prepares calculations, and drafts your filings for approval."
    },
    {
      num: "04",
      title: "Track & Complete",
      desc: "Monitor your filing status in real-time, approve calculations, and download final returns directly through our Portal."
    }
  ];

  return (
    <section className="section" id="how-it-works">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Onboarding Process</span>
          <h2>A seamless path to compliance.</h2>
          <p>
            We have simplified professional advisory. Collaborate with our team and file your taxes in just four simple steps.
          </p>
        </div>

        <div className="how-it-works-steps">
          {steps.map((step) => (
            <div key={step.num} className="step-card">
              <span className="step-num">{step.num}</span>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="how-it-works-portal-notice">
          Already a client? <span>Log in to the Client Portal</span> to check active filings and chat with your advisor.
        </div>
      </div>
    </section>
  );
}
