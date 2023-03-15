import { GetServerSidePropsContext } from "next";
import { getSession, signOut } from "next-auth/react";

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
  return (
    <>
      <h1>This is the Game page!</h1>
      <button onClick={() => signOut()}>Sign Out</button>
    </>
  );
}
