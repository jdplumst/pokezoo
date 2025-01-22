import { isAuthed } from "@/src/server/actions/auth";
import { getShopData } from "@/src/server/actions/shop";
import { Metadata } from "next";
import BallsGrid from "../../_components/BallsGrid";
import CharmsGrid from "../../_components/CharmsGrid";
import ShopGrid from "../../_components/ShopGrid";
import { Separator } from "@/src/components/ui/separator";
import WildcardsGrid from "../../_components/WildcardsGrid";

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
    <div className="px-8 pb-8">
      <h1 className="py-4 text-5xl font-bold">Shop</h1>
      <Separator className="mb-4" />
      <div className="flex flex-col gap-20">
        <ShopGrid>
          <BallsGrid balls={data.ballsData} />
        </ShopGrid>
        <ShopGrid>
          <CharmsGrid
            charms={data.charmsData}
            userCharms={data.userCharmsData}
          />
        </ShopGrid>
        <ShopGrid>
          <WildcardsGrid />
        </ShopGrid>
      </div>
    </div>
  );
}
