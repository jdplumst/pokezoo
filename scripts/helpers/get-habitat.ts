export function getHabitat(
  pokedexNumber: number,
  grassland: number[],
  forest: number[],
  watersEdge: number[],
  sea: number[],
  cave: number[],
  mountain: number[],
  roughTerrain: number[],
  urban: number[],
  rare: number[],
) {
  if (grassland.includes(pokedexNumber)) return 1;
  if (forest.includes(pokedexNumber)) return 2;
  if (watersEdge.includes(pokedexNumber)) return 3;
  if (sea.includes(pokedexNumber)) return 4;
  if (cave.includes(pokedexNumber)) return 5;
  if (mountain.includes(pokedexNumber)) return 6;
  if (roughTerrain.includes(pokedexNumber)) return 7;
  if (urban.includes(pokedexNumber)) return 8;
  if (rare.includes(pokedexNumber)) return 9;
  return 0;
}
