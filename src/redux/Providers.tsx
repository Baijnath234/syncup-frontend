"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { useEffect } from "react";
import { hydrateAuth } from "./authSlice";

function Boot() {
  useEffect(() => {
    store.dispatch(hydrateAuth());
  }, []);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <Boot />
      {children}
    </Provider>
  );
}
