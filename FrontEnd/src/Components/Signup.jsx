import { useState } from "react";
import "../Css/navbar.css";
import "react-toastify/dist/ReactToastify.css";
import useNotifications from "../useNotification.js";
import { useDispatch } from "react-redux";
import { saveUserDetails } from "../reducer/impDetails.js";

function Signup(prop) {
  const backendURL = "http://localhost:3000";
  const [data, setData] = useState({});
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });
  const dispatch = useDispatch();

  const { SuccessNotify, ErrorNotify } = useNotifications(theme);

  const handleInputs = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const SubmitData = async (e) => {
    e.preventDefault();
    if (!data.name || !data.email || !data.password) {
      ErrorNotify("Please fill all the details");
      return;
    }
    try {
      const response = await fetch(`${backendURL}/user/signup`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { authToken, newUser, message } = await response.json();
      if (response.ok) {
        document.body.classList.remove("bg-class");
        document.body.classList.remove("bg-css");
        prop.close(false);
        SuccessNotify(message);
        localStorage.clear();
        localStorage.setItem("authToken", authToken);
        localStorage.setItem("userId", newUser._id);
        localStorage.setItem("userName", newUser.name);
        localStorage.setItem("userEmail", newUser.email);
        dispatch(
          saveUserDetails({
            authToken,
            existingChannel: {},
            userDetails: newUser,
          })
        );
        // window.location.reload();
      } else {
        ErrorNotify(message);
      }
    } catch (error) {
      ErrorNotify(error);
    }
  };

  return (
    <>
      <div className="above-data">
        <p className="signup-head">Create Your Account</p>
        <p className="signup-desc">
          Unlock Your World of Entertainment, Unlock Your World of
          Entertainment, Join the YouTube Community
        </p>
      </div>
      <div className="signup-form">
        <form onSubmit={SubmitData}>
          <input
            type="text"
            name="name"
            className={
              theme
                ? "username"
                : "username email-light light-mode text-light-mode"
            }
            placeholder="Name"
            required
            onChange={handleInputs}
          />
          <input
            type="email"
            name="email"
            className={
              theme ? "email" : "email email-light light-mode text-light-mode"
            }
            placeholder="Email Address"
            required
            onChange={handleInputs}
          />
          <input
            type="password"
            name="password"
            className={
              theme
                ? "password"
                : "password email-light light-mode text-light-mode"
            }
            placeholder="Passcode"
            required
            onChange={handleInputs}
          />
          <button
            className={theme ? "signup-btn" : "signup-btn signin-btn-light"}
            type="submit"
          >
            Create Your Account
          </button>
        </form>
      </div>
    </>
  );
}

export default Signup;
