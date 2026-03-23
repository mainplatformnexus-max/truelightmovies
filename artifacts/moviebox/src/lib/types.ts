export interface ContentItem {
  id: string;
  title: string;
  type: "movie" | "series";
  thumbnail: string;
  url: string;
  category: string;
  year: number;
  views: number;
  popular: boolean;
  vjName: string;
  seasons?: number;
  episodes?: number;
}

export interface EpisodeItem {
  id: string;
  seriesId: string;
  title: string;
  season: number;
  episode: number;
  url: string;
  duration: string;
}
