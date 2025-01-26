import {
  HabitatList,
  RaritiesList,
  RegionsList,
  TypesList,
} from "@/src/constants";
import { authOptions } from "@/src/pages/api/auth/[...nextauth]";
import { db } from "@/src/server/db";
import {
  habitats,
  instances,
  rarities,
  regions,
  species,
  types,
} from "@/src/server/db/schema";
import { ZodHabitat, ZodRarity, ZodRegion, ZodSpeciesType } from "@/src/zod";
import {
  and,
  asc,
  eq,
  inArray,
  isNotNull,
  isNull,
  notInArray,
  or,
  sql,
} from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  const bodySchema = z.object({
    limit: z.number().min(1).max(100).nullish(),
    cursor: z
      .object({
        pokedexNumber: z.number().nullish(),
        name: z.string().nullish(),
      })
      .nullish(),
    caught: z.object({ Caught: z.boolean(), Uncaught: z.boolean() }),
    shiny: z.boolean(),
    regions: z.array(ZodRegion),
    rarities: z.array(ZodRarity),
    types: z.array(ZodSpeciesType),
    habitats: z.array(ZodHabitat),
  });

  const bodyData = await req.json();
  const body = bodySchema.safeParse(bodyData);

  if (body.error) {
    return Response.json({
      error: "Something went wrong. Please try again.",
    });
  }

  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({
      error: "You are not authorized to fetch this data.",
    });
  }
  const limit = body.data.limit ?? 50;

  const i = db
    .selectDistinct({ speciesId: instances.speciesId })
    .from(instances)
    .where(eq(instances.userId, session.user.id))
    .as("i");

  const typeOne = alias(types, "typeOne");
  const typeTwo = alias(types, "typeTwo");

  const pokemon = await db
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
      instance: i.speciesId,
    })
    .from(species)
    .leftJoin(i, eq(species.id, i.speciesId))
    .innerJoin(regions, eq(species.regionId, regions.id))
    .innerJoin(rarities, eq(species.rarityId, rarities.id))
    .innerJoin(typeOne, eq(species.typeOneId, typeOne.id))
    .leftJoin(typeTwo, eq(species.typeTwoId, typeTwo.id))
    .innerJoin(habitats, eq(species.habitatId, habitats.id))
    .where(
      and(
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
        body.data.caught.Caught && !body.data.caught.Uncaught
          ? isNotNull(i.speciesId)
          : !body.data.caught.Caught && body.data.caught.Uncaught
            ? isNull(i.speciesId)
            : undefined,
        sql`(${species.pokedexNumber}, ${species.name}) >= (${
          body.data.cursor?.pokedexNumber ?? 0
        }, ${body.data.cursor?.name ?? ""})`,
      ),
    )
    .limit(limit + 1)
    .orderBy(asc(species.pokedexNumber), asc(rarities.id), asc(species.name));

  let nextCursor: typeof body.data.cursor | undefined = undefined;
  if (pokemon.length > limit) {
    const nextItem = pokemon.pop()!;
    nextCursor = {
      pokedexNumber: nextItem?.pokedexNumber,
      name: nextItem?.name,
    };
  }

  return Response.json({ pokemon, nextCursor });
}
