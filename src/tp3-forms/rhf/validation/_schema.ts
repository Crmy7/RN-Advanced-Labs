import { z } from 'zod';

export const registrationSchema = z.object({
  email: z
    .string()
    .min(1, 'Email requis')
    .email('Format d\'email invalide'),
  
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial'
    ),
  
  confirmPassword: z.string().min(1, 'Confirmation du mot de passe requise'),
  
  displayName: z
    .string()
    .min(2, 'Le nom d\'affichage doit contenir au moins 2 caractères')
    .max(50, 'Le nom d\'affichage ne peut pas dépasser 50 caractères'),
  
  termsAccepted: z
    .boolean()
    .refine(val => val === true, {
      message: 'Vous devez accepter les conditions d\'utilisation',
    }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export type RegistrationFormValues = z.infer<typeof registrationSchema>;
