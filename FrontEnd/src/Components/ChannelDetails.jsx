import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./Navbar.jsx";
import LeftPanel from "./LeftPanel.jsx";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import WestIcon from "@mui/icons-material/West";
import { storage } from "../Firebase.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "../Css/channel.css";
import "../Css/Studio/videodetails.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Tooltip from "@mui/material/Tooltip";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Zoom from "@mui/material/Zoom";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import useNotifications from "../useNotification.js";
import Error from "./Error.jsx";
import Content from "./Content.jsx";
import { updateChannelDetails } from "../reducer/impDetails.js";
import ChannelVideos from "./ChannelVideos.jsx";
function ChannelDetails() {
  const backendURL = "http://localhost:3000";
  const { channelId } = useParams();
  const [Email, setEmail] = useState();
  const [channelName, setChannelname] = useState();
  const [channelOwnerId, setChannelOwnerId] = useState();
  const [ChannelProfile, setChannelProfile] = useState();
  const [myVideos, setMyVideos] = useState([]);
  const [isEditChannel, setisEditChannel] = useState(false);
  const [isAddVideo, setIsAddVideo] = useState(false);
  const [isSwitch, setisSwitched] = useState(false);
  const [previewChannelName, setPreviewChannelName] = useState("");
  const [previewChannelId, setPreviewChannelId] = useState("");
  const [previewChannelThumbnail, setPreviewChannelThumbnail] = useState(null);
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewDescription, setPreviewDescription] = useState("");
  const [previewDuration, setPreviewDuration] = useState(null);
  const [previewTags, setPreviewTags] = useState("");
  const [previewYtUrl, setPreviewYtUrl] = useState("");
  const [previewThumbnail, setPreviewThumbnail] = useState(null);
  const [Section, setSection] = useState("Home");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [Subscribers, setSubscribers] = useState();
  const [Top, setTop] = useState("155px");
  const [coverIMG, setCoverIMG] = useState("");
  const [loading, setLoading] = useState(true);
  const [imgLoading, setImgLoading] = useState(false);
  const [noChannel, setNoChannel] = useState(false);
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });
  const impDetails = useSelector(
    (state) => state.impDetailsStoreKey.impDetails
  );
  const { userId, authToken } = impDetails;
  const { SuccessNotify, ErrorNotify } = useNotifications(theme);

  useEffect(() => {
    const getChannelData = async () => {
      try {
        setNoChannel(false);
        if (channelId) {
          const response = await fetch(`${backendURL}/getChannel/${channelId}`);
          const channelDetails = await response.json();
          if (response.ok) {
            setChannelname(channelDetails.name);
            setChannelProfile(channelDetails.profilePic);
            setSubscribers(channelDetails.subscribers);
            setChannelOwnerId(channelDetails.ownerId);
            setPreviewChannelName(channelDetails.name);
            setPreviewChannelThumbnail(channelDetails.profilePic);
            setPreviewChannelId(channelDetails._id);
          } else {
            setNoChannel(true);
          }
        }
      } catch (error) {
        ErrorNotify(error);
        setNoChannel(true);
      } finally {
        setLoading(false);
      }
    };

    getChannelData();
  }, [channelId]);

  document.title =
    channelName && channelName !== undefined
      ? `${channelName} - YouTube`
      : "YouTube";

  useEffect(() => {
    const getUserVideos = async () => {
      try {
        if (channelId) {
          const response = await fetch(
            `${backendURL}/videos/channel/${channelId}`
          );
          const myvideos = await response.json();
          setMyVideos(myvideos);
        }
      } catch (error) {
        ErrorNotify(error);
      }
    };
    getUserVideos();
  }, [channelId]);
  useEffect(() => {
    if (theme === false && !window.location.href.includes("/studio")) {
      document.body.style.backgroundColor = "white";
    } else if (theme === true && !window.location.href.includes("/studio")) {
      document.body.style.backgroundColor = "0f0f0f";
    }
  }, [theme]);

  const username = channelName;
  const [menuClicked, setMenuClicked] = useState(() => {
    const menu = localStorage.getItem("menuClicked");
    return menu ? JSON.parse(menu) : false;
  });
  useEffect(() => {
    localStorage.setItem("menuClicked", JSON.stringify(menuClicked));
  }, [menuClicked]);
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
  useEffect(() => {
    const thumbnailSection = document.querySelector(".currnt-tbimg2");
    const thumbnailSectionPlaceholder = document.querySelector(
      ".uploadnew-thumbnaill"
    );
    if (thumbnailSection) {
      if (imgLoading) {
        thumbnailSection.style.cursor = "wait";
      } else {
        thumbnailSection.style.cursor = "pointer";
      }
    }
    if (thumbnailSectionPlaceholder) {
      if (imgLoading) {
        thumbnailSectionPlaceholder.style.cursor = "wait";
      } else {
        thumbnailSectionPlaceholder.style.cursor = "pointer";
      }
    }
  }, [imgLoading]);
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
          setPreviewChannelThumbnail(downloadURL);
          setPreviewThumbnail(downloadURL);
          setImgLoading(false);
        } catch (error) {
          ErrorNotify(error);
          setImgLoading(false);
          return;
        }
      }
    );
  };
  const dispatch = useDispatch();
  async function EditChannel() {
    try {
      if (!previewChannelId) {
        window.location.reload();
        return;
      }
      let body = {
        previewChannelName,
        previewChannelThumbnail,
        channelId,
      };
      const response = await fetch(
        `${backendURL}/channel/${previewChannelId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(body),
        }
      );
      if (response.ok) {
        dispatch(
          updateChannelDetails({
            previewChannelName,
            previewChannelThumbnail,
          })
        );
        localStorage.setItem("userPp", previewChannelThumbnail);
        localStorage.setItem("channelName", previewChannelName);
        SuccessNotify("Channel Edited.");
      } else {
        ErrorNotify("Could not edit channel");
      }
    } catch (error) {
      ErrorNotify(error);
    } finally {
      setisEditChannel(false);
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    }
  }
  const getVideoId = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match && match[1] ? match[1] : url;
  };
  async function CreateVideo() {
    try {
      if (!previewChannelId) {
        window.location.reload();
        return;
      }

      let body = {
        title: previewTitle,
        ytUrl: getVideoId(previewYtUrl),
        Tag: previewTags,
        thumbnail: previewThumbnail,
        channelId,
        channelName,
        channelPhoto: ChannelProfile,
        views: 12700,
        likes: 1254,
        dislikes: 55,
        duration: previewDuration > 5999 ? 5999 : previewDuration,
        description: previewDescription,
      };
      const response = await fetch(`${backendURL}/videos/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        SuccessNotify("Video added.");
      } else {
        ErrorNotify("Could not create video");
      }
    } catch (error) {
      ErrorNotify(error);
    } finally {
      setisEditChannel(false);
      setIsAddVideo(false);
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    }
  }
  return (
    <>
      {noChannel && <Error />}
      {!noChannel && (
        <>
          <Navbar />
          <LeftPanel />
          <div
            className={
              menuClicked === true
                ? "channel-main-content-nocover"
                : "channel-main-content-nocover2"
            }
            style={{ top: "2%" }}
          >
            <SkeletonTheme
              baseColor={theme ? "#353535" : "#aaaaaa"}
              highlightColor={theme ? "#444" : "#b6b6b6"}
            >
              <div
                className="channel-top-content"
                style={
                  loading === true ? { display: "flex" } : { display: "none" }
                }
              >
                <div className="channel-left-content">
                  <Skeleton
                    count={1}
                    width={130}
                    height={130}
                    style={{ borderRadius: "100%" }}
                    className="sk-channel-profile"
                  />
                  <div className="channel-topleft-data">
                    <div className="channel-left">
                      <div className="channel-name-verified">
                        <Skeleton
                          count={1}
                          width={200}
                          height={20}
                          style={{ borderRadius: "4px" }}
                          className="sk-channel-main-name"
                        />
                      </div>
                      <div className="channel-extra">
                        <Skeleton
                          count={1}
                          width={220}
                          height={15}
                          style={{ borderRadius: "4px" }}
                          className="sk-channel-liner"
                        />
                      </div>
                      <div className="more-about">
                        <Skeleton
                          count={1}
                          width={200}
                          height={14}
                          style={{ borderRadius: "4px" }}
                          className="sk-channel-more"
                        />
                      </div>
                    </div>
                    {userId ? (
                      <div className="channel-right-content channel-dualbtns">
                        <Skeleton
                          count={1}
                          width={160}
                          height={38}
                          style={{ borderRadius: "20px" }}
                          className="sk-channel-customize"
                        />
                        <Skeleton
                          count={1}
                          width={160}
                          height={38}
                          style={{
                            borderRadius: "20px",
                            position: "relative",
                            left: "25px",
                          }}
                          className="sk-channel-manage"
                        />
                      </div>
                    ) : (
                      <div className="channel-right-content">
                        <Skeleton
                          count={1}
                          width={125}
                          height={38}
                          style={{ borderRadius: "20px" }}
                          className="sk-channel-subscribe"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SkeletonTheme>
            <div
              className="channel-top-content"
              style={
                loading === true
                  ? { visibility: "hidden", display: "none" }
                  : { visibility: "visible", display: "flex" }
              }
            >
              <div
                className={
                  theme
                    ? "channel-left-content"
                    : "channel-left-content text-light-mode"
                }
              >
                <img
                  src={ChannelProfile}
                  alt="channelDP"
                  className="channel_profile"
                />
                <div className="channel-topleft-data">
                  <div className="channel-left">
                    <div className="channel-name-verified">
                      <p className="channelname">
                        {channelName && channelName}
                      </p>
                      <Tooltip
                        TransitionComponent={Zoom}
                        title="Verified"
                        placement="right"
                      >
                        <CheckCircleIcon
                          fontSize="small"
                          style={{
                            color: "rgb(138, 138, 138)",
                            marginLeft: "6px",
                          }}
                        />
                      </Tooltip>
                    </div>
                    <div
                      className={
                        theme
                          ? "channel-extra"
                          : "channel-extra text-light-mode2"
                      }
                    >
                      <p className="channeluser">@{username && username}</p>
                      <p className="my-subs">
                        {Subscribers && Subscribers} subscribers
                      </p>
                      {myVideos && myVideos.message !== "USER DOESN'T EXIST" ? (
                        <p className="my-videoscount">
                          {myVideos && myVideos.length} videos
                        </p>
                      ) : (
                        <p className="my-videoscount">0 videos</p>
                      )}
                    </div>
                    <div
                      className={
                        theme ? "more-about" : "more-about text-light-mode2"
                      }
                    >
                      <p className="more-text">More about this channel</p>
                      <ArrowForwardIosIcon
                        fontSize="15px"
                        style={{ color: "#aaa", marginLeft: "7px" }}
                      />
                    </div>
                  </div>
                  {userId && userId != channelOwnerId && (
                    <div className="channel-right-content">
                      <button
                        className={
                          theme
                            ? "subscribethis-channel"
                            : "subscribethis-channel-light text-dark-mode"
                        }
                        style={
                          isSubscribed === true
                            ? { display: "none" }
                            : { display: "block" }
                        }
                        onClick={() => {
                          setIsSubscribed(!isSubscribed);
                        }}
                      >
                        Subscribe
                      </button>
                      <button
                        className={
                          theme
                            ? "subscribethis-channel2"
                            : "subscribethis-channel2-light"
                        }
                        style={
                          isSubscribed === true
                            ? { display: "block" }
                            : { display: "none" }
                        }
                        onClick={() => {
                          setIsSubscribed(!isSubscribed);
                        }}
                      >
                        Subscribed
                      </button>
                    </div>
                  )}
                  {userId == channelOwnerId && (
                    <div className="channel-right-content channel-dualbtns">
                      <button
                        className={
                          theme
                            ? "customize-channel"
                            : "customize-channel btn-light-mode"
                        }
                        onClick={() => {
                          setisEditChannel(true);
                          setPreviewChannelName(channelName);
                          setPreviewChannelThumbnail(ChannelProfile);
                          setIsAddVideo(false);
                        }}
                      >
                        Edit channel
                      </button>
                      <button
                        className={
                          theme
                            ? "customize-channel"
                            : "customize-channel btn-light-mode"
                        }
                        onClick={() => {
                          setisEditChannel(false);
                          setPreviewTitle("");
                          setPreviewDescription("");
                          setPreviewTags("");
                          setPreviewThumbnail(null);
                          setPreviewYtUrl("");
                          setPreviewDuration("");
                          setIsAddVideo(true);
                        }}
                      >
                        Add video
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {!isEditChannel && !isAddVideo && (
              <>
                <div className="channel-mid-content">
                  <div className="different-sections">
                    {Section === "Home" ? (
                      <p
                        className={theme ? "channel-home1" : "channel-home2"}
                        onClick={() => {
                          setSection("Home");
                        }}
                      >
                        HOME
                      </p>
                    ) : (
                      <p
                        className={
                          theme
                            ? "channel-home"
                            : "channel-home text-light-mode2"
                        }
                        onClick={() => {
                          setSection("Home");
                        }}
                      >
                        HOME
                      </p>
                    )}
                    {userId == channelOwnerId && (
                      <p
                        className={
                          theme
                            ? Section === "Manage"
                              ? "channel-videos1"
                              : "channel-videos"
                            : Section === "Manage"
                            ? "channel-videos2"
                            : "channel-videos text-light-mode2"
                        }
                        style={{ display: "block" }}
                        onClick={() => {
                          setSection("Manage");
                        }}
                      >
                        MANAGE
                      </p>
                    )}
                    {Section === "Playlists" ? (
                      <p
                        className={
                          theme ? "channel-playlists1" : "channel-playlists2"
                        }
                        onClick={() => {
                          setSection("Playlists");
                        }}
                      >
                        PLAYLISTS
                      </p>
                    ) : (
                      <p
                        className={
                          theme
                            ? "channel-playlists"
                            : "channel-playlists text-light-mode2"
                        }
                        onClick={() => {
                          setSection("Playlists");
                        }}
                      >
                        PLAYLISTS
                      </p>
                    )}
                  </div>
                </div>
                <br />
                <hr
                  className={
                    theme
                      ? "seperate seperate-new"
                      : "seperate seperate-new seperate-light"
                  }
                />
                {Section === "Home" && (
                  <ChannelVideos channelVideos={myVideos} />
                )}
                {Section === "Manage" && <Content channelVideos={myVideos} />}
                {Section === "Playlists" && (
                  <p
                    className={
                      theme ? "no-results" : "no-results text-light-mode"
                    }
                    style={{ color: "white", fontSize: "16px" }}
                  >
                    This channel doesn&apos;t have any playlists.
                  </p>
                )}
              </>
            )}
            {isEditChannel && (
              <>
                <div
                  className="back-menu-edit"
                  onClick={() => setisEditChannel(false)}
                >
                  <WestIcon fontSize="medium" style={{ color: "#aaa" }} />
                </div>

                <div
                  className="main-video-details-section"
                  style={{
                    opacity: 1,
                    pointerEvents: "auto",
                    transition: "all .12s ease",
                    cursor: "auto",
                    width: "100%",
                  }}
                >
                  <div className="current-editvideodata">
                    <p
                      className={
                        theme
                          ? "current-tophead"
                          : "current-tophead text-light-mode"
                      }
                    >
                      Channel details
                    </p>
                    <div className="thissection-btns">
                      <button
                        className={"video-editbtnss"}
                        onClick={() => {
                          if (
                            previewChannelName === "" ||
                            previewChannelThumbnail === ""
                          ) {
                            ErrorNotify("Input fields can't be empty!");
                          } else {
                            EditChannel();
                          }
                        }}
                      >
                        SAVE
                      </button>
                    </div>
                  </div>
                  <div className="current-editvideo-data">
                    <div className="video-details-left">
                      <div className="current-video-editable-section">
                        <div className="currentvideo-title">
                          <input
                            type="text"
                            name="video-title"
                            className={
                              theme
                                ? "currentvideo-title-inp"
                                : "currentvideo-title-inp text-light-mode new-light-border"
                            }
                            value={previewChannelName}
                            required
                            onChange={(e) => {
                              setPreviewChannelName(e.target.value);
                            }}
                            placeholder="Add a name that describes your channel"
                            maxLength={100}
                          />
                          <p className="title-sample-txt">
                            Channel Name (required)
                          </p>
                        </div>

                        <div
                          className="currentvideo-thumbnailedit"
                          style={{ marginBottom: "100px" }}
                        >
                          <p className={theme ? "" : "text-light-mode"}>
                            Profile Picture
                          </p>
                          <p className={theme ? "" : "text-light-mode2"}>
                            It’s recommended to use a picture that’s at least 98
                            x 98 pixels and 4MB or less.
                          </p>
                          <div className="mythumbnails-sectionn">
                            <div className="currentthumbnail-data choosed-one">
                              <label htmlFor="thumbnail-upload">
                                <img
                                  src={previewChannelThumbnail}
                                  alt="thumbnail"
                                  className="currnt-tbimg2"
                                  style={{
                                    border: `2.2px solid ${
                                      theme ? "white" : "#606060"
                                    }`,
                                    borderRadius: "3px",
                                    opacity: "1",
                                  }}
                                />
                              </label>
                            </div>

                            <input
                              type="file"
                              accept="image/*"
                              id="thumbnail-upload"
                              style={{ display: "none" }}
                              disabled={imgLoading}
                              onChange={handleThumbnailUpload}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {isAddVideo && (
              <div>
                <div
                  className="back-menu-edit"
                  onClick={() => setIsAddVideo(false)}
                >
                  <WestIcon fontSize="medium" style={{ color: "#aaa" }} />
                </div>

                <div
                  className="main-video-details-section"
                  style={{
                    opacity: 1,
                    pointerEvents: "auto",
                    transition: "all .12s ease",
                    cursor: loading ? "wait" : "auto",
                    width: "100%",
                  }}
                >
                  <div className="current-editvideodata">
                    <p
                      className={
                        theme
                          ? "current-tophead"
                          : "current-tophead text-light-mode"
                      }
                    >
                      New video details
                    </p>
                    <div className="thissection-btns">
                      <button
                        className={"video-editbtnss"}
                        onClick={() => {
                          if (
                            previewTitle === "" ||
                            previewDescription === "" ||
                            previewTags === "" ||
                            previewThumbnail === "" ||
                            previewYtUrl === "" ||
                            !previewDuration ||
                            previewDuration === 0
                          ) {
                            ErrorNotify("Input fields can't be empty!");
                          } else {
                            CreateVideo();
                          }
                        }}
                      >
                        SAVE
                      </button>
                    </div>
                  </div>
                  <div className="current-editvideo-data">
                    <div className="video-details-left">
                      <div className="current-video-editable-section">
                        <div className="currentvideo-title">
                          <input
                            type="text"
                            name="video-title"
                            className={
                              theme
                                ? "currentvideo-title-inp"
                                : "currentvideo-title-inp text-light-mode new-light-border"
                            }
                            value={previewTitle}
                            required
                            onChange={(e) => {
                              setPreviewTitle(e.target.value);
                            }}
                            placeholder="Add a title that describes your video"
                            maxLength={100}
                          />
                          <p className="title-sample-txt">Title (required)</p>
                        </div>
                        <div className="currentvideo-desc">
                          <textarea
                            type="text"
                            name="video-desc"
                            required
                            className={
                              theme
                                ? "currentvideo-desc-inp"
                                : "currentvideo-desc-inp new-light-border text-light-mode"
                            }
                            onChange={(e) => {
                              setPreviewDescription(e.target.value);
                            }}
                            placeholder="Tell viewers about your video"
                            value={previewDescription}
                            maxLength={5000}
                          />
                          <p
                            className={
                              theme
                                ? "desc-sample-txt"
                                : "desc-sample-txt desc-light-mode"
                            }
                          >
                            Description
                          </p>
                        </div>
                        <div className="currentvideo-thumbnailedit">
                          <p className={theme ? "" : "text-light-mode"}>
                            Thumbnail
                          </p>
                          <p className={theme ? "" : "text-light-mode2"}>
                            Select or upload a picture that shows what&apos;s in
                            your video. A good thumbnail stands out and draws
                            viewers&apos; attention.
                          </p>
                          <div className="mythumbnails-sectionn">
                            <div className="currentthumbnail-data choosed-one">
                              {previewThumbnail && (
                                <label htmlFor="thumbnail-upload">
                                  <img
                                    src={previewThumbnail}
                                    alt="thumbnail"
                                    className="currnt-tbimg2"
                                    style={{
                                      border: `2.2px solid ${
                                        theme ? "white" : "#606060"
                                      }`,
                                      borderRadius: "3px",
                                      opacity: "1",
                                    }}
                                  />
                                </label>
                              )}
                              {!previewThumbnail && (
                                <label
                                  htmlFor="thumbnail-upload"
                                  className={
                                    theme
                                      ? "uploadnew-thumbnaill"
                                      : "uploadnew-thumbnaill new-light-border2"
                                  }
                                >
                                  <AddPhotoAlternateOutlinedIcon
                                    fontSize="medium"
                                    style={{ color: "#aaa" }}
                                  />
                                  <p>Upload thumbnail</p>
                                </label>
                              )}
                            </div>

                            <input
                              type="file"
                              accept="image/*"
                              id="thumbnail-upload"
                              style={{ display: "none" }}
                              onChange={handleThumbnailUpload}
                              disabled={imgLoading}
                            />
                          </div>
                          <div
                            className="currnt-video-tags-section"
                            style={{ marginTop: "30px" }}
                          >
                            <p className={theme ? "" : "text-light-mode"}>
                              Tags
                            </p>
                            <p className={theme ? "" : "text-light-mode2"}>
                              Add multiple tags just using a comma to seperate
                              them.
                            </p>
                            <input
                              type="text"
                              name="video-title"
                              className={
                                theme
                                  ? "currentvid-tagsinp"
                                  : "currentvid-tagsinp new-light-border text-light-mode"
                              }
                              value={previewTags}
                              required
                              onChange={(e) => {
                                setPreviewTags(e.target.value);
                              }}
                              placeholder="Add tags to rank your video up"
                              maxLength={200}
                            />
                          </div>
                          <div
                            className="currnt-video-tags-section"
                            style={{ marginTop: "30px" }}
                          >
                            <p className={theme ? "" : "text-light-mode"}>
                              Url
                            </p>
                            <p className={theme ? "" : "text-light-mode2"}>
                              Make sure to add a valid Url.
                            </p>
                            <input
                              type="text"
                              name="video-title"
                              className={
                                theme
                                  ? "currentvid-tagsinp"
                                  : "currentvid-tagsinp new-light-border text-light-mode"
                              }
                              value={previewYtUrl}
                              required
                              onChange={(e) => {
                                setPreviewYtUrl(e.target.value);
                              }}
                              placeholder="Add youtube url to your video."
                              maxLength={200}
                            />
                          </div>
                          <div
                            className="currnt-video-tags-section"
                            style={{ marginTop: "30px", marginBottom: "100px" }}
                          >
                            <p className={theme ? "" : "text-light-mode"}>
                              Duration
                            </p>

                            <input
                              type="number"
                              name="video-title"
                              className={
                                theme
                                  ? "currentvid-tagsinp"
                                  : "currentvid-tagsinp new-light-border text-light-mode"
                              }
                              value={previewDuration}
                              required
                              onChange={(e) => {
                                setPreviewDuration(e.target.value);
                              }}
                              placeholder="Add duration of your video."
                              maxLength={200}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default ChannelDetails;
