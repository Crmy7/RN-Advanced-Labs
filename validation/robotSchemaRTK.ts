import * as Yup from 'yup';
import { RobotType } from '../types/robot';

const currentYear = new Date().getFullYear();

export const robotValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .required('Le nom est requis'),
  label: Yup.string()
    .min(3, 'Le label doit contenir au moins 3 caractères')
    .required('Le label est requis'),
  year: Yup.number()
    .integer('L\'année doit être un nombre entier')
    .min(1950, 'L\'année doit être supérieure ou égale à 1950')
    .max(currentYear, `L'année ne peut pas être supérieure à ${currentYear}`)
    .required('L\'année est requise'),
  type: Yup.mixed<RobotType>()
    .oneOf(['industrial', 'service', 'medical', 'educational', 'other'], 'Type invalide')
    .required('Le type est requis'),
});

export type RobotFormData = Yup.InferType<typeof robotValidationSchema>;
