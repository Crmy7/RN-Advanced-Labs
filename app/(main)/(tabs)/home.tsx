import { Link } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  useEffect(() => {
    console.log("🏠 HomeScreen - Écran d'accueil monté");
  }, []);

  console.log("🔄 HomeScreen - Rendu de la page d'accueil");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue 👋</Text>
      <Text style={styles.subtitle}>Laboratoires avancés React Native</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Navigation TP2</Text>
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
          <TouchableOpacity style={[styles.detailButton, { backgroundColor: "#10b981" }]}>
            <Text style={styles.detailButtonText}>Aller au Profil</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
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
});
