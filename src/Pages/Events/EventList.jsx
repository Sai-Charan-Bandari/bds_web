import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function EventList({ mainState }) {
  let nav = useNavigate()
  let [option, setOption] = useState(0)
  let [elist, setElist] = useState([])
  let [tempList, setTempList] = useState([])

  useEffect(() => {
    let date = new Date()
    if (option == 0) setTempList(elist) //all
    else if (option == 1) setTempList(elist.filter((e) => date <= new Date(e.endDate))) //open
    else setTempList(elist.filter((e) => date > new Date(e.endDate))) //closed
  }, [option, elist])

  async function getEventList() {
    let k = await fetch(import.meta.env.VITE_SERVER_URL + '/event-list-for-hospital', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${mainState.token}`,
        'Content-Type': 'application/json',
        'hospitalId': '' + mainState.hospitalId
      }
    })
    k = await k.json()
    console.log(k)
    setElist(k)
  }
  useEffect(() => {
    getEventList()
  }, [])
  return (
    <div>EventList
      <div> <Link to={'/new-event'} >'New Event' </Link></div>
      <div> <select name="" id="" value={option} onChange={(e) => setOption(e.target.value)}>
        <option value={0}>all</option>
        <option value={1}>open</option>
        <option value={2}>closed</option>
      </select></div>
      <div>{tempList.map((e, i) =>
        <div key={i}>
            <div className='event-card'>
          {new Date() > new Date(e.endDate) ? <>Closed</> : <>Open</>}
              <h2>Event Details</h2>
              <p><strong>ID:</strong> {e._id}</p>
              <p><strong>Hospital ID:</strong> {e.hospitalId}</p>
              <p><strong>Name:</strong> {e.name}</p>
              <p><strong>Start Date:</strong> {new Date(e.startDate).toLocaleString()}</p>
              <div className="image-container">
                <img src={e.imgURL} alt="Event" />
              </div>
              <p><strong>Liked Count:</strong> {e.likedCount}</p>
            <button onClick={() => nav('/event/' + e._id)}>view details</button>
            </div>
        </div>
      )}
      </div>
    </div>

  )
}


export default EventList