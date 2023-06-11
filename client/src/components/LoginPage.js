import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";
import "./css/LoginPage.css";
import { userContext } from "../context/user/userContext";

function LoginPage() {

  const navigate = useNavigate();
  const context = useContext(userContext);
  const { getUser, setIsLoggedIn } = context;

  const [open, setOpen] = useState(false);
  const [errMessage, seterrMessage] = useState("");
  const [cred, setCred] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email_err: "", password_err: "" });
  const [emailShow, setEmailShow] = useState(false);
  const [passwordShow, setPasswordShow] = useState(false);
  const [emailError, setemailError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
    // eslint-disable-next-line
  }, [])
  


  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };


  const handelOnChange = (e) => {
    setCred({ ...cred, [e.target.name]: e.target.value });
  };


  const handleOnClick = async (e) => {
    e.preventDefault();
    setEmailShow(false);
    setPasswordShow(false);

    if (cred.email === "") {
      setErrors({ email_err: "error_style" });
      setEmailShow(true);
      setemailError("Please enter the email address.");
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(cred.email)) {
      setErrors({ email_err: "error_style" });
      setemailError("Please enter valid email address.");
      setEmailShow(true);
    } else if (cred.password === "") {
      setErrors({ password_err: "error_style" });
      setPasswordShow(true);
    } else {
      setEmailShow(false);
      setPasswordShow(false);
      setErrors({ email_err: "", password_err: "" });

      const response = await fetch(`http://localhost:4000/api/auth/loginUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: cred.email, password: cred.password }),
      });

      const json = await response.json();

      if (json.token) {
        localStorage.setItem("token", json.token);
        getUser();
        navigate("/");
    
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    // Perform additional login logic, such as fetching user data or redirecting to the dashboard
    console.log('User has been logged in.');
  
      }

      if (json.error === 1) {
        seterrMessage(json.error_message);
        setOpen(true);
      }
    }
  };

  const showPassword = (e) => {
    const passwordField1 = document.getElementById("password");

    if (passwordField1.type === "password") {
      passwordField1.type = "text";
    } else {
      passwordField1.type = "password";
    }
  };

  return (
    <div className="container">
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
          {errMessage}
        </Alert>
      </Snackbar>

      <div className="mt-5 login_container">
        <form>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className={`form-control ${errors.email_err}`}
              id="email"
              name="email"
              onChange={handelOnChange}
            />
            <div
              id="email_err"
              className={`form-text ${emailShow === false ? "d-none" : ""}`}
            >
              {emailError}
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className={`form-control ${errors.password_err}`}
              id="password"
              name="password"
              onChange={handelOnChange}
            />
            <div
              id="password_err"
              className={`form-text ${passwordShow === false ? "d-none" : ""}`}
            >
              Please enter the password.
            </div>
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="showPassword"
              onClick={showPassword}
            />
            <label className="form-check-label" htmlFor="showPassword">
              Show Passwords
            </label>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button
              type="submit"
              className="btn btn-primary"
              onClick={handleOnClick}
            >
              Submit
            </button>
            <Link to="/sendResetPasswordLink" style={{ fontWeight: "500" }}>
              Forgot password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
