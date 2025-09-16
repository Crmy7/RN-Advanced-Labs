import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function RegisterScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inscription</Text>
      <Text style={styles.description}>
        Écran d'inscription (groupe auth)
      </Text>
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
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
});
