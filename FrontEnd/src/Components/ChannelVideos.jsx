import "../Css/Studio/channelvideos.css";
import { storage } from "../Firebase.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-loading-skeleton/dist/skeleton.css";

function ChannelVideos(prop) {
  const backendURL = "http://localhost:3000";
  const [videosort, setVideoSort] = useState();
  const [showDiv, setShowDiv] = useState(false);
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });

  const navigate = useNavigate();

  useEffect(() => {
    function handleResize() {
      setShowDiv(window.innerWidth <= 600);
    }

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
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      }
    }
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="allvideo-sectionn">
        <div className="video-sorting">
          <button
            className={
              videosort === "Latest"
                ? `latest-video ${theme ? "" : "btn-light-mode"} active${
                    theme ? "" : "-light"
                  }`
                : `latest-video ${theme ? "" : "btn-light-mode"}`
            }
            onClick={() => {
              setVideoSort("Latest");
            }}
          >
            Latest
          </button>
          <button
            className={
              videosort === "Popular"
                ? `Popular-video ${theme ? "" : "btn-light-mode"} active${
                    theme ? "" : "-light"
                  }`
                : `Popular-video ${theme ? "" : "btn-light-mode"}`
            }
            onClick={() => {
              setVideoSort("Popular");
            }}
          >
            Popular
          </button>
          <button
            className={
              videosort === "Oldest"
                ? `Oldest-video ${theme ? "" : "btn-light-mode"} active${
                    theme ? "" : "-light"
                  }`
                : `Oldest-video ${theme ? "" : "btn-light-mode"}`
            }
            onClick={() => {
              setVideoSort("Oldest");
            }}
          >
            Oldest
          </button>
        </div>

        <div
          className="uploadedvideos-sectionall"
          style={{ visibility: "visible", display: "grid" }}
        >
          {prop.channelVideos.length > 0 &&
            prop.channelVideos &&
            prop.channelVideos.map((element, index) => {
              return (
                <div
                  className="uploaded-video-contents"
                  key={index}
                  style={{
                    display: "block",
                  }}
                  onClick={() => {
                    navigate(`/video/${element?._id}`);
                    window.location.reload();
                  }}
                >
                  <img
                    src={element?.thumbnail}
                    alt="Thumbnail"
                    className="myvidthumbnail"
                    loading="lazy"
                  />
                  <p className="myvideo-duration2 duration-new">
                    {Math.floor(element?.duration / 60) +
                      ":" +
                      (Math.round(element?.duration % 60) < 10
                        ? "0" + Math.round(element?.duration % 60)
                        : Math.round(element?.duration % 60))}
                  </p>
                  <div
                    className={
                      theme
                        ? "videos-metadataa"
                        : "videos-metadataa text-light-mode"
                    }
                  >
                    <p>
                      {element?.title.length <= 50
                        ? element?.title
                        : `${element?.title.slice(0, 50)}...`}
                    </p>
                    <div
                      className={
                        theme
                          ? "views-and-time"
                          : "views-and-time text-light-mode2"
                      }
                    >
                      <p className="myviews">
                        {element?.views >= 1e9
                          ? `${(element?.views / 1e9).toFixed(1)}B`
                          : element?.views >= 1e6
                          ? `${(element?.views / 1e6).toFixed(1)}M`
                          : element?.views >= 1e3
                          ? `${(element?.views / 1e3).toFixed(1)}K`
                          : element?.views}{" "}
                        views
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}

export default ChannelVideos;
