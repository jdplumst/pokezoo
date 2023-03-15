import { getSession } from "next-auth/react";

export const getServerSideProps = async (context: object) => {
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
    </>
  );
}
