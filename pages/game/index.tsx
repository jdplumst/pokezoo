import client from "@/prisma/script";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getSession, signOut, useSession } from "next-auth/react";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/"
      }
    };
  }

  const user = session.user;
  const species = await client.species.findMany();
  const instances = await client.speciesInstances.findMany({
    where: { userId: user.id.toString() }
  });

  return {
    props: { user, species, instances }
  };
};

export default function Game({
  user,
  species,
  instances
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      {/* <h1>This is the Game page!</h1>
        <p>Your email is {session.user?.email}</p>
        <img src={`${session.user?.image}`} />
        <p>{session.expires}</p>
        <p>total yield: {session.user?.totalYield}</p>
        <p>total dollars: {session.user?.dollars}</p>
        <button onClick={() => signOut()}>Sign Out</button> */}
      <h1>This is the Game page!</h1>
      <p>Your email is {user.email}</p>
      <p>Your id is {user.id}</p>
      <img src={`${user.image}`} />
      <p>total yield: {user.totalYield}</p>
      <p>total dollars: {user.dollars}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </>
  );
}
