import { z } from 'zod';

export const RobotType = {
  INDUSTRIAL: 'industrial',
  SERVICE: 'service',
  MEDICAL: 'medical',
  EDUCATIONAL: 'educational',
  OTHER: 'other',
} as const;

export type RobotType = typeof RobotType[keyof typeof RobotType];

export const robotTypeOptions = [
  { label: 'Industriel', value: RobotType.INDUSTRIAL },
  { label: 'Service', value: RobotType.SERVICE },
  { label: 'Médical', value: RobotType.MEDICAL },
  { label: 'Éducatif', value: RobotType.EDUCATIONAL },
  { label: 'Autre', value: RobotType.OTHER },
] as const;

const currentYear = new Date().getFullYear();

export const robotSchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .trim(),
  
  label: z
    .string()
    .min(3, 'Le libellé doit contenir au moins 3 caractères')
    .max(100, 'Le libellé ne peut pas dépasser 100 caractères')
    .trim(),
  
  year: z
    .number({
      required_error: 'L\'année est requise',
      invalid_type_error: 'L\'année doit être un nombre',
    })
    .int('L\'année doit être un nombre entier')
    .min(1950, 'L\'année doit être supérieure ou égale à 1950')
    .max(currentYear, `L'année ne peut pas être supérieure à ${currentYear}`),
  
  type: z.enum([
    RobotType.INDUSTRIAL,
    RobotType.SERVICE,
    RobotType.MEDICAL,
    RobotType.EDUCATIONAL,
    RobotType.OTHER,
  ], {
    required_error: 'Le type de robot est requis',
    invalid_type_error: 'Type de robot invalide',
  }),
});

export type RobotInput = z.infer<typeof robotSchema>;

export interface Robot extends RobotInput {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export default robotSchema;
