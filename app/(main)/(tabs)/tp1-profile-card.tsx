import { Link } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProfileCard() {
  const [isFollowing, setIsFollowing] = useState(false);
  // Number of followers
  const [followers, setFollowers] = useState(0);
  // Timer en secondes
  const [timer, setTimer] = useState(0);
  // État du timer
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const timerRef = useRef<number | null>(null);
  const followersRef = useRef<number | null>(null);

  useEffect(() => {
    console.log("👤 ProfileCard - Écran Profile Card monté");
  }, []);

  const handleFollow = () => {
    setIsFollowing((prev) => {
      const newFollowingState = !prev;
      setFollowers((prevFollowers) =>
        newFollowingState ? prevFollowers + 1 : prevFollowers - 1
      );
      return newFollowingState;
    });
  };

  const handleStartReset = () => {
    if (isTimerRunning) {
      // Reset
      if (timerRef.current) clearInterval(timerRef.current);
      if (followersRef.current) clearInterval(followersRef.current);
      setTimer(0);
      setFollowers(0);
      setIsTimerRunning(false);
      console.log("🧹 Timers arrêtés et remis à zéro");
    } else {
      // Start
      console.log("📅 Timer démarré");
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);

      followersRef.current = setInterval(() => {
        setFollowers((prev) => {
          console.log("⏰ Followers tick:", prev + 1);
          return prev + 1;
        });
      }, 5000);

      setIsTimerRunning(true);
    }
  };

  return (
    <View style={[styles.container, isFollowing && styles.containerFollowing]}>
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=400&h=400&fit=crop&crop=faces",
        }}
        style={[styles.avatar, isFollowing && styles.avatarFollowing]}
      />
      <Text style={[styles.name, isFollowing && styles.nameFollowing]}>
        Alex Martin
      </Text>
      <Text style={[styles.role, isFollowing && styles.roleFollowing]}>
        Product Designer
      </Text>
      <Text style={styles.followers}>{followers} followers</Text>

      {/* Dual buttons row */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.button,
            isFollowing ? styles.buttonFollowing : styles.buttonFollow,
          ]}
          onPress={handleFollow}
        >
          <Text
            style={[
              styles.buttonText,
              isFollowing && styles.buttonTextFollowing,
            ]}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.timerButton,
            isTimerRunning ? styles.resetButton : styles.startButton,
          ]}
          onPress={handleStartReset}
        >
          <Text style={styles.timerButtonText}>
            {isTimerRunning ? "Reset" : "Start"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Timer */}
      <Text style={styles.timer}>{timer} seconds</Text>

      <Link href="/(main)/detail/42" asChild>
        <TouchableOpacity style={styles.detailButton}>
          <Text style={styles.detailButtonText}>Voir Détail (ID: 42)</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "flex-start",
    minWidth: 300,
    minHeight: "100%",
    padding: 24,
    gap: 8,
    borderRadius: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  containerFollowing: {
    backgroundColor: "#f0f9ff",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  avatarFollowing: {
    borderColor: "#3b82f6",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937",
  },
  nameFollowing: {
    color: "#1d4ed8",
  },
  role: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  roleFollowing: {
    color: "#3b82f6",
    fontWeight: "500",
  },
  followers: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
  },
  buttonFollow: {
    backgroundColor: "#3b82f6",
  },
  buttonFollowing: {
    backgroundColor: "red",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#fff",
  },
  buttonTextFollowing: {
    color: "#fff",
  },
  timer: {
    fontSize: 12,
    color: "#888",
    marginTop: 8,
    fontStyle: "italic",
  },
  timerButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
  },
  startButton: {
    backgroundColor: "green",
  },
  resetButton: {
    backgroundColor: "red",
  },
  timerButtonText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
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
