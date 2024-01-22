import React, { useEffect, useState } from 'react'

function ChatBox({socket,chatArr,setChatArr,email,hospitalId,patientId}) {
    let [msg, setMsg]=useState('')
    useEffect(()=>{
      socket.on('msg',(e)=>{
        console.log('received a msg ',e)
        setChatArr([...chatArr,e])
      })
      return ()=>{
        socket.off('msg')
      }
    },[socket,chatArr])

  return (
    <div>ChatBox
    <div>
        {chatArr.map((e,i)=>
        <div key={i} style={e.sender==email ? {backgroundColor:'lightblue',margin:5,width:'60%'} : {backgroundColor:'yellow',margin:5,width:'60%',marginLeft:'auto'}}>
        <div>{e.msg}</div>
      </div>
        )}
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
    </div>
    </div>
  )
}

export default ChatBox