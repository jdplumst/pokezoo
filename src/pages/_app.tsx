import "@/src/styles/globals.css";
import type { AppType } from "next/app";
import { SessionProvider } from "next-auth/react";
import { trpc } from "../utils/trpc";
import React from "react";
import { Router } from "next/router";
import Loading from "../components/Loading";
import { type Session } from "next-auth";
import ThemeContextProvider from "../components/ThemeContextProvider";

const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps }
}) => {
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    const start = () => {
      setLoading(true);
    };
    const end = () => {
      setLoading(false);
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <SessionProvider session={session} refetchOnWindowFocus={false}>
          <ThemeContextProvider>
            <Component {...pageProps} />
          </ThemeContextProvider>
        </SessionProvider>
      )}
    </>
  );
};

export default trpc.withTRPC(App);
