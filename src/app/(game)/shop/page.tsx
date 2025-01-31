import { getShopData } from "@/server/actions/shop";
import { type Metadata } from "next";
import BallsGrid from "@/components/BallsGrid";
import CharmsGrid from "@/components/CharmsGrid";
import ShopGrid from "@/components/ShopGrid";
import { Separator } from "@/components/ui/separator";
import WildcardsGrid from "@/components/WildcardsGrid";

export const metadata: Metadata = {
  title: "PokéZoo - Shop",
  icons: {
    icon: "/favicon.png",
  },
};

export default async function Shop() {
  const data = await getShopData();

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
