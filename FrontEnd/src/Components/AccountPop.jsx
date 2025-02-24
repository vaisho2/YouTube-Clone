import { useEffect, useState } from "react";
import "../Css/accountPop.css";
import "../Css/studio.css";
import avatar from "../img/avatar.png";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { storage } from "../Firebase.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import { SiYoutubestudio } from "react-icons/si";
import { useDispatch, useSelector } from "react-redux";
import { clearDetails, updateChannelDetails } from "../reducer/impDetails.js";
import useNotifications from "../useNotification.js";

function AccountPop() {
  const backendURL = "http://localhost:3000";
  const [profile, setProfile] = useState("");
  const [previewImage, setPreviewImage] = useState(avatar);
  const [isLoading, setisLoading] = useState(false);
  const [ChannelName, setChannelName] = useState();
  const [ChannelAbout, setChannelAbout] = useState();
  const [imgLoading, setImgLoading] = useState(false);

  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });
  // const [channelId, setChannelID] = useState();
  const [isBtnClicked, setIsBtnClicked] = useState(false);
  const [showChannelForm, setShowChannelForm] = useState(false);

  const [isChannel, setIsChannel] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    localStorage.setItem("Dark", JSON.stringify(theme));
  }, [theme]);

  const impDetails = useSelector(
    (state) => state.impDetailsStoreKey.impDetails
  );
  const { userId, userPp, userName, userEmail, authToken, channelId } =
    impDetails;
  const handleChannelname = (e) => {
    setChannelName(e.target.value);
  };

  const handleChannelabout = (e) => {
    setChannelAbout(e.target.value);
  };

  useEffect(() => {
    const thumbnailSection = document.querySelector(".selected-pic");
    if (thumbnailSection) {
      if (imgLoading) {
        thumbnailSection.style.cursor = "wait";
      } else {
        thumbnailSection.style.cursor = "pointer";
      }
    }
  }, [imgLoading]);
  const { SuccessNotify, ErrorNotify } = useNotifications(theme);

  const handleThumbnailUpload = async (e) => {
    setImgLoading(true);
    const file = e.target.files[0];

    const fileReference = ref(storage, `profile/${file.name}`);
    const uploadData = uploadBytesResumable(fileReference, file);
    uploadData.on(
      "state_changed",
      null,
      (error) => {
        ErrorNotify(error);
        setImgLoading(false);
        return;
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadData.snapshot.ref);
          setPreviewImage(downloadURL);
          setImgLoading(false);
        } catch (error) {
          ErrorNotify(error);
          setImgLoading(false);
          return;
        }
      }
    );
  };

  async function saveChannelData(e) {
    e.preventDefault();
    try {
      if (
        ChannelName === "" ||
        !ChannelName ||
        !previewImage ||
        previewImage === ""
      ) {
        ErrorNotify("input fields must not be empty.");
        return;
      }
      if (!userId || !authToken || !userEmail) {
        window.location.reload();
        return;
      }
      let body = {
        name: ChannelName,
        email: userEmail,
        profilePic: previewImage,
        ownerId: userId,
        subscribers: 9987,
      };
      const response = await fetch(`${backendURL}/channel/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(body),
      });
      const { newChannel } = await response.json();
      if (response.ok) {
        dispatch(
          updateChannelDetails({
            previewChannelName: ChannelName,
            previewChannelThumbnail: previewImage,
            channelId: newChannel._id,
          })
        );
        localStorage.setItem("userPp", previewImage);
        localStorage.setItem("channelName", ChannelName);
        localStorage.setItem("channelId", newChannel._id);
        SuccessNotify("Channel created.");
      } else {
        ErrorNotify("Could not create channel");
      }
    } catch (error) {
      ErrorNotify(error);
    } finally {
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    }
  }

  const handleLogout = () => {
    dispatch(clearDetails());
    localStorage.clear();
    window.location.reload();
  };

  return (
    <>
      <div
        className={
          theme ? "account-pop" : "account-pop account-pop-light light-mode"
        }
        style={
          isBtnClicked === false ? { display: "block" } : { display: "none" }
        }
      >
        <div className="user-section">
          <div className="left-part">
            <img
              src={userPp ?? avatar}
              alt="channelIMG"
              className="channelIMG"
            />
          </div>
          <div className="right-part">
            <p>{userName}</p>

            <p>
              {userEmail?.slice(0, 12)}
              {userEmail?.length > 12 ? "..." : ""}
            </p>
          </div>
        </div>
        <hr className={theme ? "seperate" : "seperate-light"} />
        <div className="about-channel-section">
          <div
            className={theme ? "yourchannel c-sec" : "yourchannel c-sec2"}
            onClick={() => {
              if (channelId) {
                window.location.href = `/channel/${channelId}`;
              } else {
                setIsBtnClicked(true);
                document.body.classList.add("bg-css");
                setShowChannelForm(true);
              }
            }}
          >
            <AccountBoxOutlinedIcon
              fontSize="medium"
              style={{ color: theme ? "white" : "black" }}
            />
            <p>Your channel</p>
          </div>
          <div
            className={theme ? "yourstudio c-sec" : "yourstudio c-sec2"}
            onClick={() => {
              if (channelId) {
                window.location.href = `/channel/${channelId}`;
              } else {
                setIsBtnClicked(true);
                document.body.classList.add("bg-css");
                setShowChannelForm(true);
              }
            }}
          >
            <SiYoutubestudio
              fontSize="21px"
              style={{ color: theme ? "white" : "black" }}
            />
            <p>YouTube Studio</p>
          </div>
          <div
            className={theme ? "apperance c-sec" : "apperance c-sec2"}
            onClick={() => {
              if (isBtnClicked === false) {
                setIsBtnClicked(true);
              } else {
                setIsBtnClicked(false);
              }
            }}
          >
            <DarkModeOutlinedIcon
              fontSize="medium"
              style={{ color: theme ? "white" : "black" }}
            />
            <p>Appearance: {theme ? "Dark" : "Light"}</p>
            <ArrowForwardIosRoundedIcon
              className="open"
              fontSize="small"
              style={{ color: theme ? "#ffffff8a" : "black" }}
            />
          </div>
        </div>
        <hr className={theme ? "seperate" : "seperate-light"} />
        <div className="extra1-section">
          <div className={theme ? "language c-sec" : "language c-sec2"}>
            <TranslateOutlinedIcon
              fontSize="medium"
              style={{ color: theme ? "white" : "black" }}
            />
            <p>Language: English</p>
          </div>
          <div
            className={theme ? "exitout c-sec" : "exitout c-sec2"}
            onClick={handleLogout}
          >
            <LogoutOutlinedIcon
              fontSize="medium"
              style={{ color: theme ? "white" : "black" }}
            />
            <p>Sign Out</p>
          </div>
        </div>
      </div>
      <div
        className={
          theme ? "account-pop" : "account-pop account-pop-light light-mode"
        }
        style={
          isBtnClicked === true && !showChannelForm
            ? { display: "block", paddingTop: "12px" }
            : { display: "none", paddingTop: "20px" }
        }
      >
        <div className="appearance-title">
          <ArrowBackOutlinedIcon
            className={theme ? "back-arrow" : "back-arroww2"}
            fontSize="medium"
            style={{ color: theme ? "white" : "black" }}
            onClick={() => {
              if (isBtnClicked === true) {
                setIsBtnClicked(false);
              } else {
                setIsBtnClicked(true);
              }
            }}
          />
          <p>Apperance</p>
        </div>
        <hr
          className={theme ? "seperate" : "seperate-light"}
          style={
            isBtnClicked === true ? { marginTop: "6px" } : { marginTop: "15px" }
          }
        />
        <div className="theme-section">
          <p className="caution">Settings applied to this browser only</p>
          <div className="theme-list">
            <div
              className={theme ? "dark-theme" : "dark-theme2"}
              onClick={() => {
                setTheme(true);
                window.location.reload();
              }}
            >
              <DoneOutlinedIcon
                className="dark-arrow"
                fontSize="medium"
                color={theme ? "white" : "black"}
                style={theme === true ? { opacity: 1 } : { opacity: 0 }}
              />
              <p>Dark theme</p>
            </div>
            <div
              className={theme ? "light-theme" : "light-theme2"}
              onClick={() => {
                setTheme(false);
                window.location.reload();
              }}
            >
              <DoneOutlinedIcon
                className="light-arrow"
                fontSize="medium"
                color={theme ? "white" : "black"}
                style={theme === false ? { opacity: 1 } : { opacity: 0 }}
              />
              <p>Light theme</p>
            </div>
          </div>
        </div>
      </div>
      <div
        className={
          theme ? "create-channel" : "create-channel light-mode text-light-mode"
        }
        style={showChannelForm ? { display: "flex" } : { display: "none" }}
      >
        <ClearRoundedIcon
          fontSize="large"
          className={theme ? "close-channel" : "close-channel-light"}
          style={{ color: theme ? "rgb(170 170 170 / 50%)" : "#606060" }}
          onClick={() => {
            window.location.href = "/";
            document.body.classList.remove("bg-css");
          }}
        />
        <p className="channel-head">Create Your Channel</p>
        <p
          className={
            theme ? "channel-slogan" : "channel-slogan text-light-mode2"
          }
        >
          Share Your Story: Inspire and Connect with a YouTube Channel!
        </p>
        <form onSubmit={saveChannelData} className="channel-deatils">
          <div className="profile-pic-section">
            <img
              src={previewImage}
              alt="Profile pic"
              className="selected-pic"
            />
            <div className="upload-btn-wrapper">
              <button className={theme ? "btn" : "btn text-dark-mode"}>
                SELECT
              </button>
              <input
                type="file"
                name="myfile"
                accept=".jpg, .png"
                onChange={handleThumbnailUpload}
              />
            </div>
          </div>
          <div className="channel-name">
            <input
              className={
                theme
                  ? "channelName"
                  : "channelName light-mode text-light-mode new-light-border"
              }
              type="text"
              name="channelname"
              placeholder="Channel Name"
              maxLength={25}
              onChange={handleChannelname}
              value={ChannelName}
              required
            />
            <textarea
              className={
                theme
                  ? "channelAbout"
                  : "channelAbout light-mode text-light-mode new-light-border"
              }
              type="text"
              name="channelAbout"
              placeholder="About channel"
              onChange={handleChannelabout}
              value={ChannelAbout}
              style={{ width: "93%", resize: "vertical" }}
              required
            />
          </div>
          {isLoading === false ? (
            <button
              className={
                isLoading
                  ? `save-data-disable ${theme ? "" : "text-dark-mode"}`
                  : `save-data ${theme ? "" : "text-dark-mode"}`
              }
              type="submit"
              style={{ marginTop: "22px" }}
              disabled={isLoading ? true : false}
            >
              SAVE
            </button>
          ) : (
            <button
              className={isLoading ? "save-data-disable" : "save-data"}
              type="submit"
              style={{ marginTop: "22px" }}
              disabled={isLoading ? true : false}
            >
              <span className="loader4"></span>
            </button>
          )}
        </form>
      </div>
    </>
  );
}

export default AccountPop;
