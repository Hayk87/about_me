import { useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import queryString from "query-string";
import { RootState } from "../../store";
import PageNotFound from "../../admin-pages/PageNotFound";
import DashboardLayout from "../DashboardLayout";
import { useEffect } from "react";
import { getCurrentTranslates } from "../../api/requests";
import { initCurrentTranslates } from "../../store/slices/translates";
import { useLanguage } from "../../utils";

export default function GlobalLayout() {
  const firstRender = useRef<boolean>(true);
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile);
  const { currentLang, lngCode, languages } = useLanguage();

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

  let view = <Outlet />;
  if (lngCode) {
    const currentLang = languages.list.find(item => item.code === lngCode);
    if (!currentLang) {
      return <PageNotFound />;
    }
  }

  if (profile.data?.id) {
    return <DashboardLayout>{view}</DashboardLayout>;
  }

  return <div>{view}</div>;
}
