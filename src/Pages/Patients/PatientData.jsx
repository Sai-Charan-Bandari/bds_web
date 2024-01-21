import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

function PatientData() {
  let loc=useLocation()
  
  let [p,setP]=useState(loc.state.p)
//   useState({
//     name:'kiran',
//     age:21,
//     bloodGroup:'o+',
//     gender:true,
//     guardianPhoneNumber:97857934,
//     hospitalId:'@apollo',
//     hospitalLocation:[82.2315467,17.00165],
//     emergency:true,
//     problemDescription:'prob',
//     caseDetails:'case',
//     documentLinks:[]
// })

  
async function updatePatientData(){
  let p ={...patient1, age:57, patientId:'659dc02acf2491404b69e172'}
    let k =await fetch(import.meta.env.VITE_SERVER_URL+'/update-donation-request',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(p)
    })
    k=await k.json()
  }

  async function getPatientData(){
    // CONVERT IT INTO GET REQUEST WITH ONLY AUTHORIZATION HEADER
      let k =await fetch(import.meta.env.VITE_SERVER_URL+'/patient-data-for-hospital',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        // HARDCODED ID//////////////
        body: JSON.stringify({hospitalId:'@apollo'})
      })
      k=await k.json()
      setP(k)
    }

    useEffect(()=>{
      getPatientData()
  },[])
  return (
    <div>PatientData
    <div>{JSON.stringify(p)}</div>
    
    <div><button onClick={updatePatientData}>update donation request</button></div>
    </div>
  )
}

export default PatientData