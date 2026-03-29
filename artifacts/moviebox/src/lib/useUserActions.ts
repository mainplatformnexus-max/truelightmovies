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

export async function downloadContent(url: string, title: string, vjName?: string) {
  if (!url) return;
  const vj = vjName || "VJ EMMA";
  const filename = `${title} ${vj} (www.truelightstudio.biz).mp4`;

  const triggerDownload = (href: string, name: string) => {
    const a = document.createElement("a");
    a.href = href;
    a.download = name;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  try {
    const response = await fetch(url, { mode: "cors" });
    if (response.ok) {
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      triggerDownload(blobUrl, filename);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      return;
    }
  } catch {
  }

  try {
    const backendUrl = `https://download.mainplatform-nexus.workers.dev/?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}&download=1`;
    triggerDownload(backendUrl, filename);
    return;
  } catch {
  }

  window.open(url, "_blank");
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
