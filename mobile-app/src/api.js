import axios from 'axios';
import { API_URL } from './config';

let token = null;
export const setToken = (t) => {
  token = t;
};

const api = axios.create({ baseURL: API_URL, timeout: 10000 });

api.interceptors.request.use((config) => {
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Lấy câu thông báo lỗi dễ hiểu để hiện cho người dùng
export const errMsg = (e) => {
  if (e.response?.data?.message) return e.response.data.message;
  if (e.message === 'Network Error' || e.code === 'ECONNABORTED')
    return 'Không kết nối được server. Kiểm tra backend đang chạy, API_URL và cùng mạng WiFi.';
  return e.message || 'Có lỗi xảy ra';
};

export default api;
