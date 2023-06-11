import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AddNote from './AddNote'
import Note from './Note'

function Main() {
  const navigate = useNavigate();
  
  useEffect(() => {
    if(!localStorage.getItem('token')) {
      navigate("/login")
    }
    // eslint-disable-next-line
  }, [localStorage.getItem('token')])
  return (
    <>
        <AddNote/>
        <Note/>
    </>
  )
}

export default Main