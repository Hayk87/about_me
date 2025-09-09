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

export default function GlobalLayout() {
  const firstRender = useRef<boolean>(true);
  const dispatch = useDispatch();
  const languages = useSelector((state: RootState) => state.languages);
  const defaultLang = languages.list.find((item: any) => item.is_default);
  const profile = useSelector((state: RootState) => state.profile);
  const location = useLocation();
  const search = queryString.parse(location.search);
  const lngCode = search.lng || defaultLang.code;
  const currentLang = languages.list.find((item: any) => item.code === lngCode);

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
