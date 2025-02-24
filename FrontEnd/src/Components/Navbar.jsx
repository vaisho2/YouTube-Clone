//MUI Icons
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import AccountPop from "./AccountPop.jsx";
import "react-loading-skeleton/dist/skeleton.css";
import "../Css/navbar.css";
import "../Css/theme.css";
import Logo from "../img/logo1.png";
import Logo2 from "../img/logo2.png";
import { useEffect, useState, useRef } from "react";
import Signup from "./Signup.jsx";
import Signin from "./Signin.jsx";
import avatar from "../img/avatar.png";
import { useParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";
import { AiOutlineVideoCameraAdd } from "react-icons/ai";
import { useSelector } from "react-redux";
function Navbar() {
  const backendURL = "http://localhost:3000";
  const { data } = useParams();
  const [data2, setData] = useState(data);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [isSwitch, setisSwitched] = useState(true);
  const [profilePic, setProfilePic] = useState();
  const [showPop, setShowPop] = useState(false);
  const [searchedData, setSearchedData] = useState();
  const [loading, setLoading] = useState(true);
  const [newSearch, setNewSearch] = useState(false);
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });
  const profileRef = useRef();
  const searchRef = useRef();
  const impDetails = useSelector(
    (state) => state.impDetailsStoreKey.impDetails
  );
  const { userId, userPp, channelId } = impDetails;

  useEffect(() => {
    const handler = (e) => {
      if (!profileRef.current.contains(e.target)) {
        document.body.classList.remove("bg-css");

        setShowPop(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!searchRef.current.contains(e.target)) {
        setNewSearch(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const handleSearch = (e) => {
    setData(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && data2) {
      window.location.href = `/results/${data2}`;
    }
  };

  return (
    <>
      <div className={theme === true ? "navbar" : "navbar light-mode"}>
        <div className="left-bar">
          <MenuRoundedIcon
            className={theme ? "menu" : "menu-light"}
            fontSize="large"
            style={{ color: theme ? "white" : "black" }}
          />
          <img
            src={theme ? Logo : Logo2}
            alt="logo"
            loading="lazy"
            className="youtubeLogo"
            onClick={() => {
              window.location.href = "/";
            }}
          />
        </div>
        <div className="middle-bar">
          <div className={theme ? "search" : "search light-mode light-border"}>
            <input
              type="text"
              placeholder="Type to search"
              id={theme ? "searchType" : "searchType-light-mode"}
              value={data2}
              onChange={handleSearch}
              onKeyDown={handleKeyPress}
            />
            <IoIosSearch
              className={theme ? "search-icon" : "search-light-icon"}
              fontSize="28px"
              style={{ color: theme ? "rgb(160, 160, 160)" : "black" }}
              onClick={() => {
                if (data2) {
                  window.location.href = `/results/${data2}`;
                }
              }}
            />
          </div>
        </div>
        <div className="right-bar">
          <FiSearch
            fontSize="24px"
            color={theme ? "#aaa" : "black"}
            className="second-search"
            onClick={() => setNewSearch(true)}
          />

          <AiOutlineVideoCameraAdd
            title="Add video"
            className={theme ? "icon-btns videocreate" : "video-light"}
            fontSize="24px"
            style={{ color: theme ? "white" : "black" }}
            onClick={() => {
              if (userId) {
                if (channelId) window.location.href = `/channel/${channelId}`;
                else alert("Please create a channel first.");
              } else {
                setShowAuthPopup(true);
                document.body.classList.add("bg-css");
              }
            }}
          />

          <button
            onClick={() => {
              if (showAuthPopup === false) {
                setShowAuthPopup(true);
                document.body.classList.add("bg-css");
              } else {
                setShowAuthPopup(false);
                document.body.classList.remove("bg-css");
              }
            }}
            className={theme ? "signin" : "signin signin-light"}
            style={userId ? { display: "none" } : { display: "flex" }}
          >
            <AccountCircleOutlinedIcon
              fontSize="medium"
              style={{ color: "rgb(0, 162, 255)" }}
              className="user-avatar"
            />
            <p>Signin</p>
          </button>

          <img
            src={userPp ?? avatar}
            alt="user profile pic"
            loading="lazy"
            className="profile-pic"
            style={userId ? { display: "block" } : { display: "none" }}
            onClick={() => {
              if (showPop === false) {
                setShowPop(true);
              } else {
                setShowPop(false);
              }
            }}
          />
        </div>
      </div>
      <div
        className={
          theme ? "auth-popup" : "auth-popup light-mode text-light-mode"
        }
        style={
          showAuthPopup === true ? { display: "block" } : { display: "none" }
        }
      >
        <ClearRoundedIcon
          onClick={() => {
            if (showAuthPopup === false) {
              setShowAuthPopup(true);
            } else {
              setShowAuthPopup(false);
              setisSwitched(false);
              document.body.classList.remove("bg-css");
            }
          }}
          className="cancel"
          fontSize="large"
          style={{ color: "gray" }}
        />
        <div
          className="signup-last"
          style={
            isSwitch === false ? { display: "block" } : { display: "none" }
          }
        >
          <Signup close={setShowAuthPopup} />
          <div className="already">
            <p>Already have an account?</p>
            <p
              onClick={() => {
                if (isSwitch === false) {
                  setisSwitched(true);
                } else {
                  setisSwitched(false);
                }
              }}
            >
              Signin
            </p>
          </div>
        </div>
        <div
          className="signin-last"
          style={isSwitch === true ? { display: "block" } : { display: "none" }}
        >
          <Signin close={setShowAuthPopup} />
          <div className="already">
            <p>Don&apos;t have an account?</p>
            <p
              onClick={() => {
                if (isSwitch === false) {
                  setisSwitched(true);
                } else {
                  setisSwitched(false);
                }
              }}
            >
              Signup
            </p>
          </div>
        </div>
      </div>
      <div
        className="ac-pop"
        ref={profileRef}
        style={showPop === true ? { display: "block" } : { display: "none" }}
      >
        <AccountPop />
      </div>
      <div
        className={theme ? "new-searchbar" : "new-searchbar2"}
        style={{
          display: newSearch && window.innerWidth <= 940 ? "flex" : "none",
        }}
      >
        <div
          className="new-searchbar-component"
          ref={searchRef}
          style={{
            display: newSearch && window.innerWidth <= 940 ? "flex" : "none",
          }}
        >
          <FiSearch fontSize="28px" color="#aaa" />
          <input
            type="text"
            name="search-content"
            placeholder="Type to search"
            className="extra-search"
            value={data2}
            onChange={handleSearch}
            onKeyDown={handleKeyPress}
          />
          <RxCross1
            fontSize="26px"
            color="#aaa"
            className="cancel-newsearch"
            onClick={() => setNewSearch(false)}
          />
        </div>
      </div>
    </>
  );
}

export default Navbar;
