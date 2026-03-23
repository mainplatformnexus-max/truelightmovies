import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import type { ContentItem, EpisodeItem } from "./types";

export function useContent() {
  const [movies, setMovies] = useState<ContentItem[]>([]);
  const [series, setSeries] = useState<ContentItem[]>([]);
  const [episodes, setEpisodes] = useState<EpisodeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let loaded = 0;
    const checkDone = () => { loaded++; if (loaded >= 3) setLoading(false); };

    const unsub1 = onSnapshot(query(collection(db, "movies"), orderBy("createdAt", "desc")), snap => {
      setMovies(snap.docs.map(d => ({ id: d.id, type: "movie", ...d.data() } as ContentItem)));
      checkDone();
    });

    const unsub2 = onSnapshot(query(collection(db, "series"), orderBy("createdAt", "desc")), snap => {
      setSeries(snap.docs.map(d => ({ id: d.id, type: "series", ...d.data() } as ContentItem)));
      checkDone();
    });

    const unsub3 = onSnapshot(query(collection(db, "episodes"), orderBy("season"), orderBy("episode")), snap => {
      setEpisodes(snap.docs.map(d => ({ id: d.id, ...d.data() } as EpisodeItem)));
      checkDone();
    });

    return () => { unsub1(); unsub2(); unsub3(); };
  }, []);

  const all = [...movies, ...series];
  const popular = all.filter(c => c.popular);

  return { movies, series, episodes, all, popular, loading };
}
