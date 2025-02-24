// useNotifications.js
import { useCallback } from "react";
import { toast } from "react-toastify";

const useNotifications = (theme) => {
  const SuccessNotify = useCallback(
    (message) => {
      toast.success(message, {
        position: "top-center",
        autoClose: 1200,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme ? "dark" : "light",
      });
    },
    [theme]
  );

  const ErrorNotify = useCallback(
    (message) => {
      toast.error(message, {
        position: "top-center",
        autoClose: 1200,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme ? "dark" : "light",
      });
    },
    [theme]
  );

  return { SuccessNotify, ErrorNotify };
};

export default useNotifications;
