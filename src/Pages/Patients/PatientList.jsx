import React, { useEffect, useState } from 'react'
import {useNavigate,Link} from 'react-router-dom'
const PatientList = ({mainState}) => {
  let nav= useNavigate()
  let [plist, setPlist]=useState([])
   // to toggle between open & closed requests
   let [listToggle, setListToggle] = useState(true)

        async function getPatientList(){
          let k
          if(listToggle==true){
            k =await fetch(import.meta.env.VITE_SERVER_URL+'/patient-list-for-hospital',{
             method: 'GET',
             headers: {
               'Authorization': `Bearer ${mainState.token}`,
               'Content-Type': 'application/json',
               'hospitalId':''+mainState.hospitalId
             }
           })
          }else{
            k =await fetch(import.meta.env.VITE_SERVER_URL+'/recently-closed-patient-list-for-hospital',{
             method: 'GET',
             headers: {
               'Authorization': `Bearer ${mainState.token}`,
               'Content-Type': 'application/json',
               'hospitalId':''+mainState.hospitalId
             }
           })
          }
            k=await k.json()
            console.log(k)
            setPlist(k)
          }

    useEffect(()=>{
        getPatientList()
    },[listToggle])

  return (
    <div>
    <Link to={'/new-patient'} >'New Request' </Link>
    <h1>
    PatientList
    </h1>
    <select name="" value={listToggle} onChange={(e)=>setListToggle(e.target.value=='true' ? true : false)} >
      <option value={true}>open requests</option>
      <option value={false}>closed requests</option>
    </select>
    <div>
        {plist.map((e,i)=><div key={i}>
        <button onClick={()=>nav('/patient/'+e._id)}>
            {e.name}
            {e.age}
            {e.emergency && <div>
              emergency
            </div>}
            {e.bloodGroup}
            {["whole blood", "platelets", "plasma"][e.donationType]}
        </button>
        </div>)}
    </div>
    </div>
  )
}

export default PatientList