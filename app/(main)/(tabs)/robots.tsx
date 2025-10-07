import { Link } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAppSelector } from "../../../app/_hooks";
import { selectRobotsCount } from "../../../features/robots/selectors";
import { useRobotsStore } from "../../../store/robotsStore";

export default function RobotsScreen() {
  // Redux robots count
  const reduxRobotsCount = useAppSelector(selectRobotsCount);
  
  // Zustand robots count
  const zustandRobots = useRobotsStore((state) => state.robots);
  const zustandRobotsCount = zustandRobots.length;

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Robots 🤖</Text>
      <Text style={styles.subtitle}>Choisissez votre approche de gestion d'état</Text>

      {/* Zustand Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Zustand</Text>
        <Text style={styles.cardDescription}>
          Simple et léger - Parfait pour débuter
        </Text>
        
        <View style={styles.statsContainer}>
          <Text style={styles.statNumber}>{zustandRobotsCount}</Text>
          <Text style={styles.statLabel}>Robot{zustandRobotsCount !== 1 ? 's' : ''} créé{zustandRobotsCount !== 1 ? 's' : ''}</Text>
        </View>

        <Link href="/(main)/tp4-robots" asChild>
          <TouchableOpacity style={styles.zustandButton}>
            <Text style={styles.buttonText}>Accéder à Zustand</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Redux Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Redux Toolkit</Text>
        <Text style={styles.cardDescription}>
          Robuste et structuré - Pour les gros projets
        </Text>
        
        <View style={styles.statsContainer}>
          <Text style={styles.statNumber}>{reduxRobotsCount}</Text>
          <Text style={styles.statLabel}>Robot{reduxRobotsCount !== 1 ? 's' : ''} créé{reduxRobotsCount !== 1 ? 's' : ''}</Text>
        </View>

        <Link href="/(main)/tp4b-robots-rtk" asChild>
          <TouchableOpacity style={styles.reduxButton}>
            <Text style={styles.buttonText}>Accéder à Redux</Text>
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
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
    textAlign: "center",
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
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
    textAlign: "center",
  },
  cardDescription: {
    fontSize: 16,
    color: "#4b5563",
    lineHeight: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  statsContainer: {
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1f2937",
  },
  statLabel: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 4,
  },
  zustandButton: {
    backgroundColor: "#f59e0b",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  reduxButton: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
