import {
  HabitatList,
  RaritiesList,
  RegionsList,
  TypesList,
} from "@/src/constants";
import { auth } from "@/src/server/auth";
import { db } from "@/src/server/db";
import {
  habitats,
  instances,
  rarities,
  regions,
  species,
  types,
} from "@/src/server/db/schema";
import {
  ZodHabitat,
  ZodRarity,
  ZodRegion,
  ZodSort,
  ZodSpeciesType,
} from "@/src/zod";
import { and, asc, desc, eq, inArray, notInArray, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { z } from "zod";

export async function POST(req: Request) {
  const bodySchema = z.object({
    limit: z.number().min(1).max(100).nullish(),
    cursor: z
      .object({
        modifyDate: z.string().nullish(),
        name: z.string().nullish(),
        pokedexNumber: z.number().nullish(),
        rarity: z.string().nullish(),
      })
      .nullish(),
    order: ZodSort,
    shiny: z.boolean(),
    regions: z.array(ZodRegion),
    rarities: z.array(ZodRarity),
    types: z.array(ZodSpeciesType),
    habitats: z.array(ZodHabitat),
  });

  const body = bodySchema.safeParse(await req.json());

  if (body.error) {
    return Response.json({
      error: "Something went wrong. Please try again.",
    });
  }

  const session = await auth();
  if (!session) {
    return Response.json({
      error: "You are not authorized to fetch this data.",
    });
  }

  if (body.data.cursor?.name?.includes(" ")) {
    return Response.json({ error: "Something went wrong. Please try again." });
  }

  let rarityCursor;
  switch (body.data.cursor?.rarity) {
    case "Common":
      rarityCursor = 1;
      break;
    case "Rare":
      rarityCursor = 2;
      break;
    case "Epic":
      rarityCursor = 3;
      break;
    case "Legendary":
      rarityCursor = 4;
      break;
  }

  const limit = body.data.limit ?? 50;

  const typeOne = alias(types, "typeOne");
  const typeTwo = alias(types, "typeTwo");

  const instancesData = await db
    .select({
      id: species.id,
      pokedexNumber: species.pokedexNumber,
      name: species.name,
      rarity: rarities.name,
      yield: species.yield,
      img: species.img,
      sellPrice: species.sellPrice,
      shiny: species.shiny,
      typeOne: typeOne.name,
      typeTwo: typeTwo.name,
      generation: species.generation,
      habitat: habitats.name,
      region: regions.name,
      instance: instances,
    })
    .from(instances)
    .innerJoin(species, eq(instances.speciesId, species.id))
    .innerJoin(regions, eq(species.regionId, regions.id))
    .innerJoin(rarities, eq(species.rarityId, rarities.id))
    .innerJoin(typeOne, eq(species.typeOneId, typeOne.id))
    .leftJoin(typeTwo, eq(species.typeTwoId, typeTwo.id))
    .innerJoin(habitats, eq(species.habitatId, habitats.id))
    .where(
      and(
        eq(instances.userId, session.user.id),
        eq(species.shiny, body.data.shiny),
        body.data.regions.length > 0
          ? inArray(regions.name, body.data.regions)
          : notInArray(regions.name, RegionsList),
        body.data.rarities.length > 0
          ? inArray(rarities.name, body.data.rarities)
          : notInArray(rarities.name, RaritiesList),
        body.data.types.length > 0
          ? or(
              inArray(typeOne.name, body.data.types),
              inArray(typeTwo.name, body.data.types),
            )
          : notInArray(typeOne.name, TypesList),
        body.data.habitats.length > 0
          ? inArray(habitats.name, body.data.habitats)
          : notInArray(habitats.name, HabitatList),
        body.data.order === "Oldest"
          ? sql`${instances.modifyDate} >= ${
              body.data.cursor?.modifyDate ??
              new Date("2020-12-03 17:20:11.049").toISOString()
            }`
          : body.data.order === "Newest"
            ? sql`${instances.modifyDate} <= ${
                body.data.cursor?.modifyDate ??
                new Date("2050-12-03 17:20:11.049").toISOString()
              }`
            : body.data.order === "Pokedex"
              ? sql`(${species.pokedexNumber}, ${rarities.id} ,${species.name}, ${
                  instances.modifyDate
                }) >= (${body.data.cursor?.pokedexNumber ?? 0}, ${rarityCursor ?? 0}, ${
                  body.data.cursor?.name ?? ""
                }, ${
                  body.data.cursor?.modifyDate ??
                  new Date("2020-12-03 17:20:11.049").toISOString()
                })`
              : body.data.order === "PokedexDesc"
                ? sql`(${species.pokedexNumber}, ${rarities.id}, ${species.name}, ${
                    instances.modifyDate
                  }) <= (${body.data.cursor?.pokedexNumber ?? 10000}, ${rarityCursor ?? 10}, ${
                    body.data.cursor?.name ?? "{"
                  }, ${
                    body.data.cursor?.modifyDate ??
                    new Date("2050-12-03 17:20:11.049").toISOString()
                  })`
                : body.data.order === "Rarity"
                  ? sql`(${rarities.id}, ${species.pokedexNumber}, ${
                      species.name
                    }, ${instances.modifyDate}) >= (${rarityCursor ?? 0}, ${
                      body.data.cursor?.pokedexNumber ?? 0
                    }, ${body.data.cursor?.name ?? ""}, ${
                      body.data.cursor?.modifyDate ??
                      new Date("2020-12-03 17:20:11.049").toISOString()
                    })`
                  : body.data.order === "RarityDesc"
                    ? sql`(${rarities.id}, ${species.pokedexNumber}, ${
                        species.name
                      }, ${instances.modifyDate}) <= (${rarityCursor ?? 10}, ${
                        body.data.cursor?.pokedexNumber ?? 10000
                      }, ${body.data.cursor?.name ?? "{"}, ${
                        body.data.cursor?.modifyDate ??
                        new Date("2050-12-03 17:20:11.049").toISOString()
                      })`
                    : undefined,
      ),
    )
    .orderBy(
      body.data.order === "Oldest"
        ? asc(instances.modifyDate)
        : body.data.order === "Newest"
          ? desc(instances.modifyDate)
          : body.data.order === "Pokedex"
            ? sql`${species.pokedexNumber} asc, ${rarities.id} asc, ${species.name} asc, ${instances.modifyDate} asc`
            : body.data.order === "PokedexDesc"
              ? sql`${species.pokedexNumber} desc, ${rarities.id} desc, ${species.name} desc, ${instances.modifyDate} desc`
              : body.data.order === "Rarity"
                ? sql`${rarities.id} asc, ${species.pokedexNumber} asc, ${species.name} asc, ${instances.modifyDate} asc`
                : body.data.order === "RarityDesc"
                  ? sql`${rarities.id} desc, ${species.pokedexNumber} desc, ${species.name} desc, ${instances.modifyDate} desc`
                  : asc(instances.modifyDate),
    )
    .limit(limit + 1);

  let nextCursor: typeof body.data.cursor | undefined = undefined;
  if (instancesData.length > limit) {
    const nextItem = instancesData.pop()!;
    nextCursor =
      body.data.order === "Oldest" || body.data.order === "Newest"
        ? {
            modifyDate: nextItem.instance.modifyDate.toISOString(),
            name: null,
            pokedexNumber: null,
            rarity: null,
          }
        : {
            modifyDate: nextItem.instance.modifyDate.toISOString(),
            name: nextItem.name,
            pokedexNumber: nextItem.pokedexNumber,
            rarity: nextItem.rarity,
          };
  }

  return Response.json({ instancesData, nextCursor });
}
