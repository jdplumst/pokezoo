import { type z } from "zod";
import DrowpdownItem from "./DropdownItem";
import {
  type ZodHabitat,
  type ZodRarity,
  type ZodRegion,
  type ZodSpeciesType
} from "../zod";
import {
  HabitatList,
  RaritiesList,
  RegionsList,
  TypesList
} from "../constants";

export interface IDropdowns {
  Caught: boolean;
  Shiny: boolean;
  Region: boolean;
  Rarity: boolean;
  Type: boolean;
  Habitat: boolean;
  [key: string]: boolean;
}

interface IDropdownProps {
  dropdowns: IDropdowns;
  handleDropdowns: (d: string) => void;
  caught?: {
    Caught: boolean;
    Uncaught: boolean;
  };
  shiny: boolean;
  regions: z.infer<typeof ZodRegion>[];
  rarities: z.infer<typeof ZodRarity>[];
  types: z.infer<typeof ZodSpeciesType>[];
  habitats: z.infer<typeof ZodHabitat>[];
  handleCaught?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleShiny: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRegion: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRarity: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleType: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleHabitat: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Dropdown({
  dropdowns,
  handleDropdowns,
  caught,
  shiny,
  regions,
  rarities,
  types,
  habitats,
  handleCaught,
  handleShiny,
  handleRegion,
  handleRarity,
  handleType,
  handleHabitat
}: IDropdownProps) {
  return (
    <div className="flex justify-center gap-5 pt-5">
      {caught && handleCaught && (
        <div className="w-48">
          <button
            onClick={() => handleDropdowns("Caught")}
            className="w-full border-2 border-black bg-red-btn-unfocus p-2 font-bold outline-none">
            Select Caught
          </button>
          {dropdowns.Caught && (
            <ul className="absolute z-10 w-48">
              <li>
                <DrowpdownItem
                  label="Caught"
                  fn={handleCaught}
                  checked={caught.Caught}
                  colour="red"
                />
              </li>
              <li className="border-b-2 border-black">
                <DrowpdownItem
                  label="Uncaught"
                  fn={handleCaught}
                  checked={caught.Uncaught}
                  colour="red"
                />
              </li>
            </ul>
          )}
        </div>
      )}
      <div className="w-48">
        <button
          onClick={() => handleDropdowns("Shiny")}
          className="w-full border-2 border-black bg-purple-btn-unfocus p-2 font-bold outline-none">
          Select Shiny
        </button>
        {dropdowns.Shiny && (
          <ul className="absolute z-10 w-48">
            <li>
              <DrowpdownItem
                label={"Not Shiny"}
                fn={handleShiny}
                checked={!shiny}
                colour="purple"
              />
            </li>
            <li className="border-b-2 border-black">
              <DrowpdownItem
                label="Shiny"
                fn={handleShiny}
                checked={shiny}
                colour="purple"
              />
            </li>
          </ul>
        )}
      </div>
      <div className="w-48">
        <button
          onClick={() => handleDropdowns("Region")}
          className="w-full border-2 border-black bg-green-btn-unfocus p-2 font-bold outline-none"
          data-testid="region-filter"
        >
          Select Region
        </button>
        {dropdowns.Region && (
          <ul className="absolute z-10 w-48">
            <li
              className="border-b-2 border-black"
              data-testid="region-all-filter"
            >
              <DrowpdownItem
                label="Select All"
                fn={handleRegion}
                checked={regions === RegionsList}
                colour={"green"}
              />
            </li>
            {RegionsList.map((r, index) => (
              <li
                key={r}
                className={`${index === RegionsList.length - 1 && `border-b-2`
                  } border-black`}
                data-testid={`region-${r}-filter`}
              >
                <DrowpdownItem
                  label={r}
                  fn={handleRegion}
                  checked={regions.includes(r)}
                  colour={"green"}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="w-48">
        <button
          onClick={() => handleDropdowns("Rarity")}
          className="w-full border-2 border-black bg-orange-btn-unfocus p-2 font-bold outline-none">
          Select Rarity
        </button>
        {dropdowns.Rarity && (
          <ul className="absolute z-10 w-48">
            <li className="border-b-2 border-black">
              <DrowpdownItem
                label="Select All"
                fn={handleRarity}
                checked={rarities === RaritiesList}
                colour="orange"
              />
            </li>
            {RaritiesList.map((r, index) => (
              <li
                key={r}
                className={`${index === RaritiesList.length - 1 && `border-b-2 border-black`
                  }`}>
                <DrowpdownItem
                  label={r}
                  fn={handleRarity}
                  checked={rarities.includes(r)}
                  colour="orange"
                />
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="w-48">
        <button
          onClick={() => handleDropdowns("Type")}
          className="w-full border-2 border-black bg-blue-btn-unfocus p-2 font-bold outline-none">
          Select Type
        </button>
        {dropdowns.Type && (
          <ul className="absolute z-10 w-48">
            <li className="border-b-2 border-black">
              <DrowpdownItem
                label="Select All"
                fn={handleType}
                checked={types === TypesList}
                colour="blue"
              />
            </li>
            {TypesList.map((t, index) => (
              <li
                key={t}
                className={`${index === TypesList.length - 1 && `border-b-2 border-black`
                  }`}>
                <DrowpdownItem
                  label={t}
                  fn={handleType}
                  checked={types.includes(t)}
                  colour="blue"
                />
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="w-48">
        <button
          onClick={() => handleDropdowns("Habitat")}
          className="w-full border-2 border-black bg-lime-btn-unfocus p-2 font-bold outline-none">
          Select Habitat
        </button>
        {dropdowns.Habitat && (
          <ul className="absolute z-10 w-48">
            <li className="border-b-2 border-black">
              <DrowpdownItem
                label="Select All"
                fn={handleHabitat}
                checked={habitats === HabitatList}
                colour="lime"
              />
            </li>
            {HabitatList.map((h, index) => (
              <li
                key={h}
                className={`${index === HabitatList.length - 10 && `border-b-2 border-black`
                  }`}>
                <DrowpdownItem
                  label={h}
                  fn={handleHabitat}
                  checked={habitats.includes(h)}
                  colour="lime"
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
