import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";

export interface CarouselItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  buttonText?: string;
  link?: string;
  createdAt?: unknown;
}

export function useCarousel() {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, "carousel"), orderBy("createdAt", "desc")),
      snap => {
        setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as CarouselItem)));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, []);

  return { items, loading };
}
