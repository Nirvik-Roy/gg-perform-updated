import React, { useState } from 'react';
import '../css/FaqReviews.css';

export default function FaqSection({ faqs }) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-section">
      {faqs.map((faq, index) => (
        <div key={index} className="faq-item">
          <div className="faq-question" onClick={() => toggle(index)}>
            <span className="faq-number">{String(index + 1).padStart(2, '0')}</span>
            <h4>{faq.question}</h4>
            <span className="faq-toggle">{openIndex === index ? '-' : '+'}</span>
          </div>
          {openIndex === index && <p className="faq-answer">{faq.answer}</p>}
        </div>
      ))}
    </div>
  );
}
