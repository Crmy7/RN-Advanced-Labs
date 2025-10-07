import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ListRobotsOptions, RobotInput, RobotUpdate, robotRepo } from '../services/robotRepo';

/**
 * Clés de requête pour TanStack Query
 */
export const robotKeys = {
  all: ['robots'] as const,
  lists: () => [...robotKeys.all, 'list'] as const,
  list: (options: ListRobotsOptions) => [...robotKeys.lists(), options] as const,
  details: () => [...robotKeys.all, 'detail'] as const,
  detail: (id: string) => [...robotKeys.details(), id] as const,
  count: () => [...robotKeys.all, 'count'] as const,
};

/**
 * Hook pour récupérer la liste des robots
 */
export function useRobotsQuery(options: ListRobotsOptions = {}) {
  return useQuery({
    queryKey: robotKeys.list(options),
    queryFn: () => robotRepo.list(options),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook pour récupérer un robot par son ID
 */
export function useRobotQuery(id: string) {
  return useQuery({
    queryKey: robotKeys.detail(id),
    queryFn: () => robotRepo.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook pour compter les robots
 */
export function useRobotsCountQuery(includeArchived = false) {
  return useQuery({
    queryKey: [...robotKeys.count(), includeArchived],
    queryFn: () => robotRepo.count(includeArchived),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook pour créer un robot
 */
export function useCreateRobotMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: RobotInput) => robotRepo.create(input),
    onSuccess: () => {
      // Invalider toutes les listes et le compteur
      queryClient.invalidateQueries({ queryKey: robotKeys.lists() });
      queryClient.invalidateQueries({ queryKey: robotKeys.count() });
    },
  });
}

/**
 * Hook pour mettre à jour un robot
 */
export function useUpdateRobotMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: RobotUpdate }) =>
      robotRepo.update(id, updates),
    onSuccess: (data) => {
      // Invalider le détail du robot mis à jour
      queryClient.invalidateQueries({ queryKey: robotKeys.detail(data.id) });
      // Invalider toutes les listes
      queryClient.invalidateQueries({ queryKey: robotKeys.lists() });
      // Invalider le compteur si le robot a été archivé/désarchivé
      queryClient.invalidateQueries({ queryKey: robotKeys.count() });
    },
  });
}

/**
 * Hook pour supprimer un robot
 */
export function useDeleteRobotMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => robotRepo.remove(id),
    onSuccess: () => {
      // Invalider toutes les listes et le compteur
      queryClient.invalidateQueries({ queryKey: robotKeys.lists() });
      queryClient.invalidateQueries({ queryKey: robotKeys.count() });
    },
  });
}

/**
 * Hook pour archiver un robot
 */
export function useArchiveRobotMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => robotRepo.archive(id),
    onSuccess: (data) => {
      // Invalider le détail du robot archivé
      queryClient.invalidateQueries({ queryKey: robotKeys.detail(data.id) });
      // Invalider toutes les listes et le compteur
      queryClient.invalidateQueries({ queryKey: robotKeys.lists() });
      queryClient.invalidateQueries({ queryKey: robotKeys.count() });
    },
  });
}

/**
 * Hook pour importer des robots
 */
export function useImportRobotsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (robots: RobotInput[]) => robotRepo.importRobots(robots),
    onSuccess: () => {
      // Invalider toutes les listes et le compteur
      queryClient.invalidateQueries({ queryKey: robotKeys.lists() });
      queryClient.invalidateQueries({ queryKey: robotKeys.count() });
    },
  });
}

/**
 * Hook pour récupérer tous les robots (pour export)
 */
export function useAllRobotsQuery() {
  return useQuery({
    queryKey: [...robotKeys.all, 'export'],
    queryFn: () => robotRepo.getAll(),
    enabled: false, // Ne pas exécuter automatiquement
  });
}

