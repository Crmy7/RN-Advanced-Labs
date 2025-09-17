import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Robot, RobotInput } from '../validation/robotSchema';

interface RobotsState {
  robots: Robot[];
  selectedId?: string;
}

interface RobotsActions {
  // CRUD Operations
  create: (robotInput: RobotInput) => Promise<{ success: boolean; error?: string; robot?: Robot }>;
  update: (id: string, robotInput: RobotInput) => Promise<{ success: boolean; error?: string; robot?: Robot }>;
  remove: (id: string) => boolean;
  getById: (id: string) => Robot | undefined;
  
  // Selection
  setSelectedId: (id?: string) => void;
  
  // Utility
  isNameUnique: (name: string, excludeId?: string) => boolean;
  getRobotsSorted: () => Robot[];
}

type RobotsStore = RobotsState & RobotsActions;

/**
 * Generate a simple UUID v4
 */
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const useRobotsStore = create<RobotsStore>()(
  persist(
    (set, get) => ({
      // Initial State
      robots: [],
      selectedId: undefined,

      // CRUD Operations
      create: async (robotInput: RobotInput) => {
        const state = get();
        
        // Check name uniqueness
        if (!state.isNameUnique(robotInput.name)) {
          return {
            success: false,
            error: `Un robot avec le nom "${robotInput.name}" existe déjà`,
          };
        }

        const now = new Date();
        const newRobot: Robot = {
          id: generateId(),
          ...robotInput,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          robots: [...state.robots, newRobot],
        }));

        console.log('🤖 Robot créé:', newRobot.name);
        return { success: true, robot: newRobot };
      },

      update: async (id: string, robotInput: RobotInput) => {
        const state = get();
        const existingRobot = state.getById(id);
        
        if (!existingRobot) {
          return {
            success: false,
            error: 'Robot non trouvé',
          };
        }

        // Check name uniqueness (exclude current robot)
        if (!state.isNameUnique(robotInput.name, id)) {
          return {
            success: false,
            error: `Un autre robot avec le nom "${robotInput.name}" existe déjà`,
          };
        }

        const updatedRobot: Robot = {
          ...existingRobot,
          ...robotInput,
          updatedAt: new Date(),
        };

        set((state) => ({
          robots: state.robots.map((robot) =>
            robot.id === id ? updatedRobot : robot
          ),
        }));

        console.log('🤖 Robot mis à jour:', updatedRobot.name);
        return { success: true, robot: updatedRobot };
      },

      remove: (id: string) => {
        const state = get();
        const robot = state.getById(id);
        
        if (!robot) {
          return false;
        }

        set((state) => ({
          robots: state.robots.filter((r) => r.id !== id),
          selectedId: state.selectedId === id ? undefined : state.selectedId,
        }));

        console.log('🤖 Robot supprimé:', robot.name);
        return true;
      },

      getById: (id: string) => {
        return get().robots.find((robot) => robot.id === id);
      },

      // Selection
      setSelectedId: (id?: string) => {
        set({ selectedId: id });
      },

      // Utility functions
      isNameUnique: (name: string, excludeId?: string) => {
        const robots = get().robots;
        const normalizedName = name.toLowerCase().trim();
        
        return !robots.some((robot) => 
          robot.id !== excludeId && 
          robot.name.toLowerCase().trim() === normalizedName
        );
      },

      getRobotsSorted: () => {
        return get().robots.sort((a, b) => a.name.localeCompare(b.name));
      },
    }),
    {
      name: 'robots-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the robots data, not UI state like selectedId
      partialize: (state) => ({ robots: state.robots }),
      
      // Handle date deserialization
      onRehydrateStorage: () => (state) => {
        if (state?.robots) {
          state.robots = state.robots.map((robot: any) => ({
            ...robot,
            createdAt: new Date(robot.createdAt),
            updatedAt: new Date(robot.updatedAt),
          }));
        }
      },
    }
  )
);

// Selectors for better performance
export const useRobots = () => useRobotsStore((state) => state.robots);
export const useRobotsSorted = () => useRobotsStore((state) => state.getRobotsSorted());
export const useSelectedRobot = () => {
  const selectedId = useRobotsStore((state) => state.selectedId);
  const getById = useRobotsStore((state) => state.getById);
  return selectedId ? getById(selectedId) : undefined;
};

// Actions selectors - Individual hooks to prevent object recreation
export const useCreateRobot = () => useRobotsStore((state) => state.create);
export const useUpdateRobot = () => useRobotsStore((state) => state.update);
export const useRemoveRobot = () => useRobotsStore((state) => state.remove);
export const useGetRobotById = () => useRobotsStore((state) => state.getById);
export const useSetSelectedId = () => useRobotsStore((state) => state.setSelectedId);
export const useIsNameUnique = () => useRobotsStore((state) => state.isNameUnique);

// Combined actions hook with proper memoization
export const useRobotsActions = () => {
  const create = useRobotsStore((state) => state.create);
  const update = useRobotsStore((state) => state.update);
  const remove = useRobotsStore((state) => state.remove);
  const getById = useRobotsStore((state) => state.getById);
  const setSelectedId = useRobotsStore((state) => state.setSelectedId);
  const isNameUnique = useRobotsStore((state) => state.isNameUnique);
  
  return { create, update, remove, getById, setSelectedId, isNameUnique };
};
