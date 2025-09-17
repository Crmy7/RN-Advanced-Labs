import * as Haptics from 'expo-haptics';
import { Link } from 'expo-router';
import { Formik } from 'formik';
import React, { useRef } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { CheckboxField } from './components/_CheckboxField';
import { FormField } from './components/_FormField';
import { registrationSchema, type RegistrationFormValues } from './validation/_schema';

const initialValues: RegistrationFormValues = {
  email: '',
  password: '',
  confirmPassword: '',
  displayName: '',
  termsAccepted: false,
};

export default function FormikFormScreen() {
  // 📊 Instrumentation : Log des re-rendus du composant principal
  const renderCount = useRef(0);
  renderCount.current += 1;
  // console.log(`🔧 [Formik] Composant principal - Rendu #${renderCount.current}`);

  // Références pour la navigation entre les champs
  const passwordRef = useRef<TextInput | null>(null);
  const confirmPasswordRef = useRef<TextInput | null>(null);
  const displayNameRef = useRef<TextInput | null>(null);

  const handleSubmit = async (values: RegistrationFormValues) => {
    try {
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Haptique de succès
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      Alert.alert(
        '✅ Inscription réussie !',
        `Bienvenue ${values.displayName} ! Votre compte a été créé avec succès.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset du formulaire après succès
              // Note: le reset sera géré par Formik
            }
          }
        ]
      );
    } catch (error) {
      // Haptique d'erreur
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      Alert.alert(
        '❌ Erreur',
        'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Formik + Yup</Text>
            <Text style={styles.subtitle}>Formulaire d'inscription</Text>
            
            {/* Lien croisé vers RHF */}
            <Link href="/(main)/(tabs)/tp3-forms/rhf" asChild>
              <TouchableOpacity style={styles.crossLinkButton}>
                <Text style={styles.crossLinkText}>🔄 Basculer vers RHF + Zod</Text>
              </TouchableOpacity>
            </Link>
          </View>

          <Formik
            initialValues={initialValues}
            validationSchema={registrationSchema}
            onSubmit={async (values, { resetForm, setSubmitting }) => {
              setSubmitting(true);
              await handleSubmit(values);
              setSubmitting(false);
              resetForm();
            }}
          >
            {({ handleSubmit, isValid, isSubmitting, dirty }) => (
              <View style={styles.form}>
                <FormField
                  name="email"
                  label="Email"
                  placeholder="votre.email@exemple.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  nextFieldRef={passwordRef}
                />

                <FormField
                  name="password"
                  label="Mot de passe"
                  placeholder="Votre mot de passe"
                  secureTextEntry
                  autoComplete="new-password"
                  ref={passwordRef}
                  nextFieldRef={confirmPasswordRef}
                />

                <FormField
                  name="confirmPassword"
                  label="Confirmer le mot de passe"
                  placeholder="Confirmez votre mot de passe"
                  secureTextEntry
                  autoComplete="new-password"
                  ref={confirmPasswordRef}
                  nextFieldRef={displayNameRef}
                />

                <FormField
                  name="displayName"
                  label="Nom d'affichage"
                  placeholder="Votre nom d'affichage"
                  autoCapitalize="words"
                  autoComplete="name"
                  ref={displayNameRef}
                />

                <CheckboxField
                  name="termsAccepted"
                  label="J'accepte les conditions d'utilisation et la politique de confidentialité"
                />

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    (!isValid || !dirty) && styles.submitButtonDisabled
                  ]}
                  onPress={() => handleSubmit()}
                  disabled={!isValid || !dirty || isSubmitting}
                >
                  <Text style={[
                    styles.submitButtonText,
                    (!isValid || !dirty) && styles.submitButtonTextDisabled
                  ]}>
                    {isSubmitting ? 'Inscription en cours...' : 'S\'inscrire'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 32,
  },
  crossLinkButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
    alignSelf: 'center',
  },
  crossLinkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  submitButtonTextDisabled: {
    color: '#9ca3af',
  },
});
