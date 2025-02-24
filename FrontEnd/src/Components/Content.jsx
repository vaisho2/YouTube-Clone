import "../Css/Studio/channelvideos.css";
import WestIcon from "@mui/icons-material/West";
import { storage } from "../Firebase.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import useNotifications from "../useNotification.js";

function Content(prop) {
  const backendURL = "http://localhost:3000";
  const [isDeleteClicked, setIsDeleteClicked] = useState(false);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [deleteVideo, setDeleteVideo] = useState();
  const [boxclicked, setBoxClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editVideoId, setEditVideoId] = useState();
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewDescription, setPreviewDescription] = useState("");
  const [previewTags, setPreviewTags] = useState("");
  const [previewYtUrl, setPreviewYtUrl] = useState("");
  const [previewThumbnail, setPreviewThumbnail] = useState(null);
  const [previewDuration, setPreviewDuration] = useState(null);
  const [imgLoading, setImgLoading] = useState(false);
  const [menu, setmenu] = useState(() => {
    const menu = localStorage.getItem("studioMenuClicked");
    return menu ? JSON.parse(menu) : false;
  });
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });
  document.title = "Channel content - YouTube Studio";

  const impDetails = useSelector(
    (state) => state.impDetailsStoreKey.impDetails
  );
  const { authToken } = impDetails;
  const { SuccessNotify, ErrorNotify } = useNotifications(theme);

  const DeleteVideo = async (id) => {
    try {
      if (id) {
        const response = await fetch(`${backendURL}/videos/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        await response.json();
        if (response.ok) {
          SuccessNotify("Video deleted.");
          setTimeout(() => {
            window.location.reload();
          }, 1200);
        } else {
          ErrorNotify("Could not delete video");
        }
      }
    } catch (error) {
      ErrorNotify(error);
    }
  };

  useEffect(() => {
    const thumbnailSection = document.querySelector(".currnt-tbimg2");
    if (thumbnailSection) {
      if (imgLoading) {
        thumbnailSection.style.cursor = "wait";
      } else {
        thumbnailSection.style.cursor = "pointer";
      }
    }
  }, [imgLoading]);

  const handleThumbnailUpload = async (e) => {
    setImgLoading(true);
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        if (Math.abs(aspectRatio - 16 / 9) < 0.01) {
        } else {
          alert("Please upload an image with a 16:9 aspect ratio.");
          return;
        }
      };
      img.src = reader.result;
    };
    if (file) {
      reader.readAsDataURL(file);
    }
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

  const getVideoId = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match && match[1] ? match[1] : url;
  };

  async function EditVideo() {
    try {
      if (!editVideoId) {
        window.location.reload();
        return;
      }

      let body = {
        previewTitle,
        previewYtUrl: getVideoId(previewYtUrl),
        previewTags,
        previewThumbnail,
        previewDescription,
        previewDuration,
      };
      const response = await fetch(`${backendURL}/videos/${editVideoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        SuccessNotify("Video Edited.");
      } else {
        ErrorNotify("Could not edit video");
      }
    } catch (error) {
      ErrorNotify(error);
    } finally {
      setIsEditClicked(false);
      const midSection = document.querySelector(".channel-mid-content");
      if (midSection) {
        midSection.style.display = "block";
      }
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    }
  }

  return (
    <>
      {!isEditClicked && (
        <div className="channel-content-section">
          <div className="channels-uploaded-videos-section">
            {prop.channelVideos && prop.channelVideos.length > 0 && (
              <table className="videos-table">
                <thead>
                  <tr
                    style={{
                      color: theme ? "#aaa" : "black",
                      fontSize: "14px",
                    }}
                  >
                    <th
                      style={{
                        textAlign: "left",
                        paddingLeft: "40px",
                        width: "45%",
                      }}
                    >
                      Video
                    </th>
                    <th>Visibility</th>
                    <th>Views</th>

                    <th>Likes</th>
                  </tr>
                </thead>
                <tbody>
                  {prop.channelVideos?.map((element, index) => {
                    return (
                      <tr
                        key={index}
                        className={
                          theme ? "table-roww" : "table-roww preview-lightt"
                        }
                        style={
                          loading === true
                            ? { pointerEvents: "none" }
                            : { pointerEvents: "auto" }
                        }
                      >
                        <td className="video-cell">
                          <SkeletonTheme
                            baseColor={theme ? "#353535" : "#aaaaaa"}
                            highlightColor={theme ? "#444" : "#b6b6b6"}
                          >
                            <div
                              className="no-skeleton"
                              style={
                                loading === true
                                  ? { display: "flex" }
                                  : { display: "none" }
                              }
                            >
                              <Skeleton
                                count={1}
                                width={150}
                                height={84}
                                style={{ marginLeft: "30px" }}
                              />
                            </div>
                          </SkeletonTheme>
                          <div
                            className="no-skeleton"
                            style={
                              loading === true
                                ? { visibility: "hidden", display: "none" }
                                : { visibility: "visible", display: "flex" }
                            }
                          >
                            <img
                              src={element?.thumbnail}
                              alt="thumbnail"
                              className="studio-video-thumbnail"
                              onClick={() => {
                                window.location.href = `/video/${element?._id}`;
                              }}
                            />
                            <p className="video-left-duration">
                              {Math.floor(element?.duration / 60) +
                                ":" +
                                (Math.round(element?.duration % 60) < 10
                                  ? "0" + Math.round(element?.duration % 60)
                                  : Math.round(element?.duration % 60))}
                            </p>
                          </div>
                          <div className="studio-video-details">
                            <SkeletonTheme
                              baseColor={theme ? "#353535" : "#aaaaaa"}
                              highlightColor={theme ? "#444" : "#b6b6b6"}
                            >
                              <div
                                className="no-skeleton2"
                                style={
                                  loading === true
                                    ? { display: "flex" }
                                    : { display: "none" }
                                }
                              >
                                <Skeleton
                                  count={1}
                                  width={250}
                                  height={14}
                                  style={{
                                    borderRadius: "3px",
                                    position: "relative",
                                    left: "25px",
                                  }}
                                />
                                <Skeleton
                                  count={1}
                                  width={180}
                                  height={10}
                                  style={{
                                    borderRadius: "3px",
                                    position: "relative",
                                    top: "15px",
                                    left: "25px",
                                  }}
                                />
                                <Skeleton
                                  count={1}
                                  width={140}
                                  height={10}
                                  style={{
                                    borderRadius: "3px",
                                    position: "relative",
                                    top: "18px",
                                    left: "25px",
                                  }}
                                />
                              </div>
                            </SkeletonTheme>
                            <div
                              className="no-skeleton2"
                              style={
                                loading === true
                                  ? { visibility: "hidden", display: "none" }
                                  : { visibility: "visible", display: "flex" }
                              }
                            >
                              <p
                                className={
                                  theme
                                    ? "studio-video-title"
                                    : "studio-video-title text-light-mode"
                                }
                              >
                                {element?.title.length <= 40
                                  ? element?.title
                                  : `${element?.title.slice(0, 40)}...`}
                              </p>
                              {element?.description ? (
                                <p
                                  className={
                                    theme
                                      ? "studio-video-desc"
                                      : "studio-video-desc text-light-mode2"
                                  }
                                >
                                  {element?.description.length <= 85
                                    ? element?.description
                                    : `${element?.description.slice(0, 85)}...`}
                                </p>
                              ) : (
                                <p>Add description</p>
                              )}
                            </div>
                            <div className="video-editable-section">
                              <ModeEditOutlineOutlinedIcon
                                className={
                                  theme
                                    ? "video-edit-icons"
                                    : "video-edit-icons-light"
                                }
                                fontSize="medium"
                                style={{ color: theme ? "#aaa" : "#606060" }}
                                onClick={() => {
                                  setEditVideoId(element._id);
                                  setPreviewTitle(element.title);
                                  setPreviewDescription(element.description);
                                  setPreviewTags(element.Tag);
                                  setPreviewThumbnail(element.thumbnail);
                                  setPreviewYtUrl(element.ytUrl);
                                  setPreviewDuration(element.duration);
                                  setIsEditClicked(true);
                                  const midSection = document.querySelector(
                                    ".channel-mid-content"
                                  );
                                  if (midSection) {
                                    midSection.style.display = "none";
                                  }
                                }}
                              />

                              <DeleteOutlineOutlinedIcon
                                onClick={() => {
                                  setDeleteVideo(element);
                                  if (element?._id !== undefined) {
                                    setIsDeleteClicked(true);
                                    document.body.classList.add("bg-css2");
                                  }
                                }}
                                className={
                                  theme
                                    ? "video-edit-icons"
                                    : "video-edit-icons-light"
                                }
                                fontSize="medium"
                                style={{ color: theme ? "#aaa" : "#606060" }}
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="privacy-table">
                            <RemoveRedEyeOutlinedIcon
                              fontSize="small"
                              style={{ color: "#2ba640" }}
                            />

                            <p
                              className={theme ? "" : "text-light-mode2"}
                              style={{ marginLeft: "8px" }}
                            >
                              Public
                            </p>
                          </div>
                        </td>

                        <td>
                          <p className={theme ? "" : "text-light-mode2"}>
                            {element?.views && element?.views.toLocaleString()}
                          </p>
                        </td>

                        <td>
                          <p className={theme ? "" : "text-light-mode2"}>
                            {element?.likes}
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
      {isEditClicked && (
        <div>
          <div
            className="back-menu-edit"
            onClick={() => {
              setIsEditClicked(false);
              const midSection = document.querySelector(".channel-mid-content");
              if (midSection) {
                midSection.style.display = "block";
              }
            }}
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
                  theme ? "current-tophead" : "current-tophead text-light-mode"
                }
              >
                Video details
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
                      EditVideo();
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
                    <p className={theme ? "" : "text-light-mode"}>Thumbnail</p>
                    <p className={theme ? "" : "text-light-mode2"}>
                      Select or upload a picture that shows what&apos;s in your
                      video. A good thumbnail stands out and draws viewers&apos;
                      attention.
                    </p>
                    <div className="mythumbnails-sectionn">
                      <div className="currentthumbnail-data choosed-one">
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
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        id="thumbnail-upload"
                        style={{ display: "none" }}
                        onChange={handleThumbnailUpload}
                      />
                    </div>
                    <div
                      className="currnt-video-tags-section"
                      style={{ marginTop: "30px" }}
                    >
                      <p className={theme ? "" : "text-light-mode"}>Tags</p>
                      <p className={theme ? "" : "text-light-mode2"}>
                        Add multiple tags just using a comma to seperate them.
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
                      <p className={theme ? "" : "text-light-mode"}>Url</p>
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
                      <p className={theme ? "" : "text-light-mode"}>Duration</p>

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
      <div
        className={
          theme
            ? "last-delete-warning"
            : "last-delete-warning light-mode text-light-mode"
        }
        style={
          isDeleteClicked === true && deleteVideo
            ? { display: "block" }
            : { display: "none" }
        }
      >
        <div className="delete-question">
          <p>Permanently delete this video?</p>
        </div>
        <div className="deleted-video-data">
          <div
            className={
              theme ? "thisdelete-data" : "thisdelete-data social-lightt"
            }
          >
            <img
              src={deleteVideo && deleteVideo.thumbnail}
              alt="thumbnail"
              className="deletevideo-thumbnail"
            />
            <p className="thisdelete-duration">
              {Math.floor(deleteVideo && deleteVideo.duration / 60) +
                ":" +
                (Math.round(deleteVideo && deleteVideo.duration % 60) < 10
                  ? "0" + Math.round(deleteVideo && deleteVideo.duration % 60)
                  : Math.round(deleteVideo && deleteVideo.duration % 60))}
            </p>
            <div className="thisdelete-video-details">
              <p className="delete-title">
                {deleteVideo && deleteVideo.title.length <= 15
                  ? deleteVideo.title
                  : `${deleteVideo && deleteVideo.title.slice(0, 15)}...`}
              </p>

              <p
                className={
                  theme ? "delete-views" : "delete-views text-light-mode2"
                }
              >
                {deleteVideo && deleteVideo.views + " views"}
              </p>
            </div>
          </div>
        </div>
        <div className="delete-consent">
          <CheckBoxOutlineBlankIcon
            onClick={() => {
              setBoxClicked(!boxclicked);
            }}
            fontSize="medium"
            style={
              boxclicked === false
                ? { color: theme ? "#aaa" : "#606060", cursor: "pointer" }
                : { display: "none" }
            }
          />
          <CheckBoxIcon
            onClick={() => {
              setBoxClicked(!boxclicked);
            }}
            fontSize="medium"
            style={
              boxclicked === true
                ? { color: theme ? "white" : "606060", cursor: "pointer" }
                : { display: "none" }
            }
          />
          <p>
            I understand that deleting a video from YouTube is permanent and
            cannot be undone.
          </p>
        </div>
        <div className="delete-video-buttons">
          <button
            className={
              theme
                ? "download-delete-video delete-css"
                : "download-delete-video delete-css blue-txt"
            }
            onClick={() => {
              setIsDeleteClicked(false);
              document.body.classList.remove("bg-css2");
            }}
          >
            CANCEL
          </button>
          <button
            className={
              theme
                ? "delete-video-btn delete-css"
                : `delete-video-btn delete-css ${!boxclicked ? "" : "blue-txt"}`
            }
            disabled={!boxclicked}
            onClick={() => {
              if (boxclicked === true && deleteVideo) {
                DeleteVideo(deleteVideo._id);
                setIsDeleteClicked(false);
              }
            }}
            style={{
              opacity: boxclicked === false ? 0.7 : 1,
              color: boxclicked === false ? "#aaa" : "#3eaffe",
              cursor: boxclicked === false ? "not-allowed" : "pointer",
            }}
          >
            DELETE VIDEO
          </button>
        </div>
      </div>
    </>
  );
}

export default Content;
