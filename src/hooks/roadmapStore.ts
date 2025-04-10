import { create } from "zustand";

interface RoadmapState {
  roadmapData: any | null; // Store full API response
  setRoadmapData: (data: any) => void;
}

export const useRoadmapStore = create<RoadmapState>((set) => ({
  roadmapData: null, // Initially empty
  setRoadmapData: (data) => set({ roadmapData: data }),
}));



