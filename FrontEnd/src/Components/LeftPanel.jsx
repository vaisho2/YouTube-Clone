import "../Css/leftpanel.css";
import HomeIcon from "@mui/icons-material/Home";
import WhatshotOutlinedIcon from "@mui/icons-material/WhatshotOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import PlaylistPlayOutlinedIcon from "@mui/icons-material/PlaylistPlayOutlined";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import { useEffect, useState } from "react";
import Logo from "../img/logo1.png";
import Logo2 from "../img/logo2.png";
import { useLocation } from "react-router-dom";
import "react-loading-skeleton/dist/skeleton.css";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { GoHomeFill } from "react-icons/go";
import { HiOutlineFire } from "react-icons/hi";
import { MdOutlineSubscriptions } from "react-icons/md";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { useSelector } from "react-redux";
import useNotifications from "../useNotification.js";

function LeftPanel() {
  const backendURL = "http://localhost:3000";
  const [menuClicked, setMenuClicked] = useState(() => {
    const menu = localStorage.getItem("menuClicked");
    return menu ? JSON.parse(menu) : false;
  });
  const location = useLocation();
  const [Subscriptions, setSubscriptions] = useState([]);
  const [PlaylistData, setPlaylistData] = useState([]);
  const [isbtnClicked, setisbtnClicked] = useState(false);
  const [isSwitch, setisSwitched] = useState(true);
  const [loading, setLoading] = useState(true);
  const [savedPlaylist, setSavedPlaylist] = useState([]);
  const [togglepanel, setTogglePannel] = useState(false);
  const [closePanel, setClosePanel] = useState(false);
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });

  const User = useSelector((state) => state.impDetailsStoreKey.impDetails);
  const { user } = User;

  useEffect(() => {
    const handleMenuButtonClick = () => {
      if (window.innerWidth >= 860) {
        setMenuClicked((prevMenuClicked) => !prevMenuClicked);
      } else {
        document.body.classList.add("bg-css");
        setTogglePannel(true);
      }
    };

    const menuButton = document.querySelector(".menu");
    if (menuButton) {
      menuButton.addEventListener("click", handleMenuButtonClick);
    }

    return () => {
      if (menuButton) {
        menuButton.removeEventListener("click", handleMenuButtonClick);
      }
    };
  }, []);

  useEffect(() => {
    const handleMenuButtonClick = () => {
      if (window.innerWidth >= 860) {
        setMenuClicked((prevMenuClicked) => !prevMenuClicked);
      } else {
        document.body.classList.add("bg-css");
        setTogglePannel(true);
      }
    };

    const menuButton = document.querySelector(".menu-light");
    if (menuButton) {
      menuButton.addEventListener("click", handleMenuButtonClick);
    }

    return () => {
      if (menuButton) {
        menuButton.removeEventListener("click", handleMenuButtonClick);
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("menuClicked", JSON.stringify(menuClicked));
  }, [menuClicked]);

  const selected = localStorage.getItem("selected");
  const { ErrorNotify } = useNotifications(theme);
  useEffect(() => {
    const getSubscriptions = async () => {
      try {
        if (user?.email) {
          const response = await fetch(
            `${backendURL}/getsubscriptions/${user?.email}`
          );
          const result = await response.json();
          setSubscriptions(result);
        }
      } catch (error) {
        ErrorNotify(error);
      }
    };

    return () => getSubscriptions();
  }, [user?.email]);

  useEffect(() => {
    const getPlaylistData = async () => {
      try {
        if (user?.email) {
          const response = await fetch(
            `${backendURL}/getplaylistdata/${user?.email}`
          );
          const playlistData = await response.json();
          setPlaylistData(playlistData);
        }
      } catch (error) {
        ErrorNotify(error);
      }
    };
    return () => getPlaylistData();
  }, [user?.email]);

  useEffect(() => {
    const GetSavedPlaylist = async () => {
      try {
        if (user?.email) {
          const response = await fetch(
            `${backendURL}/getsavedplaylist/${user?.email}`
          );
          const matchingPlaylists = await response.json();
          setSavedPlaylist(matchingPlaylists);
        }
      } catch (error) {
        ErrorNotify(error);
      }
    };

    return () => GetSavedPlaylist();
  }, [user?.email]);

  return (
    <>
      <div
        className={theme ? "main-left-section" : "main-left-section light-mode"}
        style={
          menuClicked === false ? { display: "none" } : { display: "block" }
        }
      >
        <div className="first-section ">
          <div
            className={`home sec-data ${theme ? "changeBG" : "changeBG-light"}`}
            onClick={() => {
              window.location.href = "/";
            }}
          >
            <HomeIcon
              fontSize="medium"
              style={{ color: theme ? "white" : "black" }}
            />

            <p>Home</p>
          </div>
          <div className={"trending sec-data"}>
            <WhatshotOutlinedIcon
              fontSize="medium"
              style={{ color: theme ? "white" : "black" }}
            />

            <p>Trending</p>
          </div>
          <div className={"subscription sec-data"}>
            <SubscriptionsOutlinedIcon
              fontSize="medium"
              style={{ color: theme ? "white" : "black" }}
            />

            <p>Subscriptions</p>
          </div>
        </div>
        <hr className={theme ? "seperate" : "seperate-light"} />
        <div className="second-section">
          <div className={"library sec-data"}>
            <VideoLibraryOutlinedIcon
              fontSize="medium"
              style={{ color: theme ? "white" : "black" }}
            />

            <p>Library</p>
          </div>
          <div className={"watch-later sec-data"}>
            <WatchLaterOutlinedIcon
              fontSize="medium"
              style={{ color: theme ? "white" : "black" }}
            />

            <p>Watch later</p>
          </div>
          <div className={"liked-video sec-data"}>
            <ThumbUpOutlinedIcon
              fontSize="medium"
              style={{ color: theme ? "white" : "black" }}
            />

            <p>Liked videos</p>
          </div>
          <div className="my-playlists-sectionn">
            {PlaylistData &&
              PlaylistData !== "No playlists available..." &&
              PlaylistData.length > 0 &&
              PlaylistData.map((element, index) => {
                return (
                  <div
                    className="my-playlist-data"
                    key={index}
                    onClick={() => {
                      window.location.href = `/playlist/${element._id}`;
                    }}
                  >
                    <PlaylistPlayOutlinedIcon
                      fontSize="medium"
                      style={{ color: theme ? "white" : "black" }}
                    />
                    <Tooltip
                      TransitionComponent={Zoom}
                      title={`${element.playlist_name}`}
                      placement="right"
                    >
                      <p>
                        {element.playlist_name.length <= 8
                          ? element.playlist_name
                          : `${element.playlist_name.slice(0, 8)}..`}
                      </p>
                    </Tooltip>
                  </div>
                );
              })}
            {savedPlaylist &&
              savedPlaylist.length > 0 &&
              savedPlaylist.map((element, index) => {
                return (
                  <div
                    className="my-playlist-data"
                    key={index}
                    onClick={() => {
                      window.location.href = `/playlist/${element._id}`;
                    }}
                  >
                    <PlaylistPlayOutlinedIcon
                      fontSize="medium"
                      style={{ color: theme ? "white" : "black" }}
                    />
                    <Tooltip
                      TransitionComponent={Zoom}
                      title={`${element.playlist_name}`}
                      placement="right"
                    >
                      <p>
                        {element.playlist_name.length <= 8
                          ? element.playlist_name
                          : `${element.playlist_name.slice(0, 8)}..`}
                      </p>
                    </Tooltip>
                  </div>
                );
              })}
          </div>
        </div>
        <hr className={theme ? "seperate" : "seperate-light"} />
      </div>
      <div
        className={
          theme
            ? "main-left-section main-2"
            : "main-left-section main-2 light-mode"
        }
        style={
          menuClicked === false ? { display: "flex" } : { display: "none" }
        }
      >
        <div className="first-section ">
          <div
            className={`home sec-data sec-data2 ${
              theme ? "changeBG" : "changeBG-light"
            }`}
            onClick={() => {
              window.location.href = "/";
            }}
          >
            <HomeIcon
              fontSize="medium"
              style={{ color: theme ? "white" : "black" }}
            />
          </div>
          <div className={"trending trending2 sec-data sec-data2"}>
            <WhatshotOutlinedIcon
              fontSize="medium"
              style={{ color: theme ? "white" : "black" }}
            />
          </div>
          <div className={"subscription subscription2 sec-data sec-data2"}>
            <SubscriptionsOutlinedIcon
              fontSize="medium"
              style={{ color: theme ? "white" : "black" }}
            />
          </div>
        </div>
        {/* <hr className="seperate" /> */}
        <div className="second-section">
          <div className={"library library2 sec-data sec-data2"}>
            <VideoLibraryOutlinedIcon
              fontSize="medium"
              style={{ color: theme ? "white" : "black" }}
            />
          </div>
          <div className={"watch-later watch-later2 sec-data sec-data2"}>
            <WatchLaterOutlinedIcon
              fontSize="medium"
              style={{ color: theme ? "white" : "black" }}
            />
          </div>
          <div className={"liked-video liked-video2 sec-data sec-data2"}>
            <ThumbUpOutlinedIcon
              fontSize="medium"
              style={{ color: theme ? "white" : "black" }}
            />
          </div>
        </div>
      </div>

      {/* first media query menu */}
      <div
        className={
          theme
            ? "main-left-section main-2 main-3"
            : "main-left-section main-2 main-3 light-mode"
        }
        style={{ display: "none" }}
      >
        <div className="first-section ">
          <div
            className={`home sec-data sec-data2 ${
              theme ? "changeBG" : "changeBG-light"
            }`}
            onClick={() => {
              window.location.href = "/";
            }}
          >
            <HomeIcon
              fontSize="medium"
              style={{ color: theme ? "white" : "black" }}
            />
          </div>
          <div className={"trending trending2 sec-data sec-data2"}>
            <WhatshotOutlinedIcon
              fontSize="medium"
              style={{ color: theme ? "white" : "black" }}
            />
          </div>
          <div className={"subscription subscription2 sec-data sec-data2"}>
            <SubscriptionsOutlinedIcon
              fontSize="medium"
              style={{ color: theme ? "white" : "black" }}
            />
          </div>
        </div>
        {/* <hr className="seperate" /> */}
        <div className="second-section">
          <div className={"library library2 sec-data sec-data2"}>
            <VideoLibraryOutlinedIcon
              fontSize="medium"
              style={{ color: theme ? "white" : "black" }}
            />
          </div>
          <div className={"watch-later watch-later2 sec-data sec-data2"}>
            <WatchLaterOutlinedIcon
              fontSize="medium"
              style={{ color: theme ? "white" : "black" }}
            />
          </div>
          <div className={"liked-video liked-video2 sec-data sec-data2"}>
            <ThumbUpOutlinedIcon
              fontSize="medium"
              style={{ color: theme ? "white" : "black" }}
            />
          </div>
        </div>
      </div>

      {/* first media query menu expanded*/}
      <div
        className={`secondary-panel ${theme ? "" : "light-mode"}`}
        style={{ display: togglepanel ? "block" : "none" }}
      >
        <div className={theme ? "panel-topdata" : "panel-topdata light-mode"}>
          <MenuRoundedIcon
            fontSize="large"
            style={{ color: theme ? "white" : "black" }}
            className="close-sidepanel"
            onClick={() => {
              document.body.classList.remove("bg-css");

              setTogglePannel(false);
            }}
          />
          <img
            src={theme ? Logo : Logo2}
            alt="logo"
            loading="lazy"
            style={{ marginLeft: "5px" }}
            className="youtubeLogo"
            onClick={() => {
              window.location.href = "/";
            }}
          />
        </div>
        <div
          className={
            theme ? "main-left-section-new" : "main-left-section-new light-mode"
          }
        >
          <div className="first-section ">
            <div
              className={`home sec-data ${
                theme ? "changeBG" : "changeBG-light"
              }`}
              onClick={() => {
                window.location.href = "/";
              }}
            >
              <HomeIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />

              <p>Home</p>
            </div>
            <div className={"trending sec-data"}>
              <WhatshotOutlinedIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />

              <p>Trending</p>
            </div>
            <div className={"subscription sec-data"}>
              <SubscriptionsOutlinedIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />

              <p>Subscriptions</p>
            </div>
          </div>
          <hr className={theme ? "seperate" : "seperate-light"} />
          <div className="second-section">
            <div className={"library sec-data"}>
              <VideoLibraryOutlinedIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />

              <p>Library</p>
            </div>

            <div className={"watch-later sec-data"}>
              <WatchLaterOutlinedIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />

              <p>Watch later</p>
            </div>
            <div className={"liked-video sec-data"}>
              <ThumbUpOutlinedIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />

              <p>Liked videos</p>
            </div>
            <hr className={theme ? "seperate" : "seperate-light"} />
          </div>
        </div>
      </div>

      {/* HORIZONTAL PANEL */}

      <div
        className={theme ? "horizontal-panel" : "horizontal-panel light-mode"}
      >
        <div className="horizontal-main-section">
          <div
            className={
              theme ? "home-hori hori" : "home-hori hori text-light-mode"
            }
            onClick={() => {
              window.location.href = "/";
            }}
          >
            <GoHomeFill
              fontSize="28px"
              color={theme ? "white" : "black"}
              className="hor-icons"
            />

            <p>Home</p>
          </div>
          <div
            className={
              theme
                ? "trending-hori hori"
                : "trending-hori hori text-light-mode"
            }
          >
            <HiOutlineFire
              fontSize="28px"
              color={theme ? "white" : "black"}
              className="hor-icons"
            />

            <p>Trending</p>
          </div>

          <div
            className={
              theme
                ? "subscriptions-hori hori"
                : "subscriptions-hori hori text-light-mode"
            }
          >
            <MdOutlineSubscriptions
              fontSize="28px"
              color={theme ? "white" : "black"}
              className="hor-icons"
            />

            <p>Subscriptions</p>
          </div>
          <div
            className={
              theme ? "library-hori hori" : "library-hori hori text-light-mode"
            }
          >
            <MdOutlineVideoLibrary
              fontSize="28px"
              color={theme ? "white" : "black"}
              className="hor-icons"
            />

            <p>Library</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LeftPanel;
