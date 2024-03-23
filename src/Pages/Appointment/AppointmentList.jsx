import React, { useEffect, useState } from 'react'
import {useNavigate,Link} from 'react-router-dom'

function AppointmentList({mainState}) {
  let nav= useNavigate()
    let [status, setStatus]=useState(0)
    let [alist, setAlist]=useState([])
    let [tempList, setTempList] = useState([])
    let statusMap ={
      '0':'pending',
      '1':'confirmed',
      '-1' : 'cancelled/postponed'
    }

    useEffect(()=>{
      setTempList(alist.filter((e)=>e.status==status))
    },[alist,status])

        async function getAppointmentList(){
            let k =await fetch(import.meta.env.VITE_SERVER_URL+'/appointment-list-for-hospital',{
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${mainState.token}`,
                'Content-Type': 'application/json',
                'hospitalId':''+mainState.hospitalId
              }
            })
            k=await k.json()
            console.log(k)
            setAlist(k)
          }
    useEffect(()=>{
        getAppointmentList()
    },[])
  return (
    <div>AppointmentList
   <select name="status" id="" value={status} onChange={(e)=>setStatus(e.target.value)}>
    <option value={0}>pending</option>
    <option value={1}>confirmed</option>
    <option value={-1}>cancelled/postponed</option>
   </select>
    <div>{tempList.map((e,i)=><div key={i}>
      <p><strong>Name:</strong> {e.name}</p>
      <p><strong>Gender:</strong> {e.gender ? "male":"female"}</p>
      <p><strong>Blood Group:</strong> {e.bloodGroup}</p>
      <p><strong>Phone Number:</strong> {e.phoneNumber}</p>
      <p><strong>Address:</strong> {e.address}</p>
      <p><strong>Date :</strong> {new Date(e.preferredDateTime).toLocaleString()}</p>
      <p><strong>Email:</strong> {e.email}</p>
      <button onClick={()=>nav('/appointment/'+e.id)}>view appointment details</button>
    </div>)}</div>
    </div>
  )
}

export default AppointmentList