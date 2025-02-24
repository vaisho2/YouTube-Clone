import "../Css/Browse.css";
import { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import LeftPanel from "./LeftPanel.jsx";
import Navbar from "./Navbar.jsx";
import "../Css/theme.css";
import { useSelector } from "react-redux";
import useNotifications from "../useNotification.js";

function Browse() {
  const backendURL = "http://localhost:3000";
  const [validVideos, setValidVideos] = useState([]);
  const [menuClicked, setMenuClicked] = useState(
    () => JSON.parse(localStorage.getItem("menuClicked")) || false
  );
  const [TagsSelected, setTagsSelected] = useState("All");
  const [FilteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(
    () => JSON.parse(localStorage.getItem("Dark")) ?? true
  );

  const impDetails = useSelector(
    (state) => state.impDetailsStoreKey.impDetails
  );

  const { ErrorNotify } = useNotifications(theme);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Merged menu click event listeners
  useEffect(() => {
    const handleMenuButtonClick = () => {
      if (window.innerWidth >= 860) setMenuClicked((prev) => !prev);
    };

    const menuButtons = document.querySelectorAll(".menu, .menu-light");
    menuButtons.forEach((btn) =>
      btn.addEventListener("click", handleMenuButtonClick)
    );

    return () => {
      menuButtons.forEach((btn) =>
        btn.removeEventListener("click", handleMenuButtonClick)
      );
    };
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = theme ? "#0f0f0f" : "white";
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("menuClicked", JSON.stringify(menuClicked));
  }, [menuClicked]);

  const Tags = [
    "All",
    "Gaming",
    "Comedy",
    "Vlog",
    "Artificial Intelligence",
    "Travel",
    "Fashion",
    "Beauty",
    "Food",
  ];

  useEffect(() => {
    const getVideos = async () => {
      try {
        const response = await fetch(`${backendURL}/videos`);
        if (!response.ok) throw new Error("Failed to fetch videos");

        const allVideos = await response.json();
        setValidVideos(allVideos);
        setLoading(false);
      } catch (error) {
        ErrorNotify(error.message);
        setLoading(false);
      }
    };

    getVideos();
  }, []);

  useEffect(() => {
    if (TagsSelected !== "All" && validVideos.length) {
      const filtered = validVideos.filter((vid) =>
        vid.Tag.toLowerCase().includes(TagsSelected.toLowerCase())
      );
      setFilteredVideos(filtered);
    } else {
      setFilteredVideos(validVideos);
    }
  }, [TagsSelected, validVideos]);

  const updateViews = async (id) => {
    try {
      await fetch(`${backendURL}/updateview/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      ErrorNotify(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <LeftPanel />
      <SkeletonTheme
        baseColor={theme ? "#353535" : "#aaaaaa"}
        highlightColor={theme ? "#444" : "#b6b6b6"}
      >
        {loading ? (
          <div
            className={theme ? "browse" : "browse light-mode"}
            style={{ display: "flex" }}
          >
            <div
              className={
                menuClicked
                  ? `browse-data ${theme ? "" : "light-mode"}`
                  : `browse-data2 ${theme ? "" : "light-mode"}`
              }
              style={{ left: menuClicked ? "250px" : "74px" }}
            >
              <div
                className={
                  theme ? "popular-categories" : "popular-categories light-mode"
                }
              >
                {Tags.map((tag, index) => (
                  <div
                    key={index}
                    className={
                      TagsSelected === tag
                        ? `top-tags ${theme ? "tag-color" : "tag-color-light"}`
                        : `top-tags ${theme ? "" : "tagcolor-newlight"}`
                    }
                  >
                    <p onClick={() => setTagsSelected(tag)}>{tag}</p>
                  </div>
                ))}
              </div>
              <div className="video-section">
                <div
                  className="uploaded-videos"
                  style={{ paddingRight: menuClicked ? "50px" : "0px" }}
                >
                  {Array.from({ length: 16 }).map((_, index) => (
                    <div key={index} className="video-data">
                      <Skeleton
                        width={330}
                        height={186}
                        style={{ borderRadius: "10px" }}
                      />
                      <div className="channel-basic-data">
                        <Skeleton
                          width={40}
                          height={40}
                          style={{ borderRadius: "100%", marginTop: "40px" }}
                        />
                        <Skeleton
                          width={250}
                          height={15}
                          count={2}
                          style={{
                            position: "relative",
                            top: "40px",
                            left: "15px",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={theme ? "browse" : "browse light-mode"}
            style={{ display: "flex" }}
          >
            <div
              className={
                menuClicked
                  ? `browse-data ${theme ? "" : "light-mode"}`
                  : `browse-data2 ${theme ? "" : "light-mode"}`
              }
              style={{ left: menuClicked ? "250px" : "74px" }}
            >
              <div
                className={
                  theme ? "popular-categories" : "popular-categories light-mode"
                }
              >
                {Tags.map((tag, index) => (
                  <div
                    key={index}
                    className={
                      TagsSelected === tag
                        ? `top-tags ${theme ? "tag-color" : "tag-color-light"}`
                        : `top-tags ${theme ? "" : "tagcolor-newlight"}`
                    }
                  >
                    <p onClick={() => setTagsSelected(tag)}>{tag}</p>
                  </div>
                ))}
              </div>
              <div className="video-section">
                <div
                  className="uploaded-videos"
                  style={{ paddingRight: menuClicked ? "50px" : "0px" }}
                >
                  {FilteredVideos.map((video, index) => (
                    <div
                      key={index}
                      className="video-data"
                      onClick={() => {
                        localStorage.setItem("menuClicked", false);
                        window.location.href = `/video/${video._id}`;
                      }}
                    >
                      <img
                        className="browse-thumbnails"
                        src={video.thumbnail}
                        alt="Thumbnail"
                        style={{ width: "330px", borderRadius: "10px" }}
                      />
                      <p className="duration">
                        {`${Math.floor(video.duration / 60)}:${
                          video.duration % 60 < 10 ? "0" : ""
                        }${Math.round(video.duration % 60)}`}
                      </p>
                      <div
                        className={
                          theme
                            ? "channel-basic-data"
                            : "channel-basic-data text-light-mode"
                        }
                      >
                        <img
                          className="channel-profile"
                          src={video.channelPhoto}
                          alt="Channel Profile"
                        />
                        <div className="channel-text-data">
                          <p className="title">
                            {video.title.length <= 60
                              ? video.title
                              : `${video.title.slice(0, 55)}..`}
                          </p>
                          <div className="video-uploader">
                            <p
                              className={
                                theme ? "uploader" : "uploader text-light-mode2"
                              }
                            >
                              {video.channelName}
                            </p>
                            <Tooltip title="Verified" placement="right">
                              <CheckCircleIcon
                                style={{
                                  color: "rgb(138, 138, 138)",
                                  marginLeft: "4px",
                                }}
                              />
                            </Tooltip>
                          </div>
                          <p className="views">
                            {video.views.toLocaleString()} views
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </SkeletonTheme>
    </>
  );
}

export default Browse;
