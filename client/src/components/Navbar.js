import { Avatar } from "@mui/material";
import React, { useContext, useEffect, useRef } from "react";
import { green } from "@mui/material/colors";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { userContext } from "../context/user/userContext";

function Navbar() {

  const navigate = useNavigate();
  const location = useLocation();
  const ref = useRef();
  const refClose = useRef();

  const context = useContext(userContext);
  const { getUser, user, setIsLoggedIn } = context;

  const handleOnClick = (e) => {
    e.preventDefault();
    ref.current.click();
  };

  useEffect(() => {

    if (localStorage.getItem("token")) {
      getUser();
    }

    // eslint-disable-next-line
  }, []);



  useEffect(() => {
    // Listen for changes to the isLoggedIn localStorage variable
    const handleStorageChange = (event) => {
      if (event.key === 'isLoggedIn' && event.newValue === 'false') {
        handleLogout();
      }
    };

    // Add the event listener
    window.addEventListener('storage', handleStorageChange);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
    // eslint-disable-next-line
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem("token");
    navigate("/login");
    refClose.current.click();
  };


  return (
    <>
      <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            CloudNote
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="ms-auto navbar-nav" style={{ alignItems: "center" }}>
              {localStorage.getItem("token") &&
                <li className="nav-item">
                  <Link
                    className={`nav-link ${location.pathname === "/" ? "active" : ""
                      }`}
                    aria-current="page"
                    to="/"
                  >
                    Home
                  </Link>
                </li>
              }
              {!localStorage.getItem("token") && (
                <>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${location.pathname === "/login" ? "active" : ""
                        }`}
                      to="/login"
                    >
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${location.pathname === "/signup" ? "active" : ""
                        }`}
                      to="/signup"
                    >
                      Signup
                    </Link>
                  </li>
                </>
              )}

              {localStorage.getItem("token") && (
                <>
                  {" "}
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/login"
                      onClick={handleOnClick}
                    >
                      Logout
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/userDetails">
                      <Avatar sx={{ bgcolor: green[400] }}>
                        {" "}
                        {user?.name?.charAt(0).toUpperCase()}
                      </Avatar>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <button
        type="button"
        ref={ref}
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#logoutConfirmation"
      >
        Launch demo modal
      </button>

      <div
        className="modal fade"
        id="logoutConfirmation"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">Are you sure you want to logout?</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                // onClick={() => {
                //   localStorage.removeItem("token");
                //   navigate("/login");
                //   refClose.current.click();
                // }}
                onClick={handleLogout}
              >
                Yes
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                ref={refClose}
                data-bs-dismiss="modal"
              >
                No
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
