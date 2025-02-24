import Error from "./Components/Error.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Helmet } from "react-helmet";
import ytLogo from "./img/icon.png";
import { useSelector, useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import React, { Suspense, useEffect } from "react";
import { clearDetails, regainUserDetails } from "./reducer/impDetails.js";
import LoadingComponent from "./Components/LoadingComponent.jsx";

const Browse = React.lazy(() => import("./Components/Browse.jsx"));
const VideoSection = React.lazy(() => import("./Components/VideoSection.jsx"));
const SearchResults = React.lazy(() =>
  import("./Components/SearchResults.jsx")
);
const ChannelDetails = React.lazy(() =>
  import("./Components/ChannelDetails.jsx")
);

function App() {
  const impDetails = useSelector(
    (state) => state.impDetailsStoreKey.impDetails
  );
  const { userId } = impDetails;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(regainUserDetails());
  }, [dispatch]);

  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <BrowserRouter>
        <Helmet>
          <link rel="icon" type="image/x-icon" href={ytLogo} />
        </Helmet>
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<LoadingComponent />}>
                <Browse />
              </Suspense>
            }
          />
          <Route
            path="/home"
            element={
              <Suspense fallback={<LoadingComponent />}>
                {/* {console.log("Rendering Browse page")} */}
                <Browse />
              </Suspense>
            }
          />
          <Route
            path="/channel/:channelId"
            element={
              <Suspense fallback={<LoadingComponent />}>
                <ChannelDetails />
              </Suspense>
            }
          />
          <Route
            path="/results/:data"
            element={
              <Suspense fallback={LoadingComponent}>
                <SearchResults />
              </Suspense>
            }
          />
          <Route
            path="/video/:videoId"
            element={
              <Suspense fallback={<LoadingComponent />}>
                <VideoSection />
              </Suspense>
            }
          />
          <Route path="/*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
