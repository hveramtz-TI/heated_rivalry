export interface ImageRef {
  src: string;
  alt: string;
}

export type CharacterAccent = "rivalryRed" | "electricBlue" | "neutral";

export interface Character {
  id: string;
  name?: string;
  bio?: string;
  portrait?: string;
  cardArt?: string;
  accent?: CharacterAccent;
  shields?: ImageRef[];
}
