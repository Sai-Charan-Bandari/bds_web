import React from 'react';

const disclaimerContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: '#f4f4f4',
};

const disclaimerContentStyle = {
  maxWidth: '800px',
  padding: '20px',
  borderRadius: '10px',
  width: '100%',
  fontSize:'20px',
  fontFamily:'Arial, sans-serif',
};

const headingStyle = {
  color: '#333',
};

const linkStyle = {
  color: '#007bff',
};

function Disclaimer() {
  return (
    <div style={disclaimerContainerStyle}>
      <div style={disclaimerContentStyle}>
        <h1 style={headingStyle}>Disclaimer</h1>
        <p>
          To ensure a clear understanding of the terms and responsibilities associated with the use of our application and services, kindly review the following disclaimers:
        </p>

        <ol >
          <li>Donors should adhere to local blood donation regulations and guidelines.</li>
          <li>The app is not responsible for any health issues arising from donation activities.</li>
          <li>The app does not guarantee the availability of blood donors or specific blood types.</li>
          <li>Users are encouraged to report any issues or discrepancies in the app’s information promptly.</li>
          <li>Users should follow proper hygiene practices when participating in blood donation events.</li>
          <li>The app is not liable for any consequences resulting from inaccurate donor or recipient information.</li>
          <li>The eligibility form provided within the app is a pre-eligibility check. It is essential to note that confirmation is only done after physical verification at hospital/blood banks.</li>
          <li>While the app acts as a platform to connect donors and hospitals and facilitates the donation process, it assumes no responsibility for scheduling or arranging donation appointments; this is the sole responsibility of donors and coordinating healthcare facilities.</li>
        </ol>

        <p>
          For any queries/concerns, please mail to <a href="mailto:bdsadmin1@gmail.com" style={linkStyle}>bdsadmin1@gmail.com</a>.
        </p>

        <p>
          Thank you for your commitment to blood donation and helping save lives.
        </p>
      </div>
    </div>
  );
}

export default Disclaimer;