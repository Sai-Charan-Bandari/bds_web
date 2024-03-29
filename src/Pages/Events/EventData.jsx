import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function EventData({mainState}) {
  let {id} = useParams()
  let [edit, setEdit] = useState(false)
  let [mainP, setMainP] = useState(null)
  let [p, setP] = useState(null)

  async function fetcthEventData() {
    try {
      let k = await fetch(import.meta.env.VITE_SERVER_URL + '/event-data-for-hospital/'+id, {
        method: 'GET',
              headers: {
                'Authorization': `Bearer ${mainState.token}`,
                'Content-Type': 'application/json'
              }
      })
      k = await k.json()
      console.log(k)
      if(k.data != null){
        k.data.startDate = new Date(k.data.startDate.substring(0,10))
        k.data.endDate = new Date(k.data.endDate.substring(0,10))
        setP(k.data)
        setMainP(k.data)
      }else console.log('err fetching event data ', e)
    } catch (e) {
      console.log('err fetching event data ', e)
    }
  }

  const postEventData = async(e) => {
    e.preventDefault();
    console.log(p);
    try{
      let k =await fetch(import.meta.env.VITE_SERVER_URL+'/update-event-hospital',{
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
      setMainP(p)
      alert("event updated successfully")
      return
    }
    alert("error in event updation")
    setP(mainP)
  }catch(e){
      alert("error in event updation")
      setP(mainP)
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setP((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  useEffect(()=>{
    fetcthEventData()
  },[])

  return (
    <div>EventData
     {p && 
     <>
     <div><button onClick={() => setEdit(true)}>edit</button></div>
    <form onSubmit={postEventData}>
    <div>{new Date() > new Date(p.endDate) ? <>Closed</> : <>Open</>} </div>
    <label>
      Name:
      <input readOnly={!edit} type="text" name="name" value={p.name} onChange={handleChange} />
    </label>
    <br />

    <label>
      Description:
      <input readOnly={!edit} type="text" name="description" value={p.description} onChange={handleChange} />
    </label>
    <br />

    <label>
      Start Date:  NOT WORKING CORRCTLy
      {/* NOT WORKING CORRCTLY */}
      <input readOnly={!edit} type="date" name="startDate" id=""  value={(""+p.startDate.toISOString()).substring(0,10)} onChange={(e)=>setP({...p,startDate:new Date(e.target.value)})}/>
    </label>
    <br />

    <label>
      End Date: (inclusive)  NOT WORKING CORRCTLy
      {/* NOT WORKING CORRCTLY */}
      <input readOnly={!edit} type="date" name="endDate" id=""  value={(""+p.endDate.toISOString()).substring(0,10)} onChange={(e)=>{
        // console.log(e.target.value)
        // console.log(new Date(e.target.value).getTime() )
        // console.log(p.startDate.getTime() )
        if(new Date(e.target.value) >= new Date(p.startDate.toISOString().substring(0,10)))
        setP({...p,endDate:new Date(e.target.value)})
      }}/>
    </label>
    <br />

   
    <div>No of days = {(new Date(p.endDate.toISOString().substring(0,10)) - new Date(p.startDate.toISOString().substring(0,10)))/86400000 + 1}</div>

    <label>
      Address:
      <input readOnly={!edit} type="text" name="address" value={p.address} onChange={handleChange} />
    </label>
    <br />

    <label>
      Image/Poster URL:
      <input readOnly={!edit}
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
            <input readOnly={!edit} type="time"  value={p.timings[0]} onChange={(e)=>setP({...p,timings:[e.target.value,p.timings[1]]})} required />
          </label>
          <label>
          End time
            <input readOnly={!edit} type="time"  value={p.timings[1]} onChange={(e)=>setP({...p,timings:[formData.timings[0],e.target.value]})} required />
          </label>
    <br />

    
    Coordinates:
          <label>
          Longitude
            <input readOnly={!edit} type="number" name="coordinates" value={p.coordinates[0]} onChange={(e)=>setP({...p,coordinates:[e.target.value,p.coordinates[1]]})} required />
          </label>
          <label>
          Longitude
            <input readOnly={!edit} type="number" name="coordinates" value={p.coordinates[1]} onChange={(e)=>setP({...p,coordinates:[formData.coordinates[0],e.target.value]})} required />
          </label>
    <br />

    {edit && <div><button  type="submit">update event </button></div>}
    {edit && <div><button onClick={() => {
          setEdit(false)
          setP(mainP)
        }}>cancel</button></div>}
  </form>
     </>
     }
    </div>
  )
}

export default EventData