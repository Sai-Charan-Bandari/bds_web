import React, { useEffect, useState } from 'react'

function PatientForm({mainState}) {
  let [p,setP]=useState({
    name:'kiran',
    age:21,
    bloodGroup:'o+',
    gender:true,
    guardianPhoneNumber:97857934,
    hospitalId:'@apollo',
    hospitalLocation: mainState.location ,// [82.2315467,17.00165],
    emergency:false,
    problemDescription:'prob',
    caseDetails:'case',
    documentLinks:[]
})

const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  setP((prevData) => ({
    ...prevData,
    [name]: type === 'checkbox' ? checked : value,
  }));
};

const postPatientData = async(e) => {
  e.preventDefault();
  console.log(p);
    let k =await fetch(import.meta.env.VITE_SERVER_URL+'/post-donation-request',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(patient1)
    })
    k=await k.json()
};

return (
  <form onSubmit={postPatientData}>
    <label>
      Name:
      <input type="text" name="name" value={p.name} onChange={handleChange} />
    </label>
    <br />

    <label>
      Age:
      <input type="number" name="age" value={p.age} onChange={handleChange} />
    </label>
    <br />

    <label>
      Blood Group:
      <input type="text" name="bloodGroup" value={p.bloodGroup} onChange={handleChange} />
    </label>
    <br />

    <label>
      Gender:
      <input type="checkbox" name="gender" checked={p.gender} onChange={handleChange} />
    </label>
    <br />

    <label>
      Guardian Phone Number:
      <input
        type="tel"
        name="guardianPhoneNumber"
        value={p.guardianPhoneNumber}
        onChange={handleChange}
      />
    </label>
    <br />


    <label>
      Emergency:
      <input
        type="checkbox" checked={p.emergency}
        name="emergency"
        onChange={()=>setP({...p, emergency:!p.emergency})}
      />
    </label>
    <br />

    <label>
      Problem Description:
      <input
        type="tel"
        name="problemDescription"
        value={p.problemDescription}
        onChange={handleChange}
      />
    </label>
    <br />

    <label>
      Case Details:
      <input
        type="tel"
        name="caseDetails"
        value={p.caseDetails}
        onChange={handleChange}
      />
    </label>
    <br />

    <label>
      Upload documents:
      <input
        type="file"
      />
    </label>
    <br />


    <div><button  type="submit">post donation request</button></div>
  </form>
);
}

export default PatientForm