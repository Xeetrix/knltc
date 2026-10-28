"use client";

import { useEffect, useState } from "react";
import {
  fetchLiveStoreFromServer,
  getCmsStore,
  getWebsiteCms,
  type MasterKnlTcStore,
  type WebsiteCmsContent,
} from "@/lib/knltc-cms-store";

export function useKnlTcCms() {
  const [cms, setCms] = useState<WebsiteCmsContent>(() => getWebsiteCms());
  const [store, setStore] = useState<MasterKnlTcStore>(() => getCmsStore());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const syncLocal = () => {
      const latestStore = getCmsStore();
      setStore(latestStore);
      if (latestStore.websiteCms?.[0]) {
        setCms(latestStore.websiteCms[0]);
      }
    };

    syncLocal();
    setHydrated(true);

    // Fetch live updates from server snapshot/Supabase once on mount
    fetchLiveStoreFromServer().then((serverStore) => {
      if (serverStore) {
        setStore(serverStore);
        if (serverStore.websiteCms?.[0]) {
          setCms(serverStore.websiteCms[0]);
        }
      }
    });

    const handleCustomUpdate = () => syncLocal();
    const handleStorage = (e: StorageEvent) => {
      if (!e.key || e.key.includes("knltc")) {
        syncLocal();
      }
    };

    window.addEventListener("knltc-cms-updated", handleCustomUpdate);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("knltc-cms-updated", handleCustomUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return { cms, store, hydrated };
}
