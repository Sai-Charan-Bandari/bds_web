import React, { useState } from 'react';
import { useEffect } from 'react';

function Feedback({ mainState }) {
  const [option, setOption] = useState(0);
  const [feedback, setFeedback] = useState(null);
  useEffect(() => {
    if (option == 0) setFeedback({
      satisfaction: 5,
      easeOfUse: 5,
      customerService: 5,
      likelihoodToRecommend: 5,
      additionalSuggestions: ''
    })
    else setFeedback({ text: '' })
  }, [option])

  const postData = async (e) => {
    e.preventDefault();
    try {
      let k = await fetch(import.meta.env.VITE_SERVER_URL + '/hospital-feedback', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${mainState.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isDonor: false, id: mainState.hospitalId, type: option, data: feedback, })
      })
      k = await k.json()
      console.log(k)
      if (k.msg == 'done') {
        alert('feedback sent successfully')
      }
    } catch (e) {
      console.log(e)
      alert('err in submitting')
    }
  };

  if (option == 0) {
    return (
      <div style={containerStyle}>
        <h2 style={{ color: 'red' }}>Feedback</h2>
        <select name="bloodGroup" id="" value={option} onChange={(e)=>setOption(e.target.value)}>
  <option value={0}>Feedback</option>
  <option value={1}>Error/Bug report</option>
  <option value={2}>Complaint</option>
      </select>
        {feedback &&
          <form onSubmit={postData}>
            <div style={questionContainerStyle}>
              <label>How satisfied are you with our product/service/event?</label>
              <div style={ratingContainerStyle}>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={feedback.satisfaction}
                  onChange={(e) => setFeedback({...feedback, satisfaction:e.target.value})}
                />
                <span>{feedback.satisfaction}</span>
              </div>
            </div>

            <div style={questionContainerStyle}>
              <label>How easy was it to use our product/service/event?</label>
              <div style={ratingContainerStyle}>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={feedback.easeOfUse}
                  onChange={(e) => setFeedback({...feedback,easeOfUse:e.target.value})}
                />
                <span>{feedback.easeOfUse}</span>
              </div>
            </div>

            <div style={questionContainerStyle}>
              <label>How would you rate the customer service/support you received?</label>
              <div style={ratingContainerStyle}>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={feedback.customerService}
                  onChange={(e) => setFeedback({...feedback, customerService:e.target.value})}
                />
                <span>{feedback.customerService}</span>
              </div>
            </div>

            <div style={questionContainerStyle}>
              <label>How likely are you to recommend our product/service/event to others?</label>
              <div style={ratingContainerStyle}>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={feedback.likelihoodToRecommend}
                  onChange={(e) => setFeedback({...feedback, likelihoodToRecommend:e.target.value})}
                />
                <span>{feedback.likelihoodToRecommend}</span>
              </div>
            </div>

            <div style={questionContainerStyle}>
              <label>Additional Suggestions:</label>
              <textarea
                value={feedback.additionalSuggestions}
                onChange={(e) => setFeedback({...feedback, additionalSuggestions:e.target.value})}
              />
            </div>

            <button type="submit" style={submitButtonStyle}>Submit</button>
          </form>
        }
      </div>
    );

  }
  else if(option==1){
    return(
      <div style={containerStyle}>
      <h2 style={{ color: 'red' }}>Feedback</h2>
      <select name="bloodGroup" id="" value={option} onChange={(e)=>setOption(e.target.value)}>
  <option value={0}>Feedback</option>
  <option value={1}>Error/Bug report</option>
  <option value={2}>Complaint</option>
      </select>
      <form onSubmit={postData}>
      <div style={questionContainerStyle}>
        <label>Bug/Error Report:</label>
        <textarea
          value={feedback.text}
          onChange={(e) => setFeedback({text:e.target.value})}
        />
      </div>
      <button type="submit" style={submitButtonStyle}>Submit</button>
     </form>
     </div>
    )
  }else return(
      <div style={containerStyle}>
      <h2 style={{ color: 'red' }}>Feedback</h2>
      <select name="bloodGroup" id="" value={option} onChange={(e)=>setOption(e.target.value)}>
  <option value={0}>Feedback</option>
  <option value={1}>Error/Bug report</option>
  <option value={2}>Complaint</option>
      </select>
      <form onSubmit={postData}>
      <div style={questionContainerStyle}>
        <label>Complaint:</label>
        <textarea
          value={feedback.text}
          onChange={(e) => setFeedback({text:e.target.value})}
        />
      </div>
      <button type="submit" style={submitButtonStyle}>Submit</button>
     </form>
     </div>

  )
}

// Styles
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
};

const questionContainerStyle = {
  backgroundColor: '#ffdddd',
  padding: '20px',
  borderRadius: '10px',
  marginBottom: '30px',
  width: '400px',
  border: '2px solid red',
};

const ratingContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '10px',  // Adjusted margin for the rating bar
};

const submitButtonStyle = {
  backgroundColor: 'red',
  color: '#fff',
  padding: '10px',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '20px',
};

export default Feedback;