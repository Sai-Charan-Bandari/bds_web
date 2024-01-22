import React, { useEffect, useState } from 'react'

function Profile({mainState}) {
  let [h,setH]=useState(null)
  const getProfile = async() => {
    try{
      let k =await fetch(import.meta.env.VITE_SERVER_URL+'/hospital-profile/'+mainState.hospitalId,{
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${mainState.token}`,
          'Content-Type': 'application/json',
        }
      })
      k=await k.json()
      console.log(k)
      setH(k.data)
    }catch(e){
      alert('err in getting profile')
    }
  };

  useEffect(()=>{
    getProfile()
  },[])

  return (
    <div>Profile
    <div>{JSON.stringify(h)}</div>
    </div>
  )
}

export default Profile