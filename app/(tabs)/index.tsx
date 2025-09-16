import { StyleSheet, View } from 'react-native';
import ProfileCard from '../tp1-profile-card';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ProfileCard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
