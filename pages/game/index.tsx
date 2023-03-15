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
  return {
    props: { session }
  };
};

export default function Game() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <h1>This is the Game page!</h1>
        <p>Your email is {session.user?.email}</p>
        <img src={`${session.user?.image}`} />
        <p>{session.expires}</p>
        <p>total yield: {session.user?.totalYield}</p>
        <p>total dollars: {session.user?.dollars}</p>
        <button onClick={() => signOut()}>Sign Out</button>
      </>
    );
  }
}
