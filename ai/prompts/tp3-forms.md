# Prompts TP3 - Formulaires avec validation

**Date** : Octobre 2024  
**Modèle** : Claude Sonnet 4.5 (Cursor IDE)  

## Prompts principaux

### 1. Schéma de validation Yup

**Prompt** : "Créer un schéma Yup pour un formulaire de contact avec email et message"

**Sortie générée** :
```typescript
const contactSchema = yup.object({
  email: yup.string().email('Email invalide').required('Email requis'),
  message: yup.string().min(10, 'Message trop court').required('Message requis'),
});
```

**Fichier** : `validation/contactSchema.ts` ✅ Généré

---

### 2. Schéma de validation Zod

**Prompt** : "Même schéma avec Zod au lieu de Yup"

**Sortie générée** :
```typescript
const contactSchema = z.object({
  email: z.string().email({ message: 'Email invalide' }),
  message: z.string().min(10, { message: 'Message trop court' }),
});
```

**Fichier** : `validation/contactSchemaZod.ts` ✅ Généré

---

### 3. Aide champs Formik

**Prompt** : "Comment afficher les erreurs de validation en temps réel avec Formik ?"

**Réponse** : Utiliser `touched` et `errors`
```tsx
{formik.touched.email && formik.errors.email && (
  <Text style={styles.error}>{formik.errors.email}</Text>
)}
```

---

### 4. Documentation comparative

**Prompt** : "Quelles sont les différences entre Formik et React Hook Form ?"

**Réponse résumée** :
- Formik : Déclaratif, plus simple
- RHF : Performant (uncontrolled), moins de re-renders

## Résultats

✅ Schémas de validation générés et fonctionnels  
✅ Compréhension validation temps réel  
✅ Choix éclairé entre Formik et RHF
