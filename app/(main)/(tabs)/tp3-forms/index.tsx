import { Link } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TP3FormsIndexScreen() {
  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Subtitle */}
        <View style={styles.header}>
          <Text style={styles.subtitle}>
            Choisissez votre implémentation préférée
          </Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          <Link href="/(main)/(tabs)/tp3-forms/formik" asChild style={styles.linkCard}>
            <TouchableOpacity style={[styles.optionCard, styles.formikCard]}>
              <Text style={styles.optionTitle}>Formik + Yup</Text>
              <Text style={styles.optionDescription}>
                Bibliothèque populaire pour les formulaires React avec validation Yup
              </Text>
              <View style={styles.optionFeatures}>
                <Text style={styles.featureText}>• Validation déclarative</Text>
                <Text style={styles.featureText}>• Gestion des erreurs/touched</Text>
                <Text style={styles.featureText}>• API intuitive</Text>
              </View>
            </TouchableOpacity>
          </Link>

          <Link href="/(main)/(tabs)/tp3-forms/rhf" asChild style={styles.linkCard}>
            <TouchableOpacity style={[styles.optionCard, styles.rhfCard]}>
              <Text style={styles.optionTitle}>React Hook Form + Zod</Text>
              <Text style={styles.optionDescription}>
                Solution moderne et performante avec validation TypeScript-first
              </Text>
              <View style={styles.optionFeatures}>
                <Text style={styles.featureText}>• Performance optimisée</Text>
                <Text style={styles.featureText}>• Type safety avec Zod</Text>
                <Text style={styles.featureText}>• Moins de re-rendus</Text>
              </View>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Les deux implémentations offrent la même UX avec validation temps réel,
            navigation au clavier et retours haptiques.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 0,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 20,
    minHeight: '100%',
  },
  header: {
    marginBottom: 32,
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 20,
  },
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
  },
  formikCard: {
    borderLeftColor: '#3b82f6',
  },
  rhfCard: {
    borderLeftColor: '#10b981',
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  optionIconText: {
    fontSize: 24,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
    marginBottom: 16,
  },
  optionFeatures: {
    gap: 4,
  },
  featureText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  footer: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  linkCard: {
    borderWidth: 0.25,
    borderColor: 'grey',
    borderRadius: 16,
    padding: 24,
    // Box shadow
    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
  },
});
