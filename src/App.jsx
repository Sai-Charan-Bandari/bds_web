import React, { useEffect, useState } from 'react'
import './App.css'
import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom'
import PatientList from './Pages/Patients/PatientList'
import Login from './Pages/Login'
import NavBar from './Pages/NavBar'
import PatientForm from './Pages/Patients/PatientForm'
import PatientData from './Pages/Patients/PatientData'
import EventList from './Pages/Events/EventList'
import EventData from './Pages/Events/EventData'
import EventForm from './Pages/Events/EventForm'
import AppointmentList from './Pages/Appointment/AppointmentList'
import AppointmentData from './Pages/Appointment/AppointmentData'
import Profile from './Pages/Profile'
import Faqs from './Pages/Faqs'
import Disclaimer from './Pages/Disclaimer'
import Feedback from './Pages/Feedback'
import Credits from './Pages/Credits'
import DonorPg from './Pages/DonorPg'
import EmergencyCriteria from './Pages/EmergencyCriteria'

function App() {
  
  const [mainState,setMainState]=useState(null) //{hospitalId:'@nri', token:''}
  async function validateToken(){
    let t= localStorage.getItem('bds_tok')
    if(t){
      try {
        let k = await fetch(import.meta.env.VITE_SERVER_URL + '/validate-hsp', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${t}`,
            'Content-Type': 'application/json',
          },
        }
        )
        k = await k.json()
        if (k.msg == 'done') {
          setMainState({hospitalId:k.hospitalId, location:k.location, token:t})
        }else 
        localStorage.removeItem('bds_tok')
      } catch (e) {
        console.log('couldnt validate user ', e)
        localStorage.removeItem('bds_tok')
      }
    }
  }
  
  useEffect(()=>{
      validateToken()
  },[])
  return (
    <BrowserRouter>
    {mainState && <NavBar setMainState={setMainState} />}
        <Routes >
            <Route path='/' element={mainState ? <PatientList mainState={mainState} /> : <Login setMainState={setMainState} /> }></Route>
            {mainState && 
            <>
              <Route path='/new-patient' element={<PatientForm mainState={mainState}  />}></Route>
            <Route path='/patient' element={<PatientData mainState={mainState}  />}></Route>
            <Route path='/donor/:id' element={<DonorPg mainState={mainState}  />}></Route>

              <Route path='/events' element={<EventList mainState={mainState}  />}></Route>
              <Route path='/event/:id' element={<EventData mainState={mainState}  />}></Route>
              <Route path='/new-event' element={<EventForm mainState={mainState}  />}></Route>

              <Route path='/appointments' element={<AppointmentList mainState={mainState}  />}></Route>
              <Route path='/appointment/:id' element={<AppointmentData mainState={mainState}  />}></Route>
              
              <Route path='/profile' element={<Profile mainState={mainState}  />}></Route>
              <Route path='/faqs' element={<Faqs mainState={mainState}  />}></Route>
              <Route path='/disclaimer' element={<Disclaimer mainState={mainState}  />}></Route>
              <Route path='/feedback' element={<Feedback mainState={mainState}  />}></Route>
              <Route path='/credits' element={<Credits mainState={mainState}  />}></Route>
              <Route path='/emergency-criteria' element={<EmergencyCriteria mainState={mainState}  />}></Route>

            </>
            }
            <Route path='*' element={<PgNotFound />}></Route>
        </Routes>
    </BrowserRouter>
  )
}

function PgNotFound(){
  return(
    <Navigate to={'/'} />
  )
}
export default App
