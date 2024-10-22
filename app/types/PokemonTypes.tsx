"use client";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface PokemonType {
  id: number;
  name: string;
}

interface PokemonTypesProps {
  selectedTypes: string[];
  setSelectedTypes: any;
}

const StyledButton = styled.button<{ isSelected: boolean }>`
  background-color: ${(props) => (props.isSelected ? "#bb0707" : "white")};
  color: ${(props) => (props.isSelected ? "white" : "#bb0707")};
  border-radius: 10px;
  border: 2px solid #bb0707;
  padding: 10px;
  margin: 10px 15px;
`;

const PokemonTypes: React.FC<PokemonTypesProps> = ({ selectedTypes, setSelectedTypes }) => {
  const [types, setTypes] = useState<PokemonType[]>([]);

  const handleOnClick = (typeName: string) => {
    setSelectedTypes((prevSelected: any) => {
      if (prevSelected.includes(typeName)) {
        return prevSelected.filter((name: string) => name !== typeName);
      } else {
        return [...prevSelected, typeName];
      }
    });
  };

  useEffect(() => {
    const getPokemonTypes = async () => {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/type");
        const data = await response.json();
        if (data && data.results.length > 0) {
          setTypes(data.results);
        }
      } catch (err) {
        console.error(err);
      }
    };
    getPokemonTypes();
  }, []);

  return (
    <div>
      Types:
      {types.map((type: PokemonType, idx: number) => (
        <StyledButton
          onClick={() => handleOnClick(type.name)}
          key={idx}
          isSelected={selectedTypes.includes(type.name)}
        >
          {type.name}
        </StyledButton>
      ))}
    </div>
  );
};

export default PokemonTypes;
