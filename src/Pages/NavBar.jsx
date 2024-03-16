import React from 'react';
import { Link } from 'react-router-dom';

const navbarContainerStyle = {
  backgroundColor: '#ff0000', // Updated background color for the container
  padding: '10px',
};

const navbarContentStyle = {
  display: 'flex',
  justifyContent: 'space-between',
};

const navbarLinkStyle = {
  textDecoration: 'none',
  color: '#fff',
  padding: '10px',
  border: '1px solid #fff', // Updated border color
  borderRadius: '5px',
};

const evenNavbarLinkStyle = {
  backgroundColor: '#fff',
  color: '#ff0000', // Updated text color for even links
};

const oddNavbarLinkStyle = {
  backgroundColor: '#fff',
  color: '#ff0000', // Updated text color for odd links
};

const logoutButtonStyle = {
  backgroundColor: '#ff0000',
  color: '#fff',
  padding: '10px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

function NavBar({ setMainState }) {
  return (
    <div style={navbarContainerStyle}>
      <div style={navbarContentStyle}>
        <Link to={'/'} style={{ ...navbarLinkStyle, ...oddNavbarLinkStyle }}>Requests</Link>
        <Link to={'/events'} style={{ ...navbarLinkStyle, ...evenNavbarLinkStyle }}>Events</Link>
        <Link to={'/appointments'} style={{ ...navbarLinkStyle, ...oddNavbarLinkStyle }}>Appointments</Link>
        <Link to={'/profile'} style={{ ...navbarLinkStyle, ...evenNavbarLinkStyle }}>Profile</Link>
        <Link to={'/faqs'} style={{ ...navbarLinkStyle, ...oddNavbarLinkStyle }}>FAQs</Link>
        <Link to={'/disclaimer'} style={{ ...navbarLinkStyle, ...evenNavbarLinkStyle }}>Disclaimer</Link>
        <Link to={'/feedback'} style={{ ...navbarLinkStyle, ...oddNavbarLinkStyle }}>Feedback</Link>
        <Link to={'/credits'} style={{ ...navbarLinkStyle, ...evenNavbarLinkStyle }}>Credits</Link>
        <Link to={'/emergency-criteria'} style={{ ...navbarLinkStyle, ...oddNavbarLinkStyle }}>Criteria for Emergency Cases</Link>
        <button style={logoutButtonStyle} onClick={() => {
          localStorage.removeItem('bds_tok');
          setMainState(null);
        }}>Logout</button>
      </div>
    </div>
  );
}

export default NavBar;