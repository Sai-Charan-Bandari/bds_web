import React, { useEffect, useState } from 'react'

function ChatBox({socket,chatArr,setChatArr,email,hospitalId,patientId}) {
    let [msg, setMsg]=useState('')
    useEffect(()=>{
      socket.on('msg'+patientId,(e)=>{
          console.log('received a msg ',e)
          setChatArr([...chatArr,e])
      })
      return ()=>{
        socket.off('msg'+patientId)
      }
    },[socket,chatArr])

  return (
    <div>ChatBox
    <div style={{borderRadius:'5px',border:'3px solid black',margin:'3px', height: '300px', overflowY: 'auto'}}>
        {chatArr.map((e,i)=>
        <div key={i} style={e.sender==email ? {backgroundColor:'lightblue',margin:5,width:'60%'} : {backgroundColor:'yellow',margin:5,width:'60%',marginLeft:'auto'}}>
        <div>{e.msg}</div>
      </div>
        )}
    </div>
      <div>
      <input
        placeholder="Type ur msg here"
        value={msg}
        onChange={(eve) => setMsg(eve.target.value)}
      />
       <button
    onClick={async() =>{
        // SEND MSG VIA SOCKET
        socket.emit('msg',{patientId:patientId, to:email, data:{msg:msg, sender:hospitalId}})
        setChatArr([...chatArr, {msg:msg, sender:hospitalId}])
        setMsg('')
    }}>Send</button>
      </div>
    <div>
    {/* NEED TO SEND MSGS TO ALL RESPONDERS  */}
      default msgs
      {['Thank You for responding. Please wait while we update the status to you.','You can easily locate our hospital in map by selecting View Hospital Profile > View Route','For further details you can enquire the patient/patient\'s guardian through provided contact','Thank You for responding. But we have already found suitable donors.','Thank You for responding. But the donation request has been closed.'].map((e,i)=>
      <div key={i}>
      <button onClick={async() =>{
        // SEND MSG VIA SOCKET
        socket.emit('msg',{patientId:patientId, to:email, data:{msg:e, sender:hospitalId}})
        setChatArr([...chatArr, {msg:e, sender:hospitalId}])
        setMsg('')
    }} >{e}</button>
    </div>
      )
      }
    </div>
    </div>
  )
}

export default ChatBox