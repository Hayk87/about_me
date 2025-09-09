import { useEffect, useState } from "react";
import { SystemUserInterface } from "../interfaces";

export * from './t';
export * from './rights-mapper-data';
export * as adminPagesPath from './admin-pages-path';
export * as webPagesPath from './web-pages-path';

export const tokenStorage = window.sessionStorage;

export const token_key = process.env.REACT_APP_TOKEN_KEY || 'app_token';

// This variable must be exists
export const applicationBaseURL: string = process.env.REACT_APP_APP_BASE_URL || 'admin-panel';

export const checkPermission = (user: Partial<SystemUserInterface>, right: string): boolean => {
  if (user.is_deleted) return false;
  if (user.is_blocked) return false;
  if (user.is_root) return true;
  const rights = user.staff?.rights || [];
  return rights.includes(right);
}

export const classnames = (classes: { [key: string]: boolean }): string => (
  Object.entries(classes)
    .filter(([_, value]) => value)
    .map(([key]) => key)
    .join(' ')
);

export const formatNumberWithCommas = (value: number | string | undefined) => {
  const number = Number(value);
  if (isNaN(number)) return '';
  let valueStrParsed = (value === undefined ? '' : value).toString();
  const hasMinusSymbol = !!valueStrParsed.match(/^-/);
  if (hasMinusSymbol) {
    valueStrParsed = valueStrParsed.slice(1);
  }
  const [val, dec] = valueStrParsed.split('.');
  const valueReversed = val.split('').reverse();
  const result = [];
  for (let i = 0, len = valueReversed.length; i < len; i++) {
    result.push(valueReversed[i]);
    if ((i + 1) % 3 === 0 && i + 1 < len) {
      result.push(',')
    }
  }
  let resultValue = result.reverse().join('');
  if (dec) {
    resultValue += `.${dec}`;
  } else if (valueStrParsed.match(/\.$/)) {
    resultValue += '.';
  }
  return (hasMinusSymbol ? '-' : '') + resultValue;
};

export const floatPositiveNumberRegexp = /^(\d+)(\.*)(\d*)$/;

export const authenticatorTokenRegexp = /^[0-9]{6}$/;

export const downloadFileFromBlob = (res: any) => {
  const fileName = res.headers['content-disposition'].replace('attachment; filename=', '').replace(/"/g, '');
  const downloadUrl = window.URL.createObjectURL(res.data);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(downloadUrl);
}

export const useDevice = () => {
  const action = () => {
    let width = window.innerWidth;
    if (width <= 550) return { isMobile: true, isPad: false, isWindow: false };
    if (width <= 950) return { isMobile: false, isPad: true, isWindow: false };
    return { isMobile: false, isPad: false, isWindow: true };
  }
  const [device, setDevice] = useState(action());
  useEffect(() => {
    window.addEventListener('resize', () => {
      setDevice(action());
    });
  }, [])
  return device;
}
