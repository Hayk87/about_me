import React from "react";
import { NavigationWeb } from "../../components/Navigation/web";
import styles from "./styles.module.scss";

interface WebLayoutProps {
  children: React.ReactElement;
}

export default function WebLayout(props: WebLayoutProps) {
  return (
    <>
      <div className={styles.websiteContent}>
        <NavigationWeb />
        <div>
          {props.children}
        </div>
      </div>
    </>
  );
}