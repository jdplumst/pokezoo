import { GetServerSidePropsContext } from "next";
import { getSession, signIn } from "next-auth/react";
import Head from "next/head";
import { GoMarkGithub } from "react-icons/go";
import { FaTwitch } from "react-icons/fa";
import { BsGoogle } from "react-icons/bs";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        destination: "/game"
      }
    };
  }
  return {
    props: { session }
  };
};

export default function Home() {
  return (
    <>
      <Head>
        <title>PokéZoo</title>
        <meta name="description" content="PokéZoo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="fade-out absolute z-10 flex min-h-screen w-screen items-center justify-center bg-black text-center text-slate-500">
        <div
          className="absolute h-52 w-52 rounded-full
                      ring before:absolute before:left-0 before:top-0 before:h-full before:w-full before:rounded-full
                      before:shadow-[0_0_5px_5px_rgba(255,255,255,0.3)]"></div>
        <span className="change-text uppercase"></span>
      </div>
      <div className="fade-in absolute flex h-screen w-screen flex-col items-center bg-[url('../img/pokemon-bg.jpg')] bg-cover pt-10 font-bold">
        <h1 className="mb-20 text-7xl">PokéZoo</h1>
        <div className="w-1/3 rounded-lg border-4 border-black bg-white py-5 text-center">
          <p>
            <strong className="text-2xl">Login</strong>
          </p>
          <button
            onClick={() => signIn("github")}
            className="mt-5 h-10 w-2/3 rounded-lg border-2 border-black bg-green-500">
            <div className="flex items-center justify-center gap-2">
              Sign in with GitHub
              <GoMarkGithub />
            </div>
          </button>
          <button
            onClick={() => signIn("twitch")}
            className="mt-5 h-10 w-2/3 rounded-lg border-2 border-black  bg-purple-500">
            <div className="flex items-center justify-center gap-2">
              Sign in with Twitch
              <FaTwitch />
            </div>
          </button>
          <button
            onClick={() => signIn("google")}
            className="mt-5 h-10 w-2/3 rounded-lg border-2 border-black bg-orange-500">
            <div className="flex items-center justify-center gap-2">
              Sign in with Google
              <BsGoogle />
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
