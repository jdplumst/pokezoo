import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Card from "./Card";
import { Species } from "@prisma/client";

interface IStarter {
  species: Species[];
}

type Starter = "Bulbasaur" | "Charmander" | "Squirtle";

export default function Start({ species }: IStarter) {
  const [open, setOpen] = useState(true);
  const [starter, setStarter] = useState<Starter | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    if (starter) {
      setOpen(false);
    } else if (!starter) {
      setError("Must pick a starter Pokémon");
    }
  };

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black p-4 text-white">
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          className="text-center">
          <strong>Welcome to PokéZoo</strong>
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Please select your starter Pokémon
        </Typography>
        <div className="flex gap-5 pt-4">
          <div
            className={`${
              starter === "Bulbasaur" && `border-2 border-red-500`
            } p-2`}>
            <button onClick={() => setStarter("Bulbasaur")}>
              <Card species={species[0]} />
            </button>
          </div>
          <div
            className={`${
              starter === "Charmander" && `border-2 border-red-500`
            } p-2`}>
            <button onClick={() => setStarter("Charmander")}>
              <Card species={species[3]} />
            </button>
          </div>
          <div
            className={`${
              starter === "Squirtle" && `border-2 border-red-500`
            } p-2`}>
            <button onClick={() => setStarter("Squirtle")}>
              <Card species={species[6]} />
            </button>
          </div>
        </div>
        <div className="flex justify-center pt-4">
          <button
            onClick={() => handleClose()}
            className="rounded-lg border-2 border-black bg-red-500 p-2 font-bold hover:bg-red-600">
            Confirm Selection
          </button>
        </div>
        {error && (
          <div className="flex justify-center pt-4 text-red-500">{error}</div>
        )}
      </Box>
    </Modal>
  );
}
