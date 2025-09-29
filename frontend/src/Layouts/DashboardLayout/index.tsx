import React from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navigation from "../../components/Navigation";
import styles from "./styles.module.scss";

interface props {
  children: React.ReactElement
}

export default function DashboardLayout({ children }: props) {
  return (
    <>
      <div className={styles.Dashboard}>
        <Navigation />
        <div className={styles.Container}>{children}</div>
      </div>
      <ToastContainer />
    </>
  );
}
