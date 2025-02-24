import Navbar from "./Navbar.jsx";
import LeftPanel from "./LeftPanel.jsx";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../Css/search.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import nothing from "../img/nothing.png";
import "react-toastify/dist/ReactToastify.css";
import useNotifications from "../useNotification.js";

function SearchResults() {
  const backendURL = "http://localhost:3000";
  const { data } = useParams();
  const [searchedVideoData, setsearchedVideoData] = useState([]);
  const [searchedChannelData, setsearchedChannelData] = useState([]);
  const [channelID, setChannelID] = useState();
  const [userEmail, setUserEmail] = useState();
  const [isbtnClicked, setisbtnClicked] = useState(false);
  const [isSwitch, setisSwitched] = useState(false);
  const [userVideos, setUserVideos] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState();
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });
  const [menuClicked, setMenuClicked] = useState(() => {
    const menu = localStorage.getItem("menuClicked");
    return menu ? JSON.parse(menu) : false;
  });
  useEffect(() => {
    localStorage.setItem("menuClicked", JSON.stringify(menuClicked));
  }, [menuClicked]);

  document.title = data && data !== undefined ? `${data} - YouTube` : "YouTube";
  const { ErrorNotify } = useNotifications(theme);
  useEffect(() => {
    if (theme === false && !window.location.href.includes("/studio")) {
      document.body.style.backgroundColor = "white";
    } else if (theme === true && !window.location.href.includes("/studio")) {
      document.body.style.backgroundColor = "0f0f0f";
    }
  }, [theme]);

  useEffect(() => {
    const getSearchResult = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${backendURL}/videos/search/${data}`);
        const filteredVideos = await response.json();
        setsearchedVideoData(filteredVideos);
      } catch (error) {
        ErrorNotify(error);
      } finally {
        setLoading(false);
      }
    };
    getSearchResult();
  }, [data]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleMenuButtonClick = () => {
      setMenuClicked((prevMenuClicked) => !prevMenuClicked);
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
      setMenuClicked((prevMenuClicked) => !prevMenuClicked);
    };

    const menuButton = document.querySelector(".close-sidepanel");
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
      setMenuClicked((prevMenuClicked) => !prevMenuClicked);
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

  return (
    <>
      <Navbar />
      <LeftPanel />
      <SkeletonTheme
        baseColor={theme ? "#353535" : "#aaaaaa"}
        highlightColor={theme ? "#444" : "#b6b6b6"}
      >
        <div
          className={
            menuClicked === true ? `searched-content` : `searched-content2`
          }
          style={{
            top: "130px",
            display: loading === true ? "block" : "none",
          }}
        >
          <div className="searched-videos-section">
            {searchedVideoData &&
              searchedVideoData.length > 0 &&
              searchedVideoData.map((element, index) => {
                return (
                  <>
                    <div
                      className="sk-thischannel-all-data"
                      style={{
                        display: "flex",
                      }}
                      key={index}
                    >
                      <Skeleton
                        count={1}
                        width={350}
                        height={197}
                        style={{ borderRadius: "12px" }}
                        className="sk-search-thumbnail"
                      />

                      <div
                        className="sk-thischannel-video-data"
                        style={{
                          position: "relative",
                          left: "20px",
                          top: "4px",
                        }}
                      >
                        <Skeleton
                          count={1}
                          width={420}
                          height={18}
                          className="sk-search-title"
                        />

                        <div
                          className={
                            theme
                              ? "thisvideo-onliner"
                              : "thisvideo-onliner text-light-mode2"
                          }
                        >
                          <Skeleton
                            count={1}
                            width={180}
                            height={18}
                            className="sk-search-videodata"
                          />
                        </div>
                        <div
                          className={
                            theme
                              ? "thisvideo-channel"
                              : "thisvideo-channel text-light-mode2"
                          }
                        >
                          <Skeleton
                            count={1}
                            width={30}
                            height={30}
                            style={{ borderRadius: "100%" }}
                            className="sk-search-channeldp"
                          />

                          <Skeleton
                            count={1}
                            width={180}
                            height={18}
                            style={{ position: "relative", left: "8px" }}
                            className="sk-search-videodata2"
                          />
                        </div>
                        <Skeleton
                          count={3}
                          width={220}
                          height={10}
                          style={{ position: "relative", top: "10px" }}
                          className="sk-search-videodata3"
                        />
                      </div>
                    </div>
                  </>
                );
              })}
          </div>
        </div>
      </SkeletonTheme>
      <div
        className={
          menuClicked === true ? `searched-content` : `searched-content2`
        }
        style={{
          top: "130px",
          display: loading === true ? "none" : "block",
        }}
      >
        <div className="searched-videos-section">
          {searchedVideoData &&
            searchedVideoData.length > 0 &&
            searchedVideoData.map((element, index) => {
              <hr
                className={
                  theme ? "seperate sep2" : "seperate sep2 seperate-light"
                }
              />;
              return (
                <div
                  className="searched-video-alldata"
                  key={index}
                  style={{
                    display: "flex",
                  }}
                  onClick={() => {
                    localStorage.setItem("menuClicked", false);
                    window.location.href = `/video/${element._id}`;
                  }}
                >
                  <img
                    src={element.thumbnail}
                    alt="thumbnail"
                    className="thischannel-thumbnail search-ka-thumbnail"
                  />
                  <p className="thisvideo-duration">
                    {Math.floor(element.duration / 60) +
                      ":" +
                      (Math.round(element.duration % 60) < 10
                        ? "0" + Math.round(element.duration % 60)
                        : Math.round(element.duration % 60))}
                  </p>
                  <div className="thischannel-video-data">
                    <p
                      className={
                        theme
                          ? "thisvideo-title"
                          : "thisvideo-title text-light-mode"
                      }
                    >
                      {window.innerWidth <= 1200 ? (
                        <p>
                          {element.title.length <= 50
                            ? element.title
                            : `${element.title.slice(0, 50)}..`}
                        </p>
                      ) : (
                        <p>{element.title}</p>
                      )}
                    </p>
                    <div
                      className={
                        theme
                          ? "thisvideo-onliner"
                          : "thisvideo-onliner text-light-mode2"
                      }
                    >
                      <p className="thisvideo-views">
                        {element.views >= 1e9
                          ? `${(element.views / 1e9).toFixed(1)}B`
                          : element.views >= 1e6
                          ? `${(element.views / 1e6).toFixed(1)}M`
                          : element.views >= 1e3
                          ? `${(element.views / 1e3).toFixed(1)}K`
                          : element.views}{" "}
                        views
                      </p>
                    </div>
                    <div
                      className={
                        theme
                          ? "thisvideo-channel"
                          : "thisvideo-channel text-light-mode2"
                      }
                    >
                      <img
                        src={element.channelPhoto}
                        alt="profile"
                        className="thischannelDP"
                      />
                      <p className="thischannel-name">{element.channelName}</p>

                      <CheckCircleIcon
                        fontSize="100px"
                        style={{
                          color: "rgb(138, 138, 138)",
                          marginLeft: "6px",
                        }}
                        className="channelVerify"
                      />
                    </div>
                    {window.innerWidth <= 970 ? (
                      <p
                        className={
                          theme
                            ? "thisvideo-desc"
                            : "thisvideo-desc text-light-mode2"
                        }
                      >
                        {element.description.length <= 50
                          ? element.description
                          : `${element.description.slice(0, 50)}...`}
                      </p>
                    ) : (
                      <p
                        className={
                          theme
                            ? "thisvideo-desc"
                            : "thisvideo-desc text-light-mode2"
                        }
                      >
                        {element.description.length <= 120
                          ? element.description
                          : `${element.description.slice(0, 120)}...`}
                      </p>
                    )}
                  </div>
                  <div className="thischannel-video-data-new">
                    <img
                      src={element.channelPhoto}
                      alt="profile"
                      className="thischannelDP"
                    />
                    <div className="new-channel-data-right">
                      <div className="thisvideos-top-right">
                        <p
                          className={
                            theme
                              ? "thisvideo-title"
                              : "thisvideo-title text-light-mode"
                          }
                        >
                          {window.innerWidth <= 1200 ? (
                            <p>
                              {element.title.length <= 50
                                ? element.title
                                : `${element.title.slice(0, 50)}..`}
                            </p>
                          ) : (
                            <p>{element.title}</p>
                          )}
                        </p>
                      </div>
                      <div className="thisvideos-bottom-right">
                        <div
                          className={
                            theme
                              ? "thisvideo-onliner"
                              : "thisvideo-onliner text-light-mode2"
                          }
                        >
                          <p className="thischannel-name">
                            {element.channelName}
                          </p>
                          <CheckCircleIcon
                            fontSize="100px"
                            style={{
                              color: "rgb(138, 138, 138)",
                              marginLeft: "6px",
                              marginRight: "6px",
                            }}
                            className="channelVerify"
                          />
                          &#x2022;
                          <p className="thisvideo-views">
                            {element.views >= 1e9
                              ? `${(element.views / 1e9).toFixed(1)}B`
                              : element.views >= 1e6
                              ? `${(element.views / 1e6).toFixed(1)}M`
                              : element.views >= 1e3
                              ? `${(element.views / 1e3).toFixed(1)}K`
                              : element.views}{" "}
                            views
                          </p>
                        </div>
                      </div>
                    </div>

                    {window.innerWidth <= 970 ? (
                      <p
                        className={
                          theme
                            ? "thisvideo-desc"
                            : "thisvideo-desc text-light-mode2"
                        }
                      >
                        {element.description.length <= 50
                          ? element.description
                          : `${element.description.slice(0, 50)}...`}
                      </p>
                    ) : (
                      <p
                        className={
                          theme
                            ? "thisvideo-desc"
                            : "thisvideo-desc text-light-mode2"
                        }
                      >
                        {element.description.length <= 120
                          ? element.description
                          : `${element.description.slice(0, 120)}...`}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          {(!searchedVideoData || searchedVideoData.length === 0) && (
            <div className="searched-content">
              <img src={nothing} alt="no results" className="nothing-found" />
              <p
                className={theme ? "no-results" : "no-results text-light-mode"}
              >
                No results found!
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SearchResults;
