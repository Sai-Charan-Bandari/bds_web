import React, { useState } from 'react';

function Faqs() {
  const [answersVisible, setAnswersVisible] = useState(Array(10).fill(false));

  const toggleAnswer = (index) => {
    const newAnswersVisible = [...answersVisible];
    newAnswersVisible[index] = !newAnswersVisible[index];
    setAnswersVisible(newAnswersVisible);
  };

  const faqContainerStyle = {
    backgroundColor: 'red',
    color: 'white',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    marginTop: '30px', // Added top margin
  };

  const faqQuestionStyle = {
    cursor: 'pointer',
    marginBottom: '15px',
    // Removed textDecoration
  };

  const faqData = [
    {
      question: "How does the blood donation process work?",
      answer: "In our application, once a patient requires blood, the request will be put up by the respective hospital. After scrutiny, the request gets verified, and users will be shown the blood donation request.",
    },
    {
      question: "What is the recommended gap after blood donation?",
      answer: "The recommended minimum gap between blood donations is 8 weeks.",
    },
    // Add more questions and answers following the same format
    // ...
  ];

  return (
    <div style={faqContainerStyle}>
      <h1>FAQs about Blood Donation</h1>
      {faqData.map((faq, index) => (
        <div key={index} style={faqQuestionStyle} onClick={() => toggleAnswer(index)}>
          <strong>{faq.question}</strong> {answersVisible[index] ? '-' : '+'}
          {answersVisible[index] && <p>{faq.answer}</p>}
        </div>
      ))}
    </div>
  );
}

export default Faqs;