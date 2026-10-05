import charactersData from "@/data/characters.json";
import type { Character } from "@/types/characters";
import CharacterCard from "@/components/cards/CharacterCard";

const characters = charactersData as Character[];

const CharactersSection = () => {
  return (
    <section
      id="personajes"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-16 md:px-8"
    >
      <h2 className="text-3xl font-bold text-white">Personajes</h2>
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {characters.map((character, index) => (
          <CharacterCard
            key={character.id}
            character={character}
            ordinal={index + 1}
          />
        ))}
      </div>
    </section>
  );
};

export default CharactersSection;
