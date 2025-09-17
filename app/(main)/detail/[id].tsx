import { Link, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedId?: string;
}

function validateId(id: string | string[]): ValidationResult {
  const idStr = Array.isArray(id) ? id[0] : id;

  if (!idStr) {
    return { isValid: false, error: "ID manquant" };
  }
  if (typeof idStr !== "string") {
    return { isValid: false, error: "Format d'ID invalide" };
  }

  const sanitizedId = idStr.trim();
  if (sanitizedId.length === 0) {
    return { isValid: false, error: "ID vide" };
  }
  if (sanitizedId.length > 50) {
    return { isValid: false, error: "ID trop long" };
  }

  return { isValid: true, sanitizedId };
}

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
  });

  useEffect(() => {
    console.log(`🔍 DetailScreen monté avec ID: ${id}`);
    setValidationResult(validateId(id));
  }, [id]);

  if (!validationResult.isValid) {
    return (
      <View style={styles.container}>
        <View style={styles.errorCard}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>ID Invalide</Text>
          <Text style={styles.errorMessage}>{validationResult.error}</Text>
          <Text style={styles.errorDetails}>
            ID reçu : "{Array.isArray(id) ? id.join(", ") : id}"
          </Text>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace("/(main)/(tabs)/home")}
          >
            <Text style={styles.backButtonText}>← Retour à l'accueil</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Écran de Détail</Text>
      <View style={styles.card}>
        <Text style={styles.paramLabel}>Paramètre ID :</Text>
        <Text style={styles.paramValue}>{validationResult.sanitizedId}</Text>
        <Text style={styles.validBadge}>✅ ID validé</Text>
      </View>
      <Text style={styles.description}>
        Cet écran utilise un paramètre dynamique récupéré via l'URL. L'ID a été
        validé et nettoyé pour la sécurité.
      </Text>

      <Link href="/(main)/(tabs)/home" asChild style={{ marginTop: 24 }}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>← Retour à l'accueil</Text>
        </TouchableOpacity>
      </Link>
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
    fontSize: 28,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 32,
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
    minWidth: 250,
    alignItems: "center",
    marginBottom: 24,
  },
  paramLabel: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 8,
  },
  paramValue: {
    fontSize: 24,
    fontWeight: "600",
    color: "#3b82f6",
  },
  validBadge: {
    fontSize: 12,
    color: "#059669",
    marginTop: 8,
    fontWeight: "500",
  },
  description: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
  },
  // Styles pour l'écran d'erreur
  errorCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    minWidth: 300,
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#ef4444",
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ef4444",
    marginBottom: 12,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  errorDetails: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 24,
    textAlign: "center",
    fontFamily: "monospace",
    backgroundColor: "#f3f4f6",
    padding: 8,
    borderRadius: 4,
  },
  backButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 160,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
