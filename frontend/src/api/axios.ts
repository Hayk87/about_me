import axios from "axios";
import { store } from "../store";
import { initProfile } from "../store/slices/profile";
import { token_key, tokenStorage } from "../utils";

const apiController = new AbortController();
const api = axios.create();

api.interceptors.request.use(
    (config) => {
      const token = tokenStorage.getItem(token_key);
      config.signal = apiController.signal;
      if (token) {
        config.headers['x-auth-token'] = token;
      }
      return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        store.dispatch(initProfile({}));
        return Promise.reject(error);
      }
      return Promise.reject(error);
    }
);

export default api;
