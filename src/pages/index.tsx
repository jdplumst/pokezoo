import { GetServerSidePropsContext } from "next";
import { signIn } from "next-auth/react";
import Head from "next/head";
import { AiOutlineGithub } from "react-icons/ai";
import { FaTwitch } from "react-icons/fa";
import { BsGoogle } from "react-icons/bs";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions);
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
      <main className="fade-in absolute flex h-screen w-screen flex-col items-center bg-[url('../img/pokemon-bg.jpg')] bg-cover pt-10 font-bold">
        <h1 className="mb-20 text-7xl">PokéZoo</h1>
        <div className="w-1/3 rounded-lg border-4 border-black bg-white py-5 text-center">
          <p>
            <strong className="text-2xl">Login</strong>
          </p>
          <button
            onClick={() => signIn("github")}
            className="mt-5 h-10 w-2/3 rounded-lg border-2 border-black bg-green-500">
            <span className="flex items-center justify-center gap-2">
              Sign in with GitHub
              <AiOutlineGithub />
            </span>
          </button>
          <button
            onClick={() => signIn("twitch")}
            className="mt-5 h-10 w-2/3 rounded-lg border-2 border-black  bg-purple-500">
            <span className="flex items-center justify-center gap-2">
              Sign in with Twitch
              <FaTwitch />
            </span>
          </button>
          <button
            onClick={() => signIn("google")}
            className="mt-5 h-10 w-2/3 rounded-lg border-2 border-black bg-orange-500">
            <span className="flex items-center justify-center gap-2">
              Sign in with Google
              <BsGoogle />
            </span>
          </button>
        </div>
      </main>
    </>
  );
}
