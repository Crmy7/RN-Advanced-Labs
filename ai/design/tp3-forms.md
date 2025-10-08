# Design TP3 - Formulaires

**Généré avec IA** : Schémas de validation uniquement  
**Architecture** : Décidée manuellement  

## Fichiers générés par IA

### Schémas de validation

```typescript
// validation/contactSchema.ts (Yup) - ✅ GÉNÉRÉ
export const contactSchema = yup.object({
  email: yup.string().email('Email invalide').required('Email requis'),
  message: yup.string().min(10, 'Message trop court').required('Message requis'),
});

// validation/contactSchemaZod.ts (Zod) - ✅ GÉNÉRÉ
export const contactSchema = z.object({
  email: z.string().email({ message: 'Email invalide' }),
  message: z.string().min(10, { message: 'Message trop court' }),
});
```

**Justification** : Schémas de validation = code répétitif suivant patterns standards.

## Architecture (manuelle)

- Structure navigation : `tp3-forms/_layout.tsx`
- Écrans Formik et RHF séparés
- Composants réutilisables

## Décisions

**Pourquoi Yup ET Zod** : Comparaison pédagogique  
**Pourquoi deux écrans séparés** : Comparaison côte à côte
