'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { AppStore, makeStore } from './state/store';
import { Provider } from 'react-redux';
import { addUser } from './state/features/user.slice';

export default function StoreProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const storeRef = useRef<AppStore>(null);

  storeRef.current ??= makeStore();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');

    if (savedUser) {
      storeRef.current?.dispatch(addUser(JSON.parse(savedUser)));
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
