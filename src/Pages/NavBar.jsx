import React from 'react'
import {Link} from 'react-router-dom'

function NavBar({setMainState}) {
  return (
    <div>NavBar
        <div style={{display:'flex',flexDirection:'row'}}>
        <Link to={'/'} >'Requests' </Link>
        <Link to={'/new-patient'} >'New Request' </Link>
        <Link to={'/events'} >'Events' </Link>
        <Link to={'/appointments'} >'Appointments' </Link>
        <Link to={'/profile'} >'Profile' </Link>
        <Link to={'/faqs'} >'FAQs' </Link>
        <Link to={'/disclaimer'} >'Disclaimer' </Link>
        <Link to={'/feedback'} >'Feedback' </Link>
        <Link to={'/credits'} >'Credits' </Link>
        <Link to={'/emergency-criteria'} >'Criteria for consideration of Emergency Cases' </Link>
        <button onClick={()=>{
            localStorage.removeItem('bds_tok')
            setMainState(null)
        }}>Logout</button>
        </div>
    </div>
  )
}

export default NavBar