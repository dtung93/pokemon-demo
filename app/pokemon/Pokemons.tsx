"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

interface Pokemon {
  id: number;
  name: string;
  types: string[];
  imageUrl: string;
}

const StyledResultSearch = styled.div`
  font-weight: bold;
  margin: 10px 15px;
`;

const StyledContainer = styled.div`
  display: flex;
  flex-wrap: wrap; /* Allow items to wrap onto the next line */
`;

const StyledPokemonContainer = styled.div`
  width: 12.5%; /* 100% / 8 = 12.5% */
  padding: 5px;
  text-align: center;
`;

const StyledPagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const StyledButton = styled.button`
  margin: 0 10px;
  padding: 10px 15px;
  background-color: #bb0707;
  color: white;
  border-radius: 5px;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const POKEMON_URL = "https://pokeapi.co/api/v2/pokemon?limit=48";

interface PokemonsProps {
  selectedTypes: string[];
}

const Pokemons: React.FC<PokemonsProps> = ({ selectedTypes }) => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [results, setResults] = useState<number>(0);
  const [nextPageUrl, setNextPageUrl] = useState<string>("");
  const [prevPageUrl, setPrevPageUrl] = useState<string>("");

  const getPokemonInitialData = useCallback(async (pokemonUrl: string) => {
    const detailResponse = await fetch(pokemonUrl);
    return detailResponse.json();
  }, []);

  const getPokemons = useCallback(
    async (url: string) => {
      try {
        const response = await fetch(url);
        const pokemonData = await response.json();

        if (pokemonData && pokemonData.results.length > 0) {
          setResults(pokemonData.count);
          setNextPageUrl(pokemonData.next);
          setPrevPageUrl(pokemonData.previous);

          const pokemonDetailsPromises = pokemonData.results.map(
            async (pokemon: any) => {
              const detailData = await getPokemonInitialData(pokemon.url);
              //map pokemon detail to object
              return {
                id: detailData.id,
                name: detailData.name,
                types: detailData.types.map((type: any) => type.type.name),
                imageUrl:
                  detailData.sprites.other["official-artwork"].front_default,
              };
            }
          );

          const detailedPokemons = await Promise.all(pokemonDetailsPromises);
          setPokemons(detailedPokemons);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [getPokemonInitialData]
  );

  useEffect(() => {
    getPokemons(POKEMON_URL);
  }, [getPokemons]);

  // Filter Pokémon based on selected types
  const filteredPokemons = useMemo(() => {
    if (selectedTypes.length === 0) {
      return pokemons;
    }

    return pokemons.filter((pokemon) =>
      pokemon.types.some((type) => selectedTypes.includes(type))
    );
  }, [pokemons, selectedTypes]);

  const handlePrevPage = () => {
    if (prevPageUrl) {
      getPokemons(prevPageUrl);
    }
  };

  const handleNextPage = () => {
    if (nextPageUrl) {
      getPokemons(nextPageUrl);
    }
  };

  return (
    <>
      <StyledResultSearch>
        {filteredPokemons.length} results found
      </StyledResultSearch>
      <StyledContainer className="row">
        {filteredPokemons.map((pokemon) => (
          <StyledPokemonContainer key={pokemon.id} className="col-3">
            <div>
              <img src={pokemon.imageUrl} alt={pokemon.name} />
            </div>
            <h3>{pokemon.name}</h3>
          </StyledPokemonContainer>
        ))}
      </StyledContainer>
      <StyledPagination>
        <StyledButton onClick={handlePrevPage} disabled={!prevPageUrl}>
          Previous
        </StyledButton>
        <StyledButton onClick={handleNextPage} disabled={!nextPageUrl}>
          Next
        </StyledButton>
      </StyledPagination>
    </>
  );
};

export default Pokemons;
