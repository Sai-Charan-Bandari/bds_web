import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";
import { CloudinaryUploadWidget } from '../CloudinaryUploadWidget';

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

const [publicId, setPublicId] = useState([]);

useEffect(()=>{
  if(publicId.length==2){
    if(!p.documentLinks.includes(publicId[1])){
      if(p.documentLinks[p.documentLinks.length-1]==''){
        setP({...p,documentLinks:[...p.documentLinks.slice(0,p.documentLinks.length-1), publicId[1]]})
      }else
      setP({...p,documentLinks:[...p.documentLinks, publicId[1]]})
    }
  }
},[publicId])

const cld = new Cloudinary({
  cloud: {
    cloudName:import.meta.env.VITE_CLOUD_NAME
  }
});

const myImage = cld.image(publicId[0]);

const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  setP((prevData) => ({
    ...prevData,
    [name]: type === 'checkbox' ? checked : value,
  }));
};

const postPatientData = async() => {
  // console.log(p);
  
  // form validation
  if(p.name.trim()==''){
    alert('invalid name')
    return
  }
  if(p.age==''){
    alert('invalid age')
    return
  }
  if(p.problemDescription.trim()==''){
    alert('invalid problemDescription')
    return
  }
  if(p.caseDetails.trim()==''){
    alert('invalid caseDetails')
    return
  }
  if(p.documentLinks.length>0 && p.documentLinks.some(str => str.trim() === '')){
    alert('empty document link')
    return
  }
  if(p.noOfUnitsRequired=='' || p.noOfUnitsRequired<1){
    alert('invalid no. of units')
    return
  }

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
  <div>
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

     {/* Docs URL */}
     <div >
      <label>
         Paste Document URL: 
         {p.documentLinks.map((e,i)=>
         <div key={i}>
        <input style={{width:'80%'}}  type="text" name="imgURL" value={p.documentLinks[i]} onChange={(event)=>setP({...p, documentLinks:[...p.documentLinks.slice(0,i),event.target.value,...p.documentLinks.slice(i+1)]})} required />
         <button onClick={()=>{
          setP({...p, documentLinks:[...p.documentLinks.slice(0,i),...p.documentLinks.slice(i+1)]})
         }}>X</button>
         </div>
         )}
         <button onClick={()=>{
          if(p.documentLinks[p.documentLinks.length-1]!='')
          setP({...p, documentLinks:[...p.documentLinks,'']})
         }}>add document URL</button>
      </label>
      or Upload Image 
      <CloudinaryUploadWidget uwConfig={{
    cloudName:import.meta.env.VITE_CLOUD_NAME,
    uploadPreset:import.meta.env.VITE_UPLOAD_PRESET
    }} setPublicId={setPublicId} />
      </div>

    <div style={{ width: "100px" }}>
        {/* <AdvancedImage
          style={{ maxWidth: "100%" }}
          cldImg={myImage}
          plugins={[responsive(), placeholder()]}
        /> */}
    {p.documentLinks.map((e,i)=>{
      if(e!='')
      return(
    <img key={i} width={'100px'} src={e} />
      )
    }
    )}
      </div>

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

    <div><button  onClick={postPatientData}>post donation request</button></div>
    </div>
);
}

export default PatientForm