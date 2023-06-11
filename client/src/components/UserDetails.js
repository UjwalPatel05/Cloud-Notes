import { Alert, Avatar, Snackbar } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { green } from "@mui/material/colors";
import { userContext } from '../context/user/userContext';
import './css/LoginPage.css'
import { useNavigate } from 'react-router-dom';

function UserDetails() {

  const [open, setOpen] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [message, setMessage] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, [])

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    setOpenSuccess(false);
  };
  
  const context = useContext(userContext)
  const {user, updatePassword} = context

  const [cred, setCred] = useState({previousPassword:"",newPassword:"",confirmPassword:""})

  const handleOnChangeCred = (e) =>{
    setCred({...cred,[e.target.name]:e.target.value})
  }

  const [previousPasswordError, setPreviousPasswordError] = useState(false)
  const [newPasswordError, setNewPasswordError] = useState(false)
  const [confirmPasswordError, setConfirmPasswordError] = useState(false)
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState("")

  const handleFormSubmit = async(e)=>{
    e.preventDefault();
    setPreviousPasswordError(false)
    setNewPasswordError(false)
    setConfirmPasswordError(false)
    if(cred.previousPassword===""){
      setPreviousPasswordError(true)
    }else if(cred.newPassword===""){
      setNewPasswordError(true)
    }else if(cred.confirmPassword===""){
      setConfirmPasswordError(true)
      setConfirmPasswordErrorMessage("Please fill the confirm password field.")
    }else{
      setPreviousPasswordError(false)
      setNewPasswordError(false)
      setConfirmPasswordError(false)

      const result = await updatePassword(cred.previousPassword, cred.newPassword);

      if(result.error===0){
        setCred({previousPassword:"",newPassword:"",confirmPassword:""})
        setOpenSuccess(true);
        setMessage(result.message)
        
      }else{
        setOpen(true);
        setMessage(result.error_message)
      }

    }
  }

  const comparePassword = (e) =>{
    if(cred.newPassword!==cred.confirmPassword){
      setConfirmPasswordError(true)
      setConfirmPasswordErrorMessage("Confirm password and New password is not matching")
    }else{
      setConfirmPasswordError(false)
    }
  }

  const showPassword = (e) =>{
    const passwordField1 = document.getElementById("previousPassword")
    const passwordField2 = document.getElementById("newPassword")
    const passwordField3 = document.getElementById("confirmPassword")
    if(passwordField1.type==="password" && passwordField2.type==="password" && passwordField3.type==="password"){
      passwordField1.type="text"
      passwordField2.type="text"
      passwordField3.type="text"
    }else{
      passwordField1.type="password"
      passwordField2.type="password"
      passwordField3.type="password"
    }
  }


  

  return (
    <div className="container mt-4">
      <div className="row">
        <div style={{margin:"auto"}} className="col-md-4">
        <Avatar sx={{ bgcolor: green[400],  width:280, height: 280 }} style={{margin:"auto",fontSize:"10rem"}}> {user?.name?.charAt(0).toUpperCase()} </Avatar>
        </div>
        <div className="col-md-8">
        <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" className="form-control" id="name" name="name" value={user.name} disabled/>
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input type="email" className="form-control" id="email" name="email" value={user.email} disabled/>
            </div>
            <div className="mb-3">
              <label htmlFor="previousPassword" className="form-label">Previous Password</label>
              <input type="password" className={`form-control ${previousPasswordError === false ? "":"error_style"}`} value={cred.previousPassword} id="previousPassword" name="previousPassword" onChange={handleOnChangeCred}/>
              <div id="previousPasswordError" className={`form-text ${previousPasswordError === false ? "d-none" : ""}`}>Please fill the Old Password field.</div>
            </div>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">New Password</label>
              <input type="password" className={`form-control ${newPasswordError === false ? "":"error_style"}`} value={cred.newPassword} id="newPassword" name="newPassword" onChange={handleOnChangeCred}/>
              <div id="newPasswordError" className={`form-text ${newPasswordError === false ? "d-none" : ""}`}>Please fill the new password field.</div>
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input type="password" className={`form-control ${confirmPasswordError === false ? "":"error_style"}`} value={cred.confirmPassword} id="confirmPassword" name="confirmPassword" onChange={handleOnChangeCred} onKeyUp={comparePassword}/>
              <div id="confirmPasswordError" className={`form-text ${confirmPasswordError === false ? "d-none" : ""}`}>{confirmPasswordErrorMessage}</div>
            </div>
            <div className="mb-3 form-check">
              <input type="checkbox" className="form-check-input" id="showPassword" onClick={showPassword}/>
              <label className="form-check-label" htmlFor="showPassword">Show Passwords</label>
            </div>
            <button type='button' className='btn btn-dark' onClick={handleFormSubmit}>Change Password</button>
        </form>
        </div>
      </div>

      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        className="my-snackbar"
      >
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>


      <Snackbar
        open={openSuccess}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        className="my-snackbar"
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default UserDetails