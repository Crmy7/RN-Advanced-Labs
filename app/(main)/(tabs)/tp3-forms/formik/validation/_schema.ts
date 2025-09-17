import * as Yup from 'yup';

export const registrationSchema = Yup.object({
  email: Yup.string()
    .email('Format d\'email invalide')
    .required('Email requis'),
  
  password: Yup.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial'
    )
    .required('Mot de passe requis'),
  
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Les mots de passe ne correspondent pas')
    .required('Confirmation du mot de passe requise'),
  
  displayName: Yup.string()
    .min(2, 'Le nom d\'affichage doit contenir au moins 2 caractères')
    .max(50, 'Le nom d\'affichage ne peut pas dépasser 50 caractères')
    .required('Nom d\'affichage requis'),
  
  termsAccepted: Yup.boolean()
    .oneOf([true], 'Vous devez accepter les conditions d\'utilisation')
    .required('Acceptation des conditions requise'),
});

export type RegistrationFormValues = Yup.InferType<typeof registrationSchema>;

export default registrationSchema;
