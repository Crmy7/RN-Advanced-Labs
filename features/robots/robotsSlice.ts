import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { Robot, RobotsState } from '../../types/robot';

const initialState: RobotsState = {
  items: [],
  loading: false,
  error: null,
};

// Thunk asynchrone pour simuler une sauvegarde
export const saveRobotAsync = createAsyncThunk(
  'robots/saveRobotAsync',
  async ({ robot, isUpdate }: { robot: Omit<Robot, 'id'> | Robot; isUpdate: boolean }, { getState, rejectWithValue }) => {
    console.log('🔄 [THUNK] Début du thunk saveRobotAsync:', { robot, isUpdate });
    
    // Simulation d'une requête API
    console.log('⏳ [THUNK] Simulation délai API (500ms)...');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (isUpdate) {
      console.log('✏️ [THUNK] Mode mise à jour');
      return { robot: robot as Robot, isUpdate: true };
    } else {
      console.log('➕ [THUNK] Mode création, génération UUID...');
      const newRobot: Robot = {
        ...robot,
        id: uuidv4(),
      };
      console.log('✅ [THUNK] Robot créé avec UUID:', newRobot);
      return { robot: newRobot, isUpdate: false };
    }
  }
);

const robotsSlice = createSlice({
  name: 'robots',
  initialState,
  reducers: {
    createRobot: (state, action: PayloadAction<Omit<Robot, 'id'>>) => {
      console.log('🔧 [REDUCER] createRobot appelé avec:', action.payload);
      const { name } = action.payload;
      
      // Vérifier l'unicité du nom
      const existingRobot = state.items.find(robot => robot.name === name);
      if (existingRobot) {
        console.error('❌ [REDUCER] Nom déjà existant:', name);
        state.error = `Un robot avec le nom "${name}" existe déjà`;
        return;
      }
      
      const newRobot: Robot = {
        ...action.payload,
        id: uuidv4(),
      };
      
      console.log('✅ [REDUCER] Robot créé:', newRobot);
      state.items.push(newRobot);
      state.error = null;
      console.log('📊 [REDUCER] Nouveau state items:', state.items.length, 'robots');
    },
    
    updateRobot: (state, action: PayloadAction<{ id: string; changes: Partial<Omit<Robot, 'id'>> }>) => {
      const { id, changes } = action.payload;
      const robotIndex = state.items.findIndex(robot => robot.id === id);
      
      if (robotIndex === -1) {
        state.error = 'Robot non trouvé';
        return;
      }
      
      // Si le nom change, vérifier l'unicité
      if (changes.name) {
        const existingRobot = state.items.find(robot => robot.name === changes.name && robot.id !== id);
        if (existingRobot) {
          state.error = `Un robot avec le nom "${changes.name}" existe déjà`;
          return;
        }
      }
      
      state.items[robotIndex] = { ...state.items[robotIndex], ...changes };
      state.error = null;
    },
    
    deleteRobot: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const robotIndex = state.items.findIndex(robot => robot.id === id);
      
      if (robotIndex === -1) {
        state.error = 'Robot non trouvé';
        return;
      }
      
      state.items.splice(robotIndex, 1);
      state.error = null;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveRobotAsync.pending, (state) => {
        console.log('⏳ [THUNK] saveRobotAsync.pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(saveRobotAsync.fulfilled, (state, action) => {
        console.log('✅ [THUNK] saveRobotAsync.fulfilled avec payload:', action.payload);
        state.loading = false;
        state.error = null;
        const { robot, isUpdate } = action.payload;
        
        if (isUpdate) {
          console.log('✏️ [THUNK] Mise à jour du robot ID:', robot.id);
          const robotIndex = state.items.findIndex(r => r.id === robot.id);
          if (robotIndex !== -1) {
            state.items[robotIndex] = robot;
            console.log('✅ [THUNK] Robot mis à jour à l\'index:', robotIndex);
          } else {
            console.error('❌ [THUNK] Robot non trouvé pour mise à jour:', robot.id);
          }
        } else {
          console.log('➕ [THUNK] Ajout d\'un nouveau robot:', robot.name);
          // Vérifier l'unicité du nom avant d'ajouter
          const existingRobot = state.items.find(r => r.name === robot.name);
          if (existingRobot) {
            console.error('❌ [THUNK] Nom déjà existant:', robot.name);
            state.error = `Un robot avec le nom "${robot.name}" existe déjà`;
            return;
          }
          state.items.push(robot);
          console.log('✅ [THUNK] Robot ajouté, total:', state.items.length, 'robots');
        }
      })
      .addCase(saveRobotAsync.rejected, (state, action) => {
        console.error('❌ [THUNK] saveRobotAsync.rejected:', action);
        state.loading = false;
        // Utiliser le payload du rejectWithValue en priorité
        state.error = (action.payload as string) || action.error?.message || 'Erreur lors de la sauvegarde';
      });
  },
});

export const { createRobot, updateRobot, deleteRobot, clearError } = robotsSlice.actions;
export default robotsSlice.reducer;
