import { GetServerSidePropsContext } from "next";
import { getSession, signIn } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import { GoMarkGithub } from "react-icons/go";
import { FcGoogle } from "react-icons/fc";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <>
      <Head>
        <title>PokéZoo</title>
        <meta name="description" content="PokéZoo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
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
        <div className="h-2/3 w-1/3 rounded-lg border-4 border-black bg-white pt-5 text-center">
          <p>
            <strong className="text-2xl">Login</strong>
          </p>
          <form onSubmit={handleLogin}>
            <input
              placeholder="Email"
              onChange={handleEmail}
              value={email}
              className="mt-10 w-2/3 rounded-lg border-2 border-slate-300 p-2 text-slate-500 focus:text-black focus:outline-none"
            />
            <input
              placeholder="Password"
              onChange={handlePassword}
              value={password}
              className="mt-5 w-2/3 rounded-lg border-2 border-slate-300 p-2 text-slate-500 focus:text-black focus:outline-none"
            />
            <br></br>
            <button
              type="submit"
              className="mt-5 h-10 w-2/3 rounded-lg bg-blue-500 text-white">
              Login
            </button>
          </form>
          <button
            onClick={() => signIn("github")}
            className="mt-5 h-10 w-2/3 rounded-lg border-2 border-black">
            <div className="flex items-center justify-center gap-2">
              Sign in with GitHub
              <GoMarkGithub />
            </div>
          </button>
          <button
            onClick={() => signIn("google")}
            className="mt-5 h-10 w-2/3 rounded-lg border-2 border-black">
            <div className="flex items-center justify-center gap-2">
              Sign in with Google
              <FcGoogle />
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
