import React from "react";
import { toast, ToastOptions } from "react-toastify";

const autoClose = 5000;

type toastMessageType = string | React.ReactElement;

export const useToast = () => {

  const alertSuccess = (message: toastMessageType) => {
    toast.success(message, {
      position: "top-center",
      autoClose
    });
  }

  const alertError = (message: toastMessageType) => {
    toast.error(message, {
      position: "top-center",
      autoClose
    });
  }

  const alertWarning = (message: toastMessageType) => {
    toast.warn(message, {
      position: "top-center",
      autoClose
    });
  }

  const alertInfo = (message: toastMessageType) => {
    toast.info(message, {
      position: "top-center",
      autoClose
    });
  }

  const Alert = (message: toastMessageType, options: ToastOptions) => {
    toast(message, options);
  }

  return {
    alertSuccess,
    alertError,
    alertWarning,
    alertInfo,
    Alert
  };
}