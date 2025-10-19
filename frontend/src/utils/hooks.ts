import { useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import queryString from "query-string";
import { RootState } from "../store";

export const useLanguage = () => {
  const location = useLocation();
  const languages = useSelector((state: RootState) => state.languages);
  const defaultLang = languages.list.find((item: any) => item.is_default);
  const search = queryString.parse(location.search);
  const lngCode = search.lng || defaultLang.code;

  return { location, lngCode, search };
}

export const useTranslate = () => {
  const translates = useSelector((state: RootState) => state.translates);
  const t = useCallback((k: string) => translates.currentTranslates[k] || k, [translates.currentTranslates]);

  return { t };
}
