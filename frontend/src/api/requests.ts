import axios from 'axios';
import api from './axios';
import {
  LoginInterface,
  ProductsCategoriesSearchInterface,
  ProductsSearchInterface,
  TranslationSearchInterface,
  ReportDetailsType,
  ReportTotalType
} from "../interfaces";

export const getLanguages = () => axios.get('/api/languages');

export const getCurrentTranslates = (lang: string) => axios.get('/api/translates/current', { params: { lang } });

export const getAuthInfo = () => api.get('/api/auth/info');

export const loginToSystem = (data: LoginInterface) => axios.post('/api/auth/login', data);

export const logoutFromSystem = () => api.put('/api/auth/logout');

export const getTranslationList = (params: TranslationSearchInterface) => api.get('/api/translates', { params });

export const createTranslate = (data: any) => api.post('/api/translates', data);

export const getTranslationById = (id: string) => api.get(`/api/translates/${id}`);

export const updateTranslate = (id: string, data: any) => api.put(`/api/translates/${id}`, data);

export const deleteTranslate = (id: string) => api.delete(`/api/translates/${id}`);

export const getOfferList = (params: any) => api.get('/api/offer', { params });

export const getOfferById = (id: string) => api.get(`/api/offer/${id}`);

export const getOfferFileById = (id: string) => api.get(`/api/files/details/${id}`, { responseType: 'blob' });

export const getProductsCategoriesList = (params: ProductsCategoriesSearchInterface) => api.get('/api/product-categories', { params });

export const createProductsCategories = (data: any) => api.post('/api/product-categories', data);

export const getProductsCategoryById = (id: string) => api.get(`/api/product-categories/${id}`);

export const updateProductsCategories = (id: string, data: any) => api.put(`/api/product-categories/${id}`, data);

export const deleteProductsCategory = (id: string) => api.delete(`/api/product-categories/${id}`);

export const getProductsList = (params: ProductsSearchInterface) => api.get('/api/products', { params });

export const createProduct = (data: any) => api.post('/api/products', data);

export const getProductById = (id: string) => api.get(`/api/products/${id}`);

export const updateProduct = (id: string, data: any) => api.put(`/api/products/${id}`, data);

export const deleteProduct = (id: string) => api.delete(`/api/products/${id}`);

export const getAllRights = () => api.get('/api/rights');

export const getStaffsList = (params: any) => api.get('/api/staffs', { params });

export const createStaff = (data: any) => api.post('/api/staffs', data);

export const getStaffById = (id: string) => api.get(`/api/staffs/${id}`);

export const updateStaff = (id: string, data: any) => api.put(`/api/staffs/${id}`, data);

export const deleteStaff = (id: string) => api.delete(`/api/staffs/${id}`);

export const getSystemUsersList = (params: any) => api.get('/api/system-user', { params });

export const createSystemUser = (data: any) => api.post('/api/system-user', data);

export const getSystemUserById = (id: string) => api.get(`/api/system-user/${id}`);

export const updateSystemUser = (id: string, data: any) => api.put(`/api/system-user/${id}`, data);

export const deleteSystemUser = (id: string) => api.delete(`/api/system-user/${id}`);

export const blockSystemUser = (id: string) => api.put(`/api/system-user/${id}/block`);

export const toggleEnableAuthenticator = (enable: boolean) => api.post('/api/system-user/generate-authenticator', { enable });

export const changeSystemUserPassword = (data: { current_password: string, new_password: string }) => api.put(`/api/system-user/change-password`, data);

export const sendOfferToAdmin = (data: any) => api.post(`/api/offer`, data, { headers: { 'Content-Type': 'multipart/form-data' } });

