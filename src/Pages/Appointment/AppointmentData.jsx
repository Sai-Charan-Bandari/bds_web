import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function AppointmentData({mainState}) {
  let {id} = useParams()
  let [p, setP] = useState(null)
  let [possibleDate, setPossibleDate] = useState(null)
  let statusMap ={
    '0':'pending',
    '1':'confirmed',
    '-1' : 'cancelled/postponed'
  }
  async function fetcthAppointmentData() {
    try {
      let k = await fetch(import.meta.env.VITE_SERVER_URL + '/appointment-data-for-hospital/'+id, {
        method: 'GET',
              headers: {
                'Authorization': `Bearer ${mainState.token}`,
                'Content-Type': 'application/json'
              }
      })
      k = await k.json()
      console.log(k)
      if(k){
        setP(k)
      }else console.log('err fetching appointment data ')
    } catch (e) {
      console.log('err fetching appointment data ', e)
    }
  }

  async function confirmAppt() {
    try {
      let k = await fetch(import.meta.env.VITE_SERVER_URL + '/confirm-appointment/'+id, {
        method: 'GET',
              headers: {
                'Authorization': `Bearer ${mainState.token}`,
                'Content-Type': 'application/json'
              }
      })
      k = await k.json()
      console.log(k)
      if(k.msg == 'done'){
        alert('confirmed appointment')
        setP({...p, status:1})
      }else 
      alert('error confirming appointment')
    } catch (e) {
    }
  }

  const postpone = async() => {
    let reason= ''
    if(possibleDate==null){
      reason = prompt("reason for cancellation","")
    }else{
      reason = prompt("reason for new date suggestion","")
    }

    try{
      let k =await fetch(import.meta.env.VITE_SERVER_URL+'/postpone-appointment',{
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${mainState.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({additionalInformation:reason, possibleDateTime:possibleDate ,status:-1, id:id})
      })
      k=await k.json()
      console.log(k)
    if(k.msg=="done"){
      alert("appointment updated successfully")
      setP({...p,status:-1})
      return
    }
    alert("error in appointment updation")
  }catch(e){
      alert("error in appointment updation")
    }
  };

  useEffect(()=>{
    fetcthAppointmentData()
  },[])

  return (
    <div>AppointmentData
     {p && 
      <div>
      <h2>Appointment Information</h2>
       
      <p><strong>Name:</strong> {p.name}</p>
      <p><strong>Gender:</strong> {p.gender ? "male":"female"}</p>
      <p><strong>Blood Group:</strong> {p.bloodGroup}</p>
      <p><strong>Phone Number:</strong> {p.phoneNumber}</p>
      <p><strong>Address:</strong> {p.address}</p>
      <p><strong>Email:</strong> {p.email}</p>
      <p><strong>Emergency Contact Name:</strong> {p.emergencyContactName}</p>
      <p><strong>Emergency Contact Number:</strong> {p.emergencyContactNumber}</p>
      <p><strong>Emergency Contact Relation:</strong> {p.emergencyContactRelation}</p>
      <p><strong>Health Conditions:</strong> {p.healthConditions}</p>
      <p><strong>Hospital ID:</strong> {p.hospitalId}</p>
      {p.possibleDateTime && <p style={{backgroundColor:'yellowgreen'}}><strong>Suggested Date & Time:</strong> {new Date(p.possibleDateTime).toLocaleString()}</p>}
      <p><strong>Preferred Date & Time:</strong> {new Date(p.preferredDateTime).toLocaleString()}</p>
      <p><strong>Status:</strong> {statusMap[''+p.status]}</p>
      <p><strong>Additional Information:</strong> {p.additionalInformation}</p>

{p.status==0 && <button onClick={confirmAppt}>Confirm Appointment</button>}
<button onClick={()=>setPossibleDate(new Date())}>Postpone Appointment</button>
{possibleDate!=null && 
<div>
<input type="datetime-local" name="" id="" value={possibleDate} onChange={(e)=>setPossibleDate(e.target.value)} />
<button onClick={()=>postpone()}>submit</button>
</div>
}
<button onClick={()=>postpone()}>Cancel Appointment</button>
    </div>
     }
    </div>
  )
}

export default AppointmentData