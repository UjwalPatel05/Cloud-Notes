import { useState } from "react";
import { userContext } from "./userContext";

export const UserState = (props) => {
  const host = "http://localhost:4000";
  const [user, setuser] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //Get User Details

  const getUser = async () => {
    const response = await fetch(`${host}/api/auth/getUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-header": localStorage.getItem("token"),
      },
    });

    const json = await response.json(); // parses JSON response into native JavaScript objects

    setuser(json.user);
  };

  const updatePassword = async (previousPassword, newPassword)=>{
    console.log("Ujwal");
    const response = await fetch(`${host}/api/auth/changePassword`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-header": localStorage.getItem("token"),
        },
        body: JSON.stringify({ previousPassword, newPassword}),
      });
      console.log(response);
      const json = await response.json();
      console.log(json);
      return json
  }

  return (
    <userContext.Provider value={{ getUser, user, updatePassword, isLoggedIn, setIsLoggedIn }}>
      {props.children}
    </userContext.Provider>
  );
};
