import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTripStore = create(
  persist(
    (set, get) => ({
      trips: [], // <-- ARRAY (NOT OBJECT)

      addTrip: (tripObject) => {
        set((state) => ({
          trips: [...state.trips, tripObject], // push new trip to array
        }));
      },

      getTripById: (id) => {
        return get().trips.find((t) => t.id === id) || null;
      },

      clearTrips: () => set({ trips: [] }),
      resetStoreAndStorage: async () => {
        set({ trips: [] });
        await AsyncStorage.removeItem("TRIP_STORAGE"); // ✅ clear persisted data
      },
    }),
    {
      name: "TRIP_STORAGE",
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
