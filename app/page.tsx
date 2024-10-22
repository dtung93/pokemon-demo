"use client";
import React, { useState } from "react";
import PokemonTypes from "./types/PokemonTypes";
import Pokemons from "./pokemon/Pokemons";

export default function Home() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  return (
    <div className="container ">
      <PokemonTypes
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
      />
      <Pokemons selectedTypes={selectedTypes} />
    </div>
  );
}
