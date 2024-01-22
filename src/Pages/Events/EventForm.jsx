import React, { useEffect, useState } from 'react'

function EventForm({mainState}) {
  let [p,setP]=useState({
    hospitalId:mainState.hospitalId,
    name:'',
    description:'',
    startDate:new Date(new Date().getTime()+86400000), //tomorrow
    noOfDays: 0,
    address:'',
    imgURL:'',
})
let [accept,setAccept]=useState(false)

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
    }catch(e){
      alert('err in posting')
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
      <input type="datetime-local" name="startDate" id=""  value={(""+p.startDate.toISOString()).substring(0,16)} onChange={(e)=>setP({...p,startDate:new Date(e.target.value)})}/>
    </label>
    <br />

    <label>
      No of days:
      <input type="number" name="noOfDays" value={p.noOfDays} onChange={handleChange} />
    </label>
    <br />

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