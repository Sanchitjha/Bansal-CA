export default function WhyChooseUs() {
  const principles = [
    {
      num: "01",
      title: "Reliable Compliance",
      desc: "Stay fully compliant with current state and federal regulations. We meticulously manage calendars and double-check records so you never face unexpected fees."
    },
    {
      num: "02",
      title: "Clear Communication",
      desc: "No corporate jargon. We explain complex tax rulings and accounting ledgers in plain language, keeping you informed at every critical juncture."
    },
    {
      num: "03",
      title: "Business-Focused Advice",
      desc: "We look beyond the balance sheets. Our advisors help you interpret financial data to make sound, strategic growth decisions for your company."
    },
    {
      num: "04",
      title: "End-to-End Support",
      desc: "From initial startup registration and ongoing payroll processing to year-end W-2 filings and income tax returns, we handle it all under one roof."
    }
  ];

  return (
    <section className="section" id="why-choose-us">
      <div className="container why-aa-grid">
        <div className="why-aa-left">
          <span className="eyebrow">The A&A Advantage</span>
          <h2>Why businesses partner with A&A.</h2>
          <p>
            We believe accounting should give business owners clarity and peace of mind. Here are the core pillars that guide our advisory services.
          </p>
        </div>

        <div className="why-aa-principles">
          {principles.map((principle) => (
            <div key={principle.num} className="principle-item">
              <span className="principle-num">{principle.num}</span>
              <h3 className="principle-title">{principle.title}</h3>
              <p className="principle-desc">{principle.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
