import React, { useEffect, useState } from 'react'
import {useNavigate,Link} from 'react-router-dom'

function EventList({mainState}) {
  let nav= useNavigate()
    let [elist, setElist]=useState([])
  
        async function getEventList(){
            let k =await fetch(import.meta.env.VITE_SERVER_URL+'/event-list-for-hospital',{
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${mainState.token}`,
                'Content-Type': 'application/json',
                'hospitalId':''+mainState.hospitalId
              }
            })
            k=await k.json()
            console.log(k)
            setElist(k)
          }
    useEffect(()=>{
        getEventList()
    },[])
  return (
    <div>EventList
    <div> <Link to={'/new-event'} >'New Event' </Link></div>
    <div>{elist.map((e,i)=><div key={i}>
      {JSON.stringify(e)}
    </div>)}</div>
    </div>
  )
}

export default EventList