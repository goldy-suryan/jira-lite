'use client';

import axios from 'axios';

export const instance = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

instance.interceptors.response.use((response) => {
  if (response.status == 200) {
    return response.data;
  }
});
