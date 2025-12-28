import { create } from "zustand";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const useMetaStore = create((set, get) => ({
  categories: [],
  tags: [],
  versions: [],
  loaded: false,

  fetchMetaData: async () => {
    if (get.loaded) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/metadata`);
      set({
        categories: res.data.data.categories,
        tags: res.data.data.tags,
        versions: res.data.data.versions,
        loaded: true
      });
    } catch (err) {
      console.error("Failed to fetch metadata:", err);
    }
  }
}));