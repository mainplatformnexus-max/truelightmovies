import { useState, useEffect } from "react";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { ContentItem } from "./types";

export function useUserActions(uid: string | undefined, contentId: string | undefined) {
  const [liked, setLiked] = useState(false);
  const [inList, setInList] = useState(false);

  useEffect(() => {
    if (!uid || !contentId) return;
    let cancelled = false;
    const check = async () => {
      const [likeSnap, listSnap] = await Promise.all([
        getDocs(query(collection(db, "likes"), where("uid", "==", uid), where("contentId", "==", contentId))),
        getDocs(query(collection(db, "myList"), where("uid", "==", uid), where("contentId", "==", contentId))),
      ]);
      if (!cancelled) {
        setLiked(!likeSnap.empty);
        setInList(!listSnap.empty);
      }
    };
    check();
    return () => { cancelled = true; };
  }, [uid, contentId]);

  const toggleLike = async (item: ContentItem) => {
    if (!uid) return;
    const id = `${uid}_${item.id}`;
    const ref = doc(db, "likes", id);
    if (liked) {
      await deleteDoc(ref);
      setLiked(false);
    } else {
      await setDoc(ref, {
        uid,
        contentId: item.id,
        title: item.title,
        thumbnail: item.thumbnail,
        type: item.type,
        category: item.category,
        year: item.year,
        createdAt: serverTimestamp(),
      });
      setLiked(true);
    }
  };

  const toggleList = async (item: ContentItem) => {
    if (!uid) return;
    const id = `${uid}_${item.id}`;
    const ref = doc(db, "myList", id);
    if (inList) {
      await deleteDoc(ref);
      setInList(false);
    } else {
      await setDoc(ref, {
        uid,
        contentId: item.id,
        title: item.title,
        thumbnail: item.thumbnail,
        type: item.type,
        category: item.category,
        year: item.year,
        createdAt: serverTimestamp(),
      });
      setInList(true);
    }
  };

  return { liked, inList, toggleLike, toggleList };
}

export async function recordWatchHistory(uid: string, item: ContentItem) {
  if (!uid) return;
  const id = `${uid}_${item.id}`;
  await setDoc(doc(db, "watchHistory", id), {
    uid,
    contentId: item.id,
    title: item.title,
    thumbnail: item.thumbnail,
    type: item.type,
    category: item.category,
    year: item.year,
    watchedAt: serverTimestamp(),
  }, { merge: true });
}

export function downloadContent(url: string, title: string) {
  if (!url) return;
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title}.mp4`;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export async function shareContent(title: string, url?: string) {
  const shareUrl = url || window.location.href;
  const shareData = { title: `Watch "${title}" on True Light Movie`, url: shareUrl };
  try {
    if (navigator.share && navigator.canShare?.(shareData)) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(`${shareData.title}\n${shareUrl}`);
      return "copied";
    }
  } catch {
    try {
      await navigator.clipboard.writeText(`${shareData.title}\n${shareUrl}`);
      return "copied";
    } catch {
      return "error";
    }
  }
  return "shared";
}
