import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
const PatientList = ({mainState}) => {
  let nav= useNavigate()
    let [plist, setPlist]=useState([])

        async function getPatientList(){
          // CONVERT IT INTO GET REQUEST WITH ONLY AUTHORIZATION HEADER
            let k =await fetch(import.meta.env.VITE_SERVER_URL+'/patient-list-for-hospital',{
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${t}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({hospitalId:mainState.hospitalId})
            })
            k=await k.json()
            setPlist(k)
          }
    useEffect(()=>{
        getPatientList()
    },[])
  return (
    <div>
    <h1>
    PatientList
    </h1>
    <div>
        {plist.map((e,i)=><div key={i}>
        <button onClick={()=>nav('/patient',{
      state:{
        p:e
      }
    })}>
            {e.name}
            {e.bloodGroup}
        </button>
        </div>)}
    </div>
    </div>
  )
}

export default PatientList