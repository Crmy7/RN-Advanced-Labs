import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

// Sélecteur de base pour les robots
export const selectRobots = (state: RootState) => state.robots.items;

// Sélecteur pour l'état de chargement
export const selectRobotsLoading = (state: RootState) => state.robots.loading;

// Sélecteur pour les erreurs
export const selectRobotsError = (state: RootState) => state.robots.error;

// Sélecteur pour un robot par ID
export const selectRobotById = (id: string) => (state: RootState) =>
  state.robots.items.find(robot => robot.id === id);

// Sélecteur mémorisé pour les robots triés par nom
export const selectRobotsSortedByName = createSelector(
  [selectRobots],
  (robots) => [...robots].sort((a, b) => a.name.localeCompare(b.name))
);

// Sélecteur mémorisé pour les robots triés par année (plus récents en premier)
export const selectRobotsSortedByYear = createSelector(
  [selectRobots],
  (robots) => [...robots].sort((a, b) => b.year - a.year)
);

// Sélecteur mémorisé pour les robots par type
export const selectRobotsByType = createSelector(
  [selectRobots],
  (robots) => {
    const robotsByType = robots.reduce((acc, robot) => {
      if (!acc[robot.type]) {
        acc[robot.type] = [];
      }
      acc[robot.type].push(robot);
      return acc;
    }, {} as Record<string, typeof robots>);
    
    return robotsByType;
  }
);

// Sélecteur pour le nombre total de robots
export const selectRobotsCount = createSelector(
  [selectRobots],
  (robots) => robots.length
);
