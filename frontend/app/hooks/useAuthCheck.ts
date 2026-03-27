'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { instance } from '../utils/interceptors';

export const useAuthCheck = () => {
  const router = useRouter();

  useEffect(() => {
    const user = typeof window != 'undefined' ? localStorage.getItem('user') : {};
    if (!user) {
      instance.post('/auth/logout', {}).then(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('filters');
      });
      router.push('/');
    }
  }, [router]);
};
