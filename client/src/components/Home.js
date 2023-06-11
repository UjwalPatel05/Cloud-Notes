import React, { useContext, useEffect } from 'react'
import Navbar from './Navbar'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from './Main';
import SignUp from './SignUp';
import LoginPage from './LoginPage';
import { userContext } from '../context/user/userContext';
import UserDetails from './UserDetails';
import ResetPasswordLink from './ResetPasswordLink';
import ResetPassword from './ResetPassword';


function Home() {

  const con = useContext(userContext)
  const {getUser} = con

  useEffect(() => {
   if(localStorage.getItem("token")) getUser();
   // eslint-disable-next-line
  }, [])
  
  
  return (
    <>
      <BrowserRouter>
        <Navbar/>
        <Routes>
            <Route path='/' element={<Main/>} />
            <Route path='/signup' element={<SignUp/>} />
            <Route path='/login' element={<LoginPage/>} />
            <Route path='/userDetails' element={<UserDetails/>}/>
            <Route path='/sendResetPasswordLink' element={<ResetPasswordLink/>}/>
            <Route path='/resetUserPassword/:id/:token' element={<ResetPassword/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default Home