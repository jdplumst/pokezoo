import { isAuthed } from "@/src/server/actions/auth";
import { getShopData } from "@/src/server/actions/shop";
import { Metadata } from "next";
import BallsGrid from "../../_components/BallsGrid";

export const metadata: Metadata = {
  title: "PokéZoo - Shop",
  icons: {
    icon: "/favicon.png",
  },
};

export default async function Shop() {
  const session = await isAuthed();

  const data = await getShopData(session);

  return (
    <div className="p-4">
      <div className="flex flex-col gap-20">
        <BallsGrid balls={data.ballsData} />
      </div>
    </div>
  );
}
