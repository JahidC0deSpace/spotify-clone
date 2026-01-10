import { axiosInstance } from "@/lib/axios";
import type { Album, Song, Stats } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";

interface MusicStore {
  songs: Song[];
  albums: Album[];
  isLoading: boolean;
  error: string | null;
  currentAlbum: Album | null;
  featuredSongs: Song[];
  madeForYouSongs: Song[];
  trendingSongs: Song[];
  stats: Stats;

  fetchAlbums: () => Promise<void>;
  fetchAlbumById: (id: string) => Promise<void>;
  fetchFeaturedSongs: () => Promise<void>;
  fetchMadeForYouSongs: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchSongs: () => Promise<void>;
  deleteSong: (id: string) => Promise<void>;
  deleteAlbum: (id: string) => Promise<void>;
  addSong: (formData: FormData) => Promise<void>;
  addAlbum: (formData: FormData) => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set, get) => ({
  albums: [],
  songs: [],
  isLoading: false,
  error: null,
  currentAlbum: null,
  madeForYouSongs: [],
  trendingSongs: [],
  featuredSongs: [],
  stats: {
    totalSongs: 0,
    totalAlbums: 0,
    totalArtists: 0,
    totalUsers: 0,
  },

  fetchAlbums: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/albums");

      set({ albums: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs");
      set({ songs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/stats");
      set({ stats: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchAlbumById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/albums/${id}`);
      set({ currentAlbum: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchFeaturedSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/featured");
      set({ featuredSongs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMadeForYouSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/made-for-you");
      set({ madeForYouSongs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTrendingSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/trending");
      set({ trendingSongs: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
  deleteSong: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/songs/${id}`);
      const updatedSongs = get().songs.filter((song) => song._id !== id);
      set({
        songs: updatedSongs,
        stats: {
          ...get().stats,
          totalSongs: get().stats.totalSongs - 1,
        },
      });
      toast.success("Song deleted successfully");
    } catch (error: any) {
      set({ error: error.response.data.message });
      toast.error("Failed to delete song");
    } finally {
      set({ isLoading: false });
    }
  },
  deleteAlbum: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/albums/${id}`);
      const updatedAlbums = get().albums.filter((album) => album._id !== id);
      const updatedSongs = get().songs.filter((song) => song.albumId !== id);

      set({
        albums: updatedAlbums,
        songs: updatedSongs,
        stats: {
          ...get().stats,
          totalAlbums: get().stats.totalAlbums - 1,
          totalSongs:
            get().stats.totalSongs - (get().songs.length - updatedSongs.length),
        },
      });
      toast.success("Album deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete album");
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
  addSong: async (formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post("/admin/songs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await get().fetchSongs();
      await get().fetchStats();

      toast.success("Song added successfully!");
    } catch (error: any) {
      set({ error: error.response.data.message });
      toast.error("Failed to add song. Please try again.");
    } finally {
      set({ isLoading: false });
    }
  },
  addAlbum: async (formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post("/admin/albums", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await get().fetchAlbums();
      await get().fetchStats();

      toast.success("Album added successfully!");
    } catch (error: any) {
      set({ error: error.response.data.message });
      toast.error("Failed to add album. Please try again.");
    } finally {
      set({ isLoading: false });
    }
  },
}));
