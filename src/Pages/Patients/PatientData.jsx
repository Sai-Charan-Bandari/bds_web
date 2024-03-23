import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Cloudinary } from "@cloudinary/url-gen";
import { CloudinaryUploadWidget } from '../CloudinaryUploadWidget';
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";
import { useRef } from 'react';

function PatientData({ mainState, socket }) {
  let nav = useNavigate()
  let { pid } = useParams()
  let [edit, setEdit] = useState(false)
  let [mainP, setMainP] = useState(null)
  let [p, setP] = useState(null)
  let [donorList, setDonorList] = useState([])
  const [publicId, setPublicId] = useState([]);
  const chatRef = useRef(null);


useEffect(()=>{
  socket.on('new-donor-chat',(e)=>{
    console.log(e)
    if(e.hospitalId==mainState.hospitalId && e.patientId==pid){
      setDonorList([...donorList,e])
      // chatRef.current.scrollIntoView({behavior:'smooth'})
      // document.getElementById('chat-list').scrollIntoView(true)
    }
  })
  return ()=>{
    socket.off('new-donor-chat')
  }
},[donorList,socket,chatRef])

  useEffect(() => {
    if (publicId.length == 2) {
      if (!p.documentLinks.includes(publicId[1])) {
        if (p.documentLinks[p.documentLinks.length - 1] == '') {
          setP({ ...p, documentLinks: [...p.documentLinks.slice(0, p.documentLinks.length - 1), publicId[1]] })
        } else
          setP({ ...p, documentLinks: [...p.documentLinks, publicId[1]] })
      }
    }
  }, [publicId])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setP((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  async function fetchPatientData() {
    try {
      let k = await fetch(import.meta.env.VITE_SERVER_URL + '/patient-data-for-hospital', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${mainState.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hospitalId: mainState.hospitalId, patientId: pid })
      })
      k = await k.json()
      // console.log(k)
      setP(k.data)
      setMainP(k.data)
    } catch (e) {
      console.log('err fetching patient data ', e)
    }
  }


  async function getDonorList() {
    try {
      let k = await fetch(import.meta.env.VITE_SERVER_URL + '/donor-chats', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${mainState.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hospitalId: mainState.hospitalId, patientId: pid })
      })
      k = await k.json()
      if (k.list != null) {
        setDonorList(k.list)
      }
    } catch (e) {
      console.log('err in getting donor list')
    }
  }

  async function updatePatientData() {
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
  
    try {
      let k = await fetch(import.meta.env.VITE_SERVER_URL + '/update-donation-request', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${mainState.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(p)
      })
      k = await k.json()
      if (k.msg == 'done') {
        alert('updated successfully')
        setMainP(p)
        setEdit(false)
      } else {
        console.log('err in updating')
        setP(mainP)
      }
    } catch (e) {
      console.log('err in updating')
      setP(mainP)
    }
  }

  useEffect(() => {
    fetchPatientData()
    getDonorList()
  }, [])

  return (
    <div>PatientData
      {p &&
        <>
        {/* You can edit patient data only when its status is open. You cannot alter closed patient data */}
          {p.status && <div><button onClick={() => setEdit(true)}>edit</button></div>}
          <div>
            <label>
              Patient ID:
              <input readOnly={true} type="text" name="name" value={p._id} />
            </label>
            <br />
            <label>
              Status:
              <input readOnly={true} type="text" name="name" value={p.status ? "open" : "closed"} />
            </label>
            <br />
            <label>
              Name:
              <input readOnly={!edit} type="text" name="name" value={p.name} onChange={handleChange} />
            </label>
            <br />

            <label>
              Age:
              <input readOnly={!edit} type="number" name="age" value={p.age} onChange={handleChange} />
            </label>
            <br />

            <label>
              Blood Group:
              {edit ?
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
                :
                <input readOnly={true} type="text" name="bloodGroup" value={p.bloodGroup} onChange={handleChange} />
              }
            </label>
            <br />

            <label>
              Gender:
              {edit ?
                <>
                  <input type="checkbox" checked={p.gender} onChange={() => setP({ ...p, gender: true })} /> Male
                  <input type="checkbox" checked={!p.gender} onChange={() => setP({ ...p, gender: false })} /> Female
                </>
                :
                <input readOnly={true} name="gender" value={p.gender ? "male" : "female"} />
              }
            </label>
            <br />

            <label>
              Guardian Phone Number:
              <input readOnly={!edit}
                type="tel"
                name="guardianPhoneNumber"
                value={p.guardianPhoneNumber}
                onChange={handleChange}
              />
            </label>
            <br />

            <label>
              Emergency:
              <input type="checkbox" checked={p.emergency}
                name="emergency"
                onChange={() => {
                  if (edit) setP({ ...p, emergency: !p.emergency })
                }}
              />
            </label>
            <br />

            <label>
              Opening Date:
              <input readOnly={true} type="datetime-local" name="" id="" value={("" + p.openingDate).substring(0, 16)} />
            </label>
            <br />

            {!p.status &&
              <>
                <label>
                  Closing Date:
                  <input readOnly={true} type="datetime-local" name="" id="" value={("" + p.closingDate).substring(0, 16)} />
                </label>
                <br />
              </>
            }

            <label>

            <div> Problem Description:</div> 
              <textarea readOnly={!edit}
                type="text"
                cols={100}
                name="problemDescription"
                value={p.problemDescription}
                onChange={handleChange}
              />
            </label>
            <br />

            <label>
            <div> Case Details:</div> 
              <textarea readOnly={!edit}
              cols={100}
                type="text"
                name="caseDetails"
                value={p.caseDetails}
                onChange={handleChange}
              />
            </label>
            <br />

            <label>
              Donation Type:
              <select disabled={!edit} name="donationType" id="" value={p.donationType} onChange={handleChange}>
                <option value={0}>Whole Blood</option>
                <option value={1}>Platelets</option>
                <option value={2}>Plasma</option>
              </select>
            </label>
            <br />

            <label>
              No of units required:
              <input readOnly={!edit}
                type="number"
                name="noOfUnitsRequired"
                value={p.noOfUnitsRequired}
                onChange={handleChange}
              />
            </label>
            <br />

            <label>
              No of units donated:
              <input readOnly={true}
                type="number"
                name="noOfUnitsDonated"
                value={p.noOfUnitsDonated}
              />
            </label>
            <br />


            {/* Docs URL */}
            <div >
              <label>
                Document URL:
                {p.documentLinks.map((e, i) =>
                  <div key={i}>
                    <input readOnly={!edit} style={{ width: '80%' }} type="text" name="imgURL" value={p.documentLinks[i]} onChange={(event) => setP({ ...p, documentLinks: [...p.documentLinks.slice(0, i), event.target.value, ...p.documentLinks.slice(i + 1)] })} required />
                    {edit && <button onClick={() => {
                      setP({ ...p, documentLinks: [...p.documentLinks.slice(0, i), ...p.documentLinks.slice(i + 1)] })
                    }}>X</button>}
                  </div>
                )}
              </label>
              {edit &&
                <>
                  <button onClick={() => {
                    if (p.documentLinks[p.documentLinks.length - 1] != '')
                      setP({ ...p, documentLinks: [...p.documentLinks, ''] })
                  }}>add another document URL</button>
                  or Upload Image
                  <CloudinaryUploadWidget uwConfig={{
                    cloudName: import.meta.env.VITE_CLOUD_NAME,
                    uploadPreset: import.meta.env.VITE_UPLOAD_PRESET
                  }} setPublicId={setPublicId} />
                </>
              }
            </div>

            <div style={{ width: "100px" }}>
              {p.documentLinks.map((e, i) => {
                if (e != '')
                  return (
                    <img key={i} width={'100px'} src={e} />
                  )
              }
              )}
            </div>

            {edit && <div><button onClick={updatePatientData}>update donation request</button></div>}
            {edit && <div><button onClick={() => {
              setEdit(false)
              setP(mainP)
            }}>cancel</button></div>}
          </div>

          <div><button onClick={async () => {
            let reason = prompt('enter reason for removing this request', '')
            if (reason && reason!='') {
              // console.log(p);
              try {
                let k = await fetch(import.meta.env.VITE_SERVER_URL + '/close-donation-request', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${mainState.token}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ hospitalId: mainState.hospitalId, patientId: p._id, 
                  caseDetails: `p.caseDetails
                  Donation request closed : ${reason}` })
                })
                k = await k.json()
                console.log(k)
                if (k.msg == 'done') {
                  nav(-1)
                }
              } catch (e) {
                alert('err in posting')
              }
            }
          }}>close request</button></div>

          <div><button onClick={async () => {
            let email = prompt('enter donor email', '')
            if (email) {
              console.log(JSON.stringify({ hospitalId: mainState.hospitalId, patientId: p._id, email: email }))
              try {
                let k = await fetch(import.meta.env.VITE_SERVER_URL + '/blood-donation-complete', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${mainState.token}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ hospitalId: mainState.hospitalId, patientId: p._id, noOfUnitsRequired: p.noOfUnitsRequired, noOfUnitsDonated: p.noOfUnitsDonated, donationType: p.donationType, email: email })
                })
                k = await k.json()
                if (k.msg == 'done') {
                  if (p.noOfUnitsDonated + 1 == p.noOfUnitsRequired) {
                    alert('Completed Request')
                    nav(-1)
                  }
                  else {
                    alert('Added new donation')
                    let n = { ...mainP, noOfUnitsDonated: mainP.noOfUnitsDonated + 1 }
                    setMainP(n)
                    setP(n)
                  }
                }
                console.log(k)
              } catch (e) {
                alert('err in completing')
              }
            }
          }}>Add donation</button></div>

          {donorList.length > 0 &&
            <div ref={chatRef} id='chat-list'>
              Donor Chats
              {donorList.map((e, i) =>
                <div key={i}>
                  <button onClick={() => nav('/donor', {
                    state: {
                      email: e.email,
                      patientId: pid,
                      hospitalId: mainState.hospitalId
                    }
                  })}>{e.email}</button>
                </div>
              )}
              <div>
                default messages
                {/* NEED TO SEND MSGS TO ALL RESPONDERS  */}
                {
                ['Thank You for responding. Please wait while we update the status to you.','You can easily locate our hospital in map by selecting View Hospital Profile > View Route','For further details you can enquire the patient/patient\'s guardian through provided contact','Thank You for responding. But we have already found suitable donors.','Thank You for responding. But the donation request has been closed.'].map((e,i)=>
                <div key={i}>
              <button onClick={()=>{
                socket.emit('multi-msg',{patientId:pid, toList:donorList, data:{msg:e, sender:mainState.hospitalId}})
                alert('msg sent')
              }}>{e}</button>
                </div>
                )
                }
              </div>
            </div>
          }
        </>
      }
    </div>
  )
}

export default PatientData