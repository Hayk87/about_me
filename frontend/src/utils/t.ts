import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from "../store";

export const useTranslate = () => {
  const translates = useSelector((state: RootState) => state.translates);
  const t = useCallback((k: string) => translates.currentTranslates[k] || k, [translates.currentTranslates]);

  return { t };
}
