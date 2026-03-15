import axios from 'axios';
import toast from 'react-hot-toast';

export const instance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/proxy`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error.message ||
      'Something went wrong';

    toast.error(message);

    return Promise.reject(error);
  },
);
