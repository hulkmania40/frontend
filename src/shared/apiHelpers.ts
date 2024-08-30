// src/utils/apiHelpers.ts
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// Base URL for API requests (adjust according to your API base URL)
const BASE_URL = 'http://localhost:8000';

// Create an Axios instance with default settings
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function for GET requests
export const _get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.get<T>(url, config);
    return response.data;
  } catch (error) {
    console.error('GET request failed:', error);
    throw error; // Re-throw the error to be handled by the caller if needed
  }
};

// Helper function for POST requests
export const _post = async <T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.post<T>(url, data, config);
    return response.data;
  } catch (error) {
    console.error('POST request failed:', error);
    throw error;
  }
};

// Helper function for PUT requests
export const _put = async <T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.put<T>(url, data, config);
    return response.data;
  } catch (error) {
    console.error('PUT request failed:', error);
    throw error;
  }
};

// Helper function for DELETE requests
export const _delete = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.delete<T>(url, config);
    return response.data;
  } catch (error) {
    console.error('DELETE request failed:', error);
    throw error;
  }
};
