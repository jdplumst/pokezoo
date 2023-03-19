import Navbar from "@/components/Navbar";
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
  console.log(session);
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
    <div className="min-h-screen bg-gradient-to-r from-cyan-500 to-indigo-500">
      <Navbar />
      <div className="p-4">
        <p>Your current balance is {user.dollars} Pokemon dollars.</p>
        <p>
          You will receive {user.totalYield} Pokemon dollars on the next payout.
        </p>
        <div className="cards grid gap-5 pt-5">
          <div className="h-60 border-2"></div>
          <div className="h-60 border-2"></div>
          <div className="h-60 border-2"></div>
          <div className="h-60 border-2"></div>
          <div className="h-60 border-2"></div>
          <div className="h-60 border-2"></div>
          <div className="h-60 border-2"></div>
          <div className="h-60 border-2"></div>
          <div className="h-60 border-2"></div>
          <div className="h-60 border-2"></div>
          <div className="h-60 border-2"></div>
          <div className="h-60 border-2"></div>
          <div className="h-60 border-2"></div>
        </div>
      </div>
    </div>
  );
}
