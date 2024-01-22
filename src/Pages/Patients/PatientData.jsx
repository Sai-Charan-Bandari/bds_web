import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function PatientData({ mainState }) {
  let nav=useNavigate()
  let {pid} = useParams()
  let [edit, setEdit] = useState(false)
  let [mainP, setMainP] = useState(null)
  let [p, setP] = useState(null)
  let [donorList, setDonorList] = useState([])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setP((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  async function fetchPatientData() {
    try {
      let k = await fetch(import.meta.env.VITE_SERVER_URL + '/patient-data-for-donor', {
        method: 'POST',
        headers: {
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
        body: JSON.stringify({hospitalId:mainState.hospitalId, patientId:pid})
      })
      k = await k.json()
      if (k.list != null) {
        setDonorList(k.list)
      } 
    } catch (e) {
      console.log('err in getting donor list')
    }
  }

  async function updatePatientData(e) {
    e.preventDefault()
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
      } else {
        console.log('err in updating')
        setP(mainP)
      }
    } catch (e) {
      console.log('err in updating')
      setP(mainP)
    }
  }

  useEffect(()=>{
    fetchPatientData()
    getDonorList()
  },[])

  return (
    <div>PatientData
      {p && 
      <>
      <div><button onClick={() => setEdit(true)}>edit</button></div>
      <form onSubmit={updatePatientData}>
        <label>
          Patient ID:
          <input readOnly={true} type="text" name="name" value={p._id} />
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

        <label>
          Problem Description:
          <input readOnly={!edit}
            type="tel"
            name="problemDescription"
            value={p.problemDescription}
            onChange={handleChange}
          />
        </label>
        <br />

        <label>
          Case Details:
          <input readOnly={!edit}
            type="tel"
            name="caseDetails"
            value={p.caseDetails}
            onChange={handleChange}
          />
        </label>
        <br />

        {p.documentLinks.length > 0 &&
          <label>
            Uploaded documents:
            {p.documentLinks.map((e,i) => <div key={i}>{e}</div>)}
          </label>}
        {edit &&
          <label>
            Upload documents:
            <input type="file" />
          </label>
        }
        <br />

        {edit && <div><input type="submit" value="update donation request" /></div>}
        {edit && <div><button onClick={() => {
          setEdit(false)
          setP(mainP)
        }}>cancel</button></div>}
      </form>

      <div><button onClick={async () => {
        let reason = prompt('enter reason for removing this request', '')
        if (reason) {
          console.log(p);
          try {
            let k = await fetch(import.meta.env.VITE_SERVER_URL + '/close-donation-request', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${mainState.token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({hospitalId:mainState.hospitalId ,patientId:p._id})
            })
            k = await k.json()
            console.log(k)
            if(k.msg=='done'){
              nav(-1)
            }
          } catch (e) {
            alert('err in posting')
          }
        }
      }}>close</button></div>

      <div><button onClick={async () => {
        let email = prompt('enter donor email', '')
        if (email) {
          console.log(JSON.stringify({hospitalId:mainState.hospitalId, patientId:p._id, email:email}))
          try {
            let k = await fetch(import.meta.env.VITE_SERVER_URL + '/blood-donation-complete', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${mainState.token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({hospitalId:mainState.hospitalId, patientId:p._id, email:email})
            })
            k = await k.json()
            if(k.msg=='done'){
              alert('Completed Request')
              nav(-1)
            }
            console.log(k)
          } catch (e) {
            alert('err in completing')
          }
        }
      }}>complete</button></div>

      {donorList.length>0 && 
      <div>
      Donor Chats 
      {donorList.map((e,i)=>
      <div key={i}>
      <button onClick={()=>nav('/donor',{
      state:{
        email:e.email,
        patientId:pid,
        hospitalId:mainState.hospitalId
      }
    })}>{e.email}</button>
      </div>
      )}
      </div>
      }
      </>
      }
    </div>
  )
}

export default PatientData