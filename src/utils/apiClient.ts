import axios, { type AxiosRequestConfig } from "axios";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance
const api = axios.create({
  baseURL: VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Generic GET request
export const _get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await api.get<T>(url, config);
  return response.data;
};

// Generic POST request
export const _post = async <T, B = any>(
  url: string,
  body: B,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await api.post<T>(url, body, config);
  return response.data;
};

// Generic PUT request
export const _put = async <T, B = any>(
  url: string,
  body: B,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await api.put<T>(url, body, config);
  return response.data;
};

// Generic DELETE request
export const _delete = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await api.delete<T>(url, config);
  return response.data;
};
