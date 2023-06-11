import { Alert, Snackbar } from '@mui/material'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import './css/LoginPage.css'

function ResetPassword() {
    const [open, setOpen] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [message, setMessage] = useState("")
    const {id,token} = useParams()

    const handleClose = (event, reason) => {  
      if (reason === "clickaway") {
        return;
      }
      setOpen(false);
      setOpenSuccess(false);
    };
    
  
    const [cred, setCred] = useState({newPassword:"",confirmPassword:""})
  
    const handleOnChangeCred = (e) =>{
      setCred({...cred,[e.target.name]:e.target.value})
    }
    
    const [newPasswordError, setNewPasswordError] = useState(false)
    const [confirmPasswordError, setConfirmPasswordError] = useState(false)
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState("")
  
    const handleFormSubmit = async(e)=>{
      e.preventDefault();

      setNewPasswordError(false)
      setConfirmPasswordError(false)
       if(cred.newPassword===""){
        setNewPasswordError(true)
      }else if(cred.confirmPassword===""){
        setConfirmPasswordError(true)
        setConfirmPasswordErrorMessage("Please fill the confirm password field.")
      }else{
       
        setNewPasswordError(false)
        setConfirmPasswordError(false)
        
        const response = await fetch(`http://localhost:4000/api/auth/resetUserPassword/${id}/${token}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password:cred.newPassword }),
      });

      const result = await response.json();
  
        if(result.error===0){
          setCred({newPassword:"",confirmPassword:""})
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
  
    
  return (
    <div className="container mt-4">
        <div style={{ width: "400px", margin: "auto" }} className="mt-5">
        <form>
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
            <button type='button' className='btn btn-dark' onClick={handleFormSubmit}>Change Password</button>
        </form>
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

export default ResetPassword