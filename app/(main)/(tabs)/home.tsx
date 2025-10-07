import { Link } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  useEffect(() => {
    // console.log("🏠 HomeScreen - Écran d'accueil monté");
  }, []);

  // console.log("🔄 HomeScreen - Rendu de la page d'accueil");

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Bienvenue 👋</Text>
      <Text style={styles.subtitle}>Laboratoires avancés React Native</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>TP2 - Navigation</Text>
        <Text style={styles.cardDescription}>
          Structure de navigation avec Stack et Tabs configurée avec succès !
        </Text>

        <Link href="/(main)/detail/42" asChild>
          <TouchableOpacity style={styles.detailButton}>
            <Text style={styles.detailButtonText}>Voir Détail (ID: 42)</Text>
          </TouchableOpacity>
        </Link>

        <View style={{ height: 12 }} />

        <Link href="/(main)/(tabs)/tp1-profile-card" asChild>
          <TouchableOpacity style={styles.profileButton}>
            <Text style={styles.detailButtonText}>Aller au Profil</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>TP3 - Formulaires avancés</Text>
        <Text style={styles.cardDescription}>
          Deux implémentations de formulaires avec validation temps réel
        </Text>

        <Link href="/(main)/(tabs)/tp3-forms/formik" asChild>
          <TouchableOpacity style={styles.formikButton}>
            <Text style={styles.detailButtonText}>TP3 – Formik</Text>
          </TouchableOpacity>
        </Link>

        <View style={{ height: 12 }} />

        <Link href="/(main)/(tabs)/tp3-forms/rhf" asChild>
          <TouchableOpacity style={styles.rhfButton}>
            <Text style={styles.detailButtonText}>TP3 – RHF</Text>
          </TouchableOpacity>
        </Link>

        <View style={{ height: 12 }} />

        <Link href="/(main)/(tabs)/tp3-forms" asChild>
          <TouchableOpacity style={styles.formsOverviewButton}>
            <Text style={styles.detailButtonText}>Vue d'ensemble</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>TP4 - Gestion des Robots</Text>
        <Text style={styles.cardDescription}>
          Comparaison de deux approches : Zustand vs Redux Toolkit
        </Text>

        <Link href="/(main)/(tabs)/robots" asChild>
          <TouchableOpacity style={styles.robotsButton}>
            <Text style={styles.detailButtonText}>TP4 – Robots</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>TP5 - SQLite Offline</Text>
        <Text style={styles.cardDescription}>
          Base de données locale avec migrations, CRUD complet et export/import
        </Text>

        <Link href="/(main)/(tabs)/tp5-robots-db" asChild>
          <TouchableOpacity style={styles.sqliteButton}>
            <Text style={styles.detailButtonText}>🗄️ TP5 – Robots SQLite</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#6b7280",
    marginBottom: 40,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    maxWidth: 300,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#3b82f6",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    color: "#4b5563",
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  detailButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  detailButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  profileButton: {
    backgroundColor: "#10b981",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  formikButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  rhfButton: {
    backgroundColor: "#10b981",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  formsOverviewButton: {
    backgroundColor: "#8b5cf6",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  robotsButton: {
    backgroundColor: "#f59e0b",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  sqliteButton: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});
