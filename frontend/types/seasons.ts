export interface Episode {
  id: string;
  number?: number;
  title?: string;
  airDate?: string;
  synopsis?: string;
  artwork?: string;
}

export interface Season {
  id: string;
  name?: string;
  year?: string;
  status?: "upcoming";
  episodes: Episode[];
}
