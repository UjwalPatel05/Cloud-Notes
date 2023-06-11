import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";
import "./css/LoginPage.css";
import { userContext } from "../context/user/userContext";

function SignUp() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [errMessage, seterrMessage] = useState("");
  const [cred, setCred] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({
    name_err: "",
    email_err: "",
    password_err: "",
  });
  const [emailError, setemailError] = useState("");
  const [emailShow, setemailShow] = useState(true);
  const [nameShow, setnameShow] = useState(true);
  const [passwordShow, setpasswordShow] = useState(true);

  const context = useContext(userContext);
  const { getUser } = context;

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

  // const [show, setshow] = useState({nameShow:true,emailShow:true,passwordShow:true})

  const handelOnChange = (e) => {
    setCred({ ...cred, [e.target.name]: e.target.value });
  };

  const handleOnClick = async (e) => {
    e.preventDefault();
    setErrors({ name_err: "", email_err: "", password_err: "" });
    setnameShow(true);
    setemailShow(true);
    setpasswordShow(true);
    // setshow({...show,nameShow:true,emailShow:true,passwordShow:true})
    if (cred.name === "") {
      setErrors({ name_err: "error_style" });
      setnameShow(false);

      // setshow({...show,nameShow:false})
    } else if (cred.email === "") {
      setErrors({ email_err: "error_style" });
      setemailError("Please enter the email address.");
      setemailShow(false);

      // setshow({...show,emailShow:false})
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(cred.email)) {
      setErrors({ email_err: "error_style" });
      setemailError("Please enter valid email address.");
      setemailShow(false);
    } else if (cred.password === "") {
      setErrors({ password_err: "error_style" });

      setpasswordShow(false);
      // setshow({...show,passwordShow:false})
    } else {
      setErrors({ name_err: "", email_err: "", password_err: "" });
      setnameShow(true);
      setemailShow(true);
      setpasswordShow(true);
      // setshow({...show,nameShow:true,emailShow:true,passwordShow:true})
      const response = await fetch(
        `http://localhost:4000/api/auth/createUser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: cred.name,
            email: cred.email,
            password: cred.password,
          }),
        }
      );

      const json = await response.json();

      if (json.token) {
        localStorage.setItem("token", json.token);
        getUser();
        navigate("/");
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
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="name"
              className={`form-control ${errors.name_err}`}
              id="name"
              name="name"
              onChange={handelOnChange}
            />
            <div
              id="emailHelp"
              className={`form-text ${nameShow === true ? "d-none" : " "}`}
            >
              Plase enter name.
            </div>
          </div>
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
              id="emailHelp"
              className={`form-text ${emailShow === true ? "d-none" : " "}`}
            >
              {emailError}.
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
              id="emailHelp"
              className={`form-text ${passwordShow === true ? "d-none" : " "}`}
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
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleOnClick}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
