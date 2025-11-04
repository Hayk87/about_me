import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { NavigationWeb } from "../../components/Navigation/web";
import { getCurrentTranslates } from "../../api/requests";
import { initCurrentTranslates } from "../../store/slices/translates";
import { useLanguage } from "../../utils";
import styles from "./styles.module.scss";

interface WebLayoutProps {
  children: React.ReactElement;
}

export default function WebLayout(props: WebLayoutProps) {
  const firstRender = useRef<boolean>(true);
  const dispatch = useDispatch();
  const { currentLang } = useLanguage();

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    getCurrentTranslates(currentLang.code)
      .then(trs => {
        dispatch(initCurrentTranslates(trs.data));
      })
      .catch(err => console.log('changeLanguage: ', err));
  }, [currentLang.code]);

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