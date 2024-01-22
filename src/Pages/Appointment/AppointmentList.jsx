import React, { useEffect, useState } from 'react'
import {useNavigate,Link} from 'react-router-dom'

function AppointmentList({mainState}) {
  let nav= useNavigate()
    let [alist, setAlist]=useState([])

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
    <div>Separate the list based on status confirmed or not (i.e appointments and appointment requests)</div>
    <div>{alist.map((e,i)=><div key={i}>
      {JSON.stringify(e)}
    </div>)}</div>
    </div>
  )
}

export default AppointmentList