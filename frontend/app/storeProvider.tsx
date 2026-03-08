'use client';

import { ReactNode, useRef } from 'react';
import { AppStore, makeStore } from './state/store';
import { Provider } from 'react-redux';

export default function StoreProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const storeRef = useRef<AppStore>(null);

  storeRef.current ??= makeStore();
  return <Provider store={storeRef.current}>{children}</Provider>;
}
