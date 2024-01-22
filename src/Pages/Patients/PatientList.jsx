import React, { useEffect, useState } from 'react'
import {useNavigate,Link} from 'react-router-dom'
const PatientList = ({mainState}) => {
  let nav= useNavigate()
    let [plist, setPlist]=useState([])

        async function getPatientList(){
          // CONVERT IT INTO GET REQUEST WITH ONLY AUTHORIZATION HEADER
            let k =await fetch(import.meta.env.VITE_SERVER_URL+'/patient-list-for-hospital',{
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${mainState.token}`,
                'Content-Type': 'application/json',
                'hospitalId':''+mainState.hospitalId
              }
            })
            k=await k.json()
            setPlist(k)
          }
    useEffect(()=>{
        getPatientList()
    },[])
  return (
    <div>
    <Link to={'/new-patient'} >'New Request' </Link>
    <h1>
    PatientList
    </h1>
    <div>
        {plist.map((e,i)=><div key={i}>
        <button onClick={()=>nav('/patient/'+e._id)}>
            {e.name}
            {e.bloodGroup}
        </button>
        </div>)}
    </div>
    </div>
  )
}

export default PatientList