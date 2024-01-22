import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ChatBox from './ChatBox'

function DonorPg({mainState,socket}) {
  let nav=useNavigate()
  let loc = useLocation()
  let {email, patientId, hospitalId} = loc.state
  let [d,setD]=useState(null)
  let [chatArr,setChatArr]=useState([])

  async function getDonorData() {
    try {
      let k = await fetch(import.meta.env.VITE_SERVER_URL + '/donor-profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${mainState.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email:email})
      })
      k = await k.json()
        setD(k.data)
    } catch (e) {
      console.log('err in getting donor list')
    }
  }

  async function getDonorChat() {
    try {
      let k = await fetch(import.meta.env.VITE_SERVER_URL + '/hospital-chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${mainState.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({hospitalId:hospitalId, patientId:patientId,email:email})
      })
      k = await k.json()
      if (k.list != null) {
        setChatArr(k.list)
      } 
    } catch (e) {
      console.log('err in getting chat list')
    }
  }

  function calculateAge(dateOfBirth) {
    const birthDate = new Date(dateOfBirth);
    const currentDate = new Date();
  
    // Calculate the difference in years
    let age = currentDate.getFullYear() - birthDate.getFullYear();
  
    // Check if the birthday has occurred this year
    if (
      currentDate.getMonth() < birthDate.getMonth() ||
      (currentDate.getMonth() === birthDate.getMonth() &&
        currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }
  
    return age;
  }

  useEffect(()=>{
    getDonorData()
    getDonorChat()
  },[])

  return (
    <div>DonorPg
    {d &&
    <div>
    <div>Name : {d.name}</div>
      <div>Email : {d.email}</div>
      <div>Blood Group : {d.bloodGroup}</div>
      <div>Age : {calculateAge(d.dob)}</div>
      <div>Gender : {d.gender ? 'male' :'female'}</div>
      <div>Address : {d.address}</div>
      <div>
        <h3>Your blood donation history</h3>
        {d.bloodDonationHistory.map((e,i)=><div key={i}>
        <div>{e.hName} </div>
        <div>{e.type ? 'hospital':'bloodbank'}</div>
        <div>hospitalId {e.hId}</div>
        <div>date {e.date}</div>
        <div>donationId {e.donationId}</div>
        </div>
        )}
        </div>
    </div>
    }
    {chatArr.length>0 && 
      <ChatBox socket={socket} chatArr={chatArr} setChatArr={setChatArr} email={email} hospitalId={hospitalId} patientId={patientId} />
    }
    </div>
  )
}

export default DonorPg