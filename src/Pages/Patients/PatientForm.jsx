import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function PatientForm({mainState}) {
  let nav=useNavigate()
  let [p,setP]=useState({
    name:'',
    age:0,
    bloodGroup:'O+',
    gender:true,
    guardianPhoneNumber:"",
    hospitalId:mainState.hospitalId,
    hospitalLocation: mainState.hospitalLocation ,// [82.2315467,17.00165],
    emergency:false,
    problemDescription:'',
    caseDetails:'',
    documentLinks:[],
    noOfUnitsRequired:1,
    donationType:0
})

const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  setP((prevData) => ({
    ...prevData,
    [name]: type === 'checkbox' ? checked : value,
  }));
};

const postPatientData = async(e) => {
  // FORM VALIDATION IS MUST 
  // CHECK AGE!=0..., LIMIT NO.OF REQ UNITS
  e.preventDefault();
  console.log(p);
  try{
    let k =await fetch(import.meta.env.VITE_SERVER_URL+'/post-donation-request',{
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mainState.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(p)
    })
    k=await k.json()
    console.log(k)
    if(k.msg=='done')
      nav(-1)
  }catch(e){
    alert('err in posting')
  }
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
      <select name="bloodGroup" id="" value={p.bloodGroup} onChange={handleChange}>
  <option value="O+">O+</option>
  <option value="A+">A+</option>
  <option value="B+">B+</option>
  <option value="AB+">AB+</option>
  <option value="O-">O-</option>
  <option value="A-">A-</option>
  <option value="B-">B-</option>
  <option value="AB-">AB-</option>
      </select>
    </label>
    <br />

    <label>
      Gender:
      <input type="checkbox"   checked={p.gender} onChange={()=>setP({...p,gender:true})} /> Male
      <input type="checkbox"  checked={!p.gender} onChange={()=>setP({...p,gender:false})}  /> Female
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

    <label>
      No. of units required:
      <input
        type="number"
        name="noOfUnitsRequired"
        value={p.noOfUnitsRequired}
        onChange={handleChange}
      />
    </label>
    <br />


    <label>
      Donation Type:
      <select name="donationType" id="" value={p.donationType} onChange={handleChange}>
  <option value={0}>Whole Blood</option>
  <option value={1}>Platelets</option>
  <option value={2}>Plasma</option>
      </select>
    </label>
    <br />

    <div><button  type="submit">post donation request</button></div>
  </form>
);
}

export default PatientForm