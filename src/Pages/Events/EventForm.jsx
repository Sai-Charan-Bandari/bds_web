import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function EventForm({mainState}) {
  let nav=useNavigate()
  let [p,setP]=useState({
    hospitalId:mainState.hospitalId,
    name:'',
    description:'',
    startDate:new Date(new Date().getTime()+86400000), //tomorrow
    endDate: new Date(new Date().getTime()+86400000),
    address:'',
    imgURL:'',
    timings:["10:00","17:00"],
    coordinates:[0, 0]
})
let [accept,setAccept]=useState(false)
let [coord,toggleCoord]=useState(true)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    setP((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const postEventData = async(e) => {
    e.preventDefault();
    console.log(p);
    //VALIDATION
if((new Date(p.endDate.toISOString().substring(0,10)) - new Date(p.startDate.toISOString().substring(0,10)))/86400000 <0){
  alert("invalid dates")
  return
}
if(p.name.trim()==''){
  alert("invalid name")
  return
}
if(p.description.trim()==''){
  alert("invalid description")
  return
}
if(p.address.trim()==''){
  alert("invalid address")
  return
}
if(p.imgURL.trim()==''){
  alert("invalid imgURL")
  return
}
if(parseInt(p.timings[0].substring(0,2))<9 || parseInt(p.timings[1].substring(0,2))>18){
  alert("timings should be between 9AM to 6PM")
  return
}
if(parseInt(p.timings[0].substring(0,2)) - parseInt(p.timings[1].substring(0,2)) >=0){
  alert("invalid timings selected")
  return
}
if(p.coordinates[0]==0 || p.coordinates[1]==0){
  alert("invalid coordinates")
  return
}


    try{
      let k =await fetch(import.meta.env.VITE_SERVER_URL+'/create-event',{
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${mainState.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(p)
      })
      k=await k.json()
      console.log(k)
    if(k.msg=="done"){
      alert("event created successfully")
      nav(-1)
      return
    }
    alert("error in event creation")
  }catch(e){
      alert("error in event creation")
    }
  };

  return (
    <div>EventForm
    <form onSubmit={postEventData}>
    <label>
      Name:
      <input type="text" name="name" value={p.name} onChange={handleChange} />
    </label>
    <br />

    <label>
      Description:
      <input type="text" name="description" value={p.description} onChange={handleChange} />
    </label>
    <br />

    <label>
      Start Date:  NOT WORKING CORRCTLy
      {/* NOT WORKING CORRCTLY */}
      <input type="date" name="startDate" id=""  value={(""+p.startDate.toISOString()).substring(0,10)} onChange={(e)=>setP({...p,startDate:new Date(e.target.value)})}/>
    </label>
    <br />

    <label>
      End Date: (inclusive)  NOT WORKING CORRCTLy
      {/* NOT WORKING CORRCTLY */}
      <input type="date" name="endDate" id=""  value={(""+p.endDate.toISOString()).substring(0,10)} onChange={(e)=>{
        // console.log(e.target.value)
        // console.log(new Date(e.target.value).getTime() )
        // console.log(p.startDate.getTime() )
        if(new Date(e.target.value).getTime() >= new Date(p.startDate.toISOString().substring(0,10)))
        setP({...p,endDate:new Date(e.target.value)})
      }}/>
    </label>
    <br />

   
    <div>No of days = {(new Date(p.endDate.toISOString().substring(0,10)) - new Date(p.startDate.toISOString().substring(0,10)))/86400000 + 1}</div>

    <label>
      Address:
      <input type="text" name="address" value={p.address} onChange={handleChange} />
    </label>
    <br />

    <label>
      Image/Poster URL:
      <input
        type="text"
        name="imgURL"
        value={p.imgURL}
        onChange={handleChange}
      />
    </label>
    <br />

    Timings:
          <label>
          Start time
            <input type="time"  value={p.timings[0]} onChange={(e)=>setP({...p,timings:[e.target.value,p.timings[1]]})} required />
          </label>
          <label>
          End time
            <input type="time"  value={p.timings[1]} onChange={(e)=>setP({...p,timings:[p.timings[0],e.target.value]})} required />
          </label>
    <br />

    
    Location :
            <label>
              Use your registered location 
            <input type="checkbox" onChange={()=>toggleCoord(!coord)} checked={coord} />
            </label>
          {
            !coord &&
            <div>
            Enter venue coordinates : 
            <label>
          Longitude
            <input type="number" name="coordinates" value={p.coordinates[0]} onChange={(e)=>setP({...p,coordinates:[e.target.value,p.coordinates[1]]})} required />
          </label>
          <label>
          Longitude
            <input type="number" name="coordinates" value={p.coordinates[1]} onChange={(e)=>setP({...p,coordinates:[p.coordinates[0],e.target.value]})} required />
          </label>
            </div>
            
          }
    <br />

    <label>
    I have arranged everything and permitted by local authorities
      I agree to take full responsibility and safety of all:
      <input type="checkbox"   checked={accept} onChange={()=>setAccept(!accept)} /> 
    </label>
    <br />

    {accept && <div><button  type="submit">create event </button></div>}
  </form>
    </div>
  )
}

export default EventForm