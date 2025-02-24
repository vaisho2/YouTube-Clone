import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import YouTube from "react-youtube";
import Navbar from "./Navbar.jsx";
import "../Css/videoSection.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ReplyIcon from "@mui/icons-material/Reply";
import { LiaDownloadSolid } from "react-icons/lia";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import avatar from "../img/avatar.png";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import "react-loading-skeleton/dist/skeleton.css";
import "react-toastify/dist/ReactToastify.css";
import LeftPanel from "./LeftPanel.jsx";
import { useSelector } from "react-redux";
import useNotifications from "../useNotification.js";
import Error from "./Error.jsx";

function VideoSection() {
  const backendURL = "http://localhost:3000";
  const [videoData, setVideoData] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [allVideos, setAllVideos] = useState([]);
  const [showEditComment, setShowEditComment] = useState(false);
  const [noVideo, setNoVideo] = useState(false);
  const [editCommentValue, setEditComment] = useState("");
  const [editCommentId, setEditCommentId] = useState();
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentOpacity, setCommentOpacity] = useState(1);
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });

  const [isSubscribed, setIsSubscribed] = useState(false);

  const impDetails = useSelector(
    (state) => state.impDetailsStoreKey.impDetails
  );
  const { userId, userPp, authToken, channelId, channelName } = impDetails;

  const videoId = useParams().videoId;
  const opts = {
    playerVars: {
      autoplay: 1,
    },
  };
  const getComments = async () => {
    try {
      if (videoId) {
        setCommentLoading(true);
        const response = await fetch(`${backendURL}/comments/${videoId}`);
        const comments = await response.json();

        comments.reverse();
        setComments(comments);
      }
    } catch (error) {
      ErrorNotify(error);
    } finally {
      setComment("");
      setCommentLoading(false);
    }
  };
  useEffect(() => {
    const getVideoDetails = async () => {
      try {
        setNoVideo(false);
        if (videoId) {
          const response = await fetch(`${backendURL}/videos/${videoId}`);
          const videoData = await response.json();
          if (!response.ok) {
            setNoVideo(true);
            return;
          }
          setVideoData(videoData);
        }
      } catch (error) {
        ErrorNotify(error);
      } finally {
        setLoading(false);
      }
    };

    getVideoDetails();
    getComments();
  }, [videoId]);
  const { SuccessNotify, ErrorNotify } = useNotifications(theme);
  async function uploadComment() {
    try {
      let body = {
        videoId: videoId,
        comment,
        channelName,
        channelId,
        channelPp: userPp,
      };
      const response = await fetch(`${backendURL}/comments/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        SuccessNotify("Comment Added.");
        getComments();
      } else {
        ErrorNotify("Could not add comment");
      }
    } catch (error) {
      ErrorNotify(error);
    }
  }
  async function DeleteComment(id) {
    try {
      const response = await fetch(`${backendURL}/comments/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        SuccessNotify("Comment deleted");
        getComments();
      } else {
        ErrorNotify("Could not delete comment");
      }
    } catch (error) {}
  }
  async function EditComment() {
    try {
      let body = {
        commentId: editCommentId,
        newComment: editCommentValue,
      };
      const response = await fetch(`${backendURL}/comments/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        SuccessNotify("Comment updated");
        getComments();
        setShowEditComment(false);
      } else {
        ErrorNotify("Could not edit comment");
      }
    } catch (error) {
      ErrorNotify("Could not edit comment");
    }
  }
  useEffect(() => {
    const getAllVideos = async () => {
      try {
        const response = await fetch(`${backendURL}/videos`);
        const allVideos = await response.json();
        setAllVideos(allVideos);
      } catch (error) {
        ErrorNotify(error);
      }
    };
    getAllVideos();
  }, []);
  return (
    <>
      {showEditComment && (
        <div className="modal-overlay">
          <div className={theme ? "modal-container" : "modal-container-light"}>
            <h3>Edit comment</h3>

            <textarea
              type="text"
              value={editCommentValue}
              onChange={(e) => {
                setEditComment(e.target.value);
              }}
              className={theme ? "modal-input" : "modal-input-light"}
            />

            <div className="button-container">
              <>
                <button
                  onClick={() => {
                    setShowEditComment(false);
                  }}
                  className={
                    theme
                      ? "delete-comment-btn"
                      : "delete-comment-btn-light text-dark-mode"
                  }
                >
                  Cancel
                </button>
                <button
                  onClick={EditComment}
                  className={
                    theme
                      ? "delete-comment-btn"
                      : "delete-comment-btn-light text-dark-mode"
                  }
                >
                  Edit
                </button>
              </>
            </div>
          </div>
        </div>
      )}
      {noVideo && <Error />}
      {!noVideo && (
        <>
          <Navbar />
          <div className="my-panelbar">
            <LeftPanel />
          </div>
          <div
            style={!loading ? { display: "flex" } : { display: "none" }}
            className={
              theme ? "main-video-section" : "main-video-section light-mode"
            }
          >
            <div className="left-video-section2">
              <div className="videoframe">
                <YouTube
                  className="play-video"
                  videoId={videoData?.ytUrl}
                  opts={opts}
                />
              </div>

              <p className={theme ? "vid-title" : "vid-title text-light-mode"}>
                {videoData?.title}
              </p>
              <div className="some-channel-data">
                <div
                  className={
                    theme
                      ? "channel-left-data"
                      : "channel-left-data text-light-mode"
                  }
                >
                  <img
                    src={videoData?.channelPhoto}
                    alt="channelDP"
                    className="channelDP"
                    loading="lazy"
                    onClick={() => {
                      if (videoData?.channelId !== undefined) {
                        window.location.href = `/channel/${videoData?.channelId}`;
                      }
                    }}
                  />
                  <div className="channel-data2">
                    <div className="creator">
                      <p
                        style={{ fontSize: "17px", cursor: "pointer" }}
                        onClick={() => {
                          if (videoData?.channelId !== undefined) {
                            window.location.href = `/channel/${videoData?.channelId}`;
                          }
                        }}
                      >
                        {videoData?.channelName}
                      </p>

                      <CheckCircleIcon
                        fontSize="100px"
                        style={{
                          color: "rgb(138, 138, 138)",
                          marginLeft: "4px",
                        }}
                      />
                    </div>
                    <p
                      className={
                        theme ? "channel-subs" : "channel-subs text-light-mode2"
                      }
                    >
                      {/* {Subscribers} subscribers */}
                      7566 subscribers
                    </p>
                  </div>
                  <button
                    className={
                      theme
                        ? "subscribe"
                        : `subscribe-light ${userId ? "dull-subs" : ""}`
                    }
                    style={
                      isSubscribed === true && userId
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
                        ? "subscribe subscribe2"
                        : "subscribe subscribe2-light text-light-mode"
                    }
                    style={
                      isSubscribed === true && userId
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
                <div className="channel-right-data c-right1">
                  <div
                    className="like-dislike"
                    style={{
                      opacity: 1,
                      cursor: "pointer",
                      pointerEvents: "auto",
                    }}
                  >
                    <div
                      className={
                        theme
                          ? "like-data"
                          : "like-data like-data-light text-light-mode"
                      }
                    >
                      <ThumbUpAltOutlinedIcon
                        fontSize="medium"
                        style={{ color: theme ? "white" : "black" }}
                        className="like-icon"
                      />

                      <p className="like-count">{videoData?.likes}</p>
                    </div>
                    <div className={theme ? "vl" : "vl-light"}></div>

                    <div
                      className={
                        theme
                          ? "dislike-data"
                          : "dislike-data dislike-data-light text-light-mode"
                      }
                    >
                      <ThumbDownOutlinedIcon
                        fontSize="medium"
                        style={{ color: theme ? "white" : "black" }}
                        className="dislike-icon"
                      />
                    </div>
                  </div>

                  <div
                    className={
                      theme ? "share" : "share share-light text-light-mode"
                    }
                  >
                    <ReplyIcon
                      fontSize="medium"
                      style={{
                        color: theme ? "white" : "black",
                        transform: "rotateY(180deg)",
                      }}
                      className="sharee-icon"
                    />
                    <p className="share-txt">Share</p>
                  </div>

                  <div
                    className={
                      theme
                        ? "download-btn"
                        : "download-btn download-btn-light text-light-mode"
                    }
                  >
                    <h3>
                      <LiaDownloadSolid
                        fontSize={24}
                        className="download-icon"
                        color={theme ? "white" : "black"}
                      />
                    </h3>
                    <p className="download-txt">Download</p>
                  </div>

                  <div
                    className={
                      theme
                        ? "save-later"
                        : "save-later save-later-light text-light-mode"
                    }
                  >
                    <BookmarkAddOutlinedIcon
                      fontSize="medium"
                      style={{ color: theme ? "white" : "black" }}
                      className="save-video-icon"
                    />

                    <p>Save</p>
                  </div>

                  <div
                    className={
                      theme
                        ? "add-playlist"
                        : "add-playlist add-playlist-light text-light-mode"
                    }
                  >
                    <PlaylistAddIcon
                      fontSize="medium"
                      style={{ color: theme ? "white" : "black" }}
                      className="playlist-iconn"
                    />

                    <p>Playlist</p>
                  </div>
                </div>
                <div className="channel-right-data c-right2">
                  <div className="first-c-data">
                    <div
                      className="like-dislike"
                      style={{
                        opacity: 1,
                        cursor: "pointer",
                        pointerEvents: "auto",
                      }}
                    >
                      <div
                        className={
                          theme
                            ? "like-data"
                            : "like-data like-data-light text-light-mode"
                        }
                      >
                        <ThumbUpAltOutlinedIcon
                          fontSize="medium"
                          style={{ color: theme ? "white" : "black" }}
                          className="like-icon"
                        />

                        <p className="like-count">{videoData?.likes}</p>
                      </div>
                      <div className={theme ? "vl" : "vl-light"}></div>

                      <div
                        className={
                          theme
                            ? "dislike-data"
                            : "dislike-data dislike-data-light text-light-mode"
                        }
                      >
                        <ThumbDownOutlinedIcon
                          fontSize="medium"
                          style={{ color: theme ? "white" : "black" }}
                          className="dislike-icon"
                        />
                      </div>
                    </div>

                    <div
                      className={
                        theme ? "share" : "share share-light text-light-mode"
                      }
                      // onClick={() => {
                      //   if (shareClicked === false) {
                      //     setShareClicked(true);
                      //     document.body.classList.add("bg-css");
                      //   } else {
                      //     setShareClicked(false);
                      //     document.body.classList.remove("bg-css");
                      //   }
                      // }}
                    >
                      <ReplyIcon
                        fontSize="medium"
                        style={{
                          color: theme ? "white" : "black",
                          transform: "rotateY(180deg)",
                        }}
                        className="sharee-icon"
                      />
                      <p className="share-txt">Share</p>
                    </div>

                    <div
                      className={
                        theme
                          ? "download-btn"
                          : "download-btn download-btn-light text-light-mode"
                      }
                    >
                      <h3>
                        <LiaDownloadSolid
                          fontSize={24}
                          className="download-icon"
                        />
                      </h3>
                      <p className="download-txt">Download</p>
                    </div>

                    <div
                      className={
                        theme
                          ? "save-later"
                          : " save-later save-later-light text-light-mode"
                      }
                    >
                      <BookmarkAddOutlinedIcon
                        fontSize="medium"
                        style={{ color: theme ? "white" : "black" }}
                        className="save-video-icon"
                      />
                      <p>Save</p>
                    </div>
                  </div>
                  <div className="firstt-c-data">
                    <div
                      className="like-dislike"
                      style={{
                        opacity: 1,
                        cursor: "pointer",
                        pointerEvents: "auto",
                      }}
                    >
                      <div
                        className={
                          theme
                            ? "like-data"
                            : "like-data like-data-light text-light-mode"
                        }
                      >
                        <ThumbUpAltOutlinedIcon
                          fontSize="medium"
                          style={{ color: theme ? "white" : "black" }}
                          className="like-icon"
                        />

                        <p className="like-count">{videoData?.likes}</p>
                      </div>

                      <div className={theme ? "vl" : "vl-light"}></div>

                      <div
                        className={
                          theme
                            ? "dislike-data"
                            : "dislike-data dislike-data-light text-light-mode"
                        }
                      >
                        <ThumbDownOutlinedIcon
                          fontSize="medium"
                          style={{ color: theme ? "white" : "black" }}
                          className="dislike-icon"
                        />
                      </div>
                    </div>

                    <div
                      className={
                        theme ? "share" : "share share-light text-light-mode"
                      }
                    >
                      <ReplyIcon
                        fontSize="medium"
                        style={{
                          color: theme ? "white" : "black",
                          transform: "rotateY(180deg)",
                        }}
                        className="sharee-icon"
                      />
                      <p className="share-txt">Share</p>
                    </div>

                    <div
                      className={
                        theme
                          ? "download-btn"
                          : "download-btn download-btn-light text-light-mode"
                      }
                    >
                      <h3>
                        <LiaDownloadSolid
                          fontSize={24}
                          className="download-icon"
                        />
                      </h3>
                      <p className="download-txt">Download</p>
                    </div>
                  </div>
                  <div className="second-c-data">
                    <div
                      className={
                        theme
                          ? "add-playlist"
                          : "add-playlist add-playlist-light text-light-mode"
                      }
                    >
                      <PlaylistAddIcon
                        fontSize="medium"
                        style={{ color: theme ? "white" : "black" }}
                      />

                      <p>Playlist</p>
                    </div>
                  </div>
                  <div className="third-c-data">
                    <div
                      className={
                        theme
                          ? "save-later"
                          : "save-later save-later-light text-light-mode"
                      }
                    >
                      <BookmarkAddOutlinedIcon
                        fontSize="medium"
                        style={{ color: theme ? "white" : "black" }}
                        className="save-video-icon"
                      />

                      <p>{"Save"}</p>
                    </div>

                    <div
                      className={
                        theme
                          ? "add-playlist"
                          : "add-playlist add-playlist-light text-light-mode"
                      }
                    >
                      <PlaylistAddIcon
                        fontSize="medium"
                        style={{ color: theme ? "white" : "black" }}
                      />

                      <p>Playlist</p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  theme
                    ? "description-section2"
                    : "description-section2-light text-light-mode feature-light3"
                }
              >
                <div className="views-date" style={{ fontSize: "15.5px" }}>
                  <p>
                    {videoData?.views >= 1e9
                      ? `${(videoData?.views / 1e9).toFixed(1)}B`
                      : videoData?.views >= 1e6
                      ? `${(videoData?.views / 1e6).toFixed(1)}M`
                      : videoData?.views >= 1e3
                      ? `${(videoData?.views / 1e3).toFixed(1)}K`
                      : videoData?.views}{" "}
                    views
                  </p>
                </div>
                <div className="desc-data">
                  <p style={{ marginTop: "20px" }} className="videos-desc">
                    {videoData?.description}
                  </p>
                </div>
              </div>
              <div className="comments-section second-one">
                <div
                  className={
                    theme ? "total-comments" : "total-comments text-light-mode"
                  }
                >
                  <p>{comments ? "Comments" : "Comment"}</p>
                </div>
                {commentLoading === false ? (
                  <div className="my-comment-area">
                    <img
                      src={userPp ?? avatar}
                      alt="channelDP"
                      className="channelDP"
                      loading="lazy"
                    />
                    <input
                      className={
                        theme
                          ? "comment-input"
                          : "comment-input text-light-mode"
                      }
                      type="text"
                      name="myComment"
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => {
                        setComment(e.target.value);
                      }}
                    />
                  </div>
                ) : (
                  <div
                    className="my-comment-area"
                    style={{
                      width: "-webkit-fill-available",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      className="spin22"
                      style={{ position: "relative", top: "20px" }}
                    >
                      <div
                        className={theme ? "loader2" : "loader2-light"}
                      ></div>
                    </div>
                  </div>
                )}
                {commentLoading === false ? (
                  <div
                    className="comment-btns"
                    style={{ display: comment.length > 0 ? "block" : "none" }}
                  >
                    <button
                      className={
                        theme
                          ? "cancel-comment"
                          : "cancel-comment text-light-mode"
                      }
                      onClick={() => {
                        setComment("");
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className={
                        theme ? "upload-comment" : "upload-comment-light"
                      }
                      onClick={() => {
                        if (channelId) {
                          setCommentLoading(true);
                          //clear the loader and the comment after success else error notfy also succ ntfy
                          uploadComment();
                        } else {
                          ErrorNotify("Please create a channel first.");
                        }
                      }}
                    >
                      Comment
                    </button>
                  </div>
                ) : (
                  ""
                )}

                <div className="video-comments">
                  {comments?.map((element, index) => {
                    return (
                      <>
                        <div
                          className="comment-data"
                          key={index}
                          style={{
                            transition: "all 0.15s ease",
                            opacity: commentOpacity,
                          }}
                        >
                          <div className="comment-left-data">
                            <img
                              src={element.channelPp}
                              style={{ cursor: "pointer" }}
                              alt="cdp"
                              className="commentDP"
                              loading="lazy"
                              onClick={() => {
                                window.location.href = `/channel/${element.channelId}`;
                              }}
                            />
                          </div>
                          <div
                            className={
                              theme
                                ? "comment-right-data"
                                : "comment-right-data text-light-mode"
                            }
                          >
                            <div className="comment-row1">
                              <p
                                onClick={() => {
                                  window.location.href = `/channel/${element.channelId}`;
                                }}
                                style={{ cursor: "pointer" }}
                              >
                                {element.channelName}
                              </p>
                            </div>
                            <p className="main-comment">{element.comment}</p>
                            <div className="comment-interaction">
                              <ThumbUpIcon
                                fontSize="small"
                                style={{
                                  color: theme ? "white" : "black",
                                  cursor: "pointer",
                                }}
                                // onClick={() => {
                                //   if (user?.email) {
                                //     LikeComment(element._id);
                                //   } else {
                                //     setisbtnClicked(true);
                                //     document.body.classList.add("bg-css");
                                //   }
                                // }}
                                className="comment-like"
                              />

                              <FavoriteBorderOutlinedIcon
                                fontSize="small"
                                style={{
                                  color: theme ? "white" : "black",
                                  marginLeft: "20px",
                                  cursor: "pointer",
                                }}
                                className="heart-comment"
                                // onClick={() => {
                                //   if (user?.email === usermail) {
                                //     HeartComment(element._id);
                                //   }
                                // }}
                              />

                              {element.channelId === channelId && (
                                <button
                                  className={
                                    theme
                                      ? "delete-comment-btn"
                                      : "delete-comment-btn-light text-dark-mode"
                                  }
                                  style={{ marginLeft: "17px" }}
                                  onClick={() => {
                                    setShowEditComment(true);
                                    setEditCommentId(element._id);
                                    setEditComment(element.comment);
                                  }}
                                >
                                  Edit
                                </button>
                              )}
                              {element.channelId === channelId && (
                                <button
                                  className={
                                    theme
                                      ? "delete-comment-btn"
                                      : "delete-comment-btn-light text-dark-mode"
                                  }
                                  style={{ marginLeft: "17px" }}
                                  onClick={() => DeleteComment(element._id)}
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="recommended-section">
              <div
                className="recommend-tags"
                style={{ paddingBottom: "10px" }}
              ></div>
              <div
                className="video-section2"
                style={{ display: "flex", gap: "10px" }}
              >
                {allVideos.length &&
                  allVideos.map((element, index) => {
                    return (
                      <div
                        className="video-data12"
                        style={
                          element._id === videoId
                            ? { display: "none" }
                            : { display: "flex" }
                        }
                        key={index}
                        onClick={() => {
                          localStorage.setItem("menuClicked", false);
                          window.location.href = `/video/${element._id}`;
                        }}
                      >
                        <div className="video-left-side">
                          <img
                            src={element.thumbnail}
                            alt=""
                            className="recommend-thumbnails"
                            loading="lazy"
                          />
                          {/* <p className="duration duration2">
                        {Math.floor(element.duration / 60) +
                          ":" +
                          (Math.round(element.duration % 60) < 10
                            ? "0" + Math.round(element.duration % 60)
                            : Math.round(element.duration % 60))}
                      </p> */}
                        </div>
                        <div className="video-right-side">
                          <p
                            className={
                              theme
                                ? "recommend-vid-title"
                                : "recommend-vid-title text-light-mode"
                            }
                          >
                            {element.title}
                          </p>
                          <div
                            className={
                              theme
                                ? "recommend-uploader"
                                : "recommend-uploader text-light-mode2"
                            }
                          >
                            <p
                              className={
                                theme
                                  ? "recommend-vid-uploader uploader"
                                  : "recommend-vid-uploader uploader nohover"
                              }
                            >
                              {element.channelName}
                            </p>

                            <CheckCircleIcon
                              fontSize="100px"
                              style={{
                                color: "rgb(138, 138, 138)",
                                marginLeft: "4px",
                              }}
                            />
                          </div>
                          <div className="view-time">
                            <p className="views">
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
                    );
                  })}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default VideoSection;
