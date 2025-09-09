import React, { useState, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import queryString from "query-string";
import type { RootState } from './store';
import routing from './router';
import { getLanguages, getCurrentTranslates, getAuthInfo } from "./api/requests";
import { tokenStorage, token_key } from "./utils";
import { initLanguages } from "./store/slices/languages";
import { initCurrentTranslates } from "./store/slices/translates";
import { initProfile } from "./store/slices/profile";
import Loading from "./components/Loading";

function App() {
  const dispatch = useDispatch();
  const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
  const profile = useSelector((state: RootState) => state.profile);
  const search = queryString.parse(window.location.search);

  useEffect(() => {
    const token = tokenStorage.getItem(token_key);
    initializationDefaults()
      .then(async () => {
        const isAdminPath = process.env.REACT_APP_APP_BASE_URL ? !!(window.location.pathname.match(new RegExp(`^\/${process.env.REACT_APP_APP_BASE_URL}`))) : true;
        if (token && isAdminPath) {
          try {
            const res: any = await getAuthInfo();
            dispatch(initProfile(res.data));
          } catch (err) {
            console.log('initializationDefaults callback: ', err);
          }
        }
        setIsAppLoading(false);
      })
      .catch(err => console.log('initializationDefaults ERROR: ', err));
  }, []);

  const initializationDefaults = async () => {
    const langs = await getLanguages();
    dispatch(initLanguages(langs.data));
    let lngCode = '';
    if (search.lng) {
      const currentLang = langs.data.find((item: any) => item.code === search.lng);
      if (currentLang) {
        lngCode = search.lng as string;
      } else {
        lngCode = langs.data.find((item: any) => item.is_default)?.code;
      }
    } else {
      lngCode = langs.data.find((item: any) => item.is_default)?.code;
    }
    const trs = await getCurrentTranslates(lngCode);
    dispatch(initCurrentTranslates(trs.data));
  }

  return (
    <>
      {isAppLoading ? (
        <Loading />
      ) : (
        <RouterProvider router={routing(profile.data)} />
      )}
    </>
  );
}

export default App;
