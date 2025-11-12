import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useMapStore = create(
  persist(
    (set, get) => ({
      regionCoords: {
        latitude: null,
        longitude: null,
        latitudeDelta: null,
        longitudeDelta: null,
      },

      setRegionCoords: (regionObject) => {
        set((state) => ({
          regionCoords: { ...regionObject },
        }));
      },

      getRegionObject: () => {
        return get().regionCoords;
      },
    }),
    {
      name: "MAP_STORAGE",
      storage: {
        getItem: async (name) => {
          const data = await AsyncStorage.getItem(name);
          return data ? JSON.parse(data) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);
