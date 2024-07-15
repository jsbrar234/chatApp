import { Button } from '@mui/base'
import { Box, Stack, TextField, Typography } from '@mui/material'
import { Container } from '@mui/system'
import React, { useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'

export const App = () => {

  const socket = useMemo(() => io("http://localhost:3000"), [])

  useEffect(() => {

    
    socket.on("connect", () => {
      setSocketId(socket.id)
      console.log("Connected", socket.id)
    })

    socket.on("Welcome", (s) => {
      console.log(s)
    })

    socket.on("recieve-message", (data) => {
      
      setMessagesList((messagesList) => [...messagesList, data])

      console.log("MSG", messagesList)
    })

    return () => {
      socket.disconnect();
    }
  }, [])

  const [message, setMessage] = useState("")
  const [room, setRoom] = useState("")
  const [socketId, setSocketId] = useState("")
  const [messagesList, setMessagesList] = useState([])
  const [roomName, setRoomName] = useState("")


  

  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit("message", {message, room})
    setMessage("")
  }

  const joinRoomHandler = (e) => {
    e.preventDefault()
    socket.emit("join-room", roomName)
    setRoomName("")
  }

  return (
    <Container maxWidth='sm'>
     
     <Box sx={{height : 500}}/>
      <Typography variant='h6' component='div' gutterBottom >{socketId}</Typography>

      <form onSubmit={joinRoomHandler}>

      <h5>Join Room</h5>
      <TextField value={roomName} onChange={e=>setRoomName(e.target.value)} id='outline-basic' label="Room Name" variant='outlined'/>

      <Button type='submit' variant='contained' color='primary'>Join</Button>


      </form>


      <form onSubmit={handleSubmit}>
        <TextField value={message} onChange={e=>setMessage(e.target.value)} id='outline-basic' label="Message" variant='outlined'/>
        <TextField value={room} onChange={e=>setRoom(e.target.value)} id='outline-basic' label="Room" variant='outlined'/>

        <Button type='submit' variant='contained' color='primary'>Send</Button>
      </form>
      <Stack>
        {
          messagesList.map((m,i) => <Typography key={i} variant='h6' component='div' gutterBottom>{m}</Typography>)
        }
      </Stack>
    </Container>
  )
}
