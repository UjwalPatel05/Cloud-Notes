import React, { useState } from "react";
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";
import "./css/LoginPage.css";

function ResetPasswordLink() {
  const [cred, setCred] = useState({ email: "" });
  const [emailError, setEmailError] = useState("");
  const [emailShow, setEmailShow] = useState(false);
  const [errors, setErrors] = useState({ email_err: "", password_err: "" });

  const [open, setOpen] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    setOpenSuccess(false);
  };

  const handelOnChange = (e) => {
    setCred({ ...cred, [e.target.name]: e.target.value });
  };

  const handleOnClick = async (e) => {
    e.preventDefault();

    setEmailShow(false);

    if (cred.email === "") {
      setErrors({ email_err: "error_style" });
      setEmailShow(true);
      setEmailError("Please enter the email address.");
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(cred.email)) {
      setErrors({ email_err: "error_style" });
      setEmailError("Please enter valid email address.");
      setEmailShow(true);
    } else {
      setEmailShow(false);
      setErrors({ email_err: "" });
      const response = await fetch(
        `http://localhost:4000/api/auth/sendResetPasswordLink`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: cred.email }),
        }
      );

      const json = await response.json();

      if (json.error === 0) {
        setOpenSuccess(true);
        setMessage(json.message);
      } else {
        setOpen(true);
        setMessage(json.error_message);
      }
    }
  };

  return (
    <div>
      <div style={{ width: "400px", margin: "auto" }} className="mt-5">
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
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleOnClick}
          >
            Submit
          </button>
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
  );
}

export default ResetPasswordLink;
