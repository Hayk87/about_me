import { translationsSeedData } from './translations-seed-data';
import { rightsListData, rightsMapperData } from './rights-mapper-data';
import { rootUserData } from './root-user-data';
import { languagesListData } from './languages-list-data';

export const rootUser = rootUserData;

export const languagesList = languagesListData;

export const translationsSeed = translationsSeedData;

export const rightsMapper = rightsMapperData;

export const rightsList = rightsListData;

export const passwordRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,100}$/;

export const emailRegexp = /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const intPositiveNumberRegexp = /^\d+$/;

export const floatPositiveNumberRegexp = /^(\d+)(\.*)(\d*)$/;

export const authenticatorTokenRegexp = /^[0-9]{6}$/;
