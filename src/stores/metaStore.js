import { create } from "zustand";
import axios from "axios";
import i18n from "../i18n";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const useMetaStore = create((set, get) => ({
  categories: [],
  tags: [],
  versions: [],
  loaded: false,

  fetchMetaData: async (lang = i18n.language) => {
    if (get.loaded) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/metadata`, {
        params: { lang }
      });
      set({
        categories: res.data.data.categories,
        tags: res.data.data.tags,
        versions: res.data.data.versions,
        loaded: true
      });
    } catch (err) {
      console.error("Failed to fetch metadata:", err);
    }
  },

  clearMetaData: () => set({
    categories: [],
    tags: [],
    versions: [],
    loaded: false
  })
}));

i18n.on("languageChanged", (lng) => {
  const store = useMetaStore.getState();
  store.clearMetaData();
  store.fetchMetaData();
});