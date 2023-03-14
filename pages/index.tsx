import Head from "next/head";

export default function Home() {
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
      <div className="fade-in absolute flex h-screen w-screen justify-center bg-[url('../img/pokemon-bg.jpg')] bg-cover pt-10 font-bold">
        <h1 className="text-7xl">PokéZoo</h1>
      </div>
    </>
  );
}
