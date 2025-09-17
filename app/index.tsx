import { Redirect } from "expo-router";
import { NavigationRestorer } from "../components/navigation-restorer";

/**
 * Point d'entrée : utilise NavigationRestorer pour restaurer la stack complète
 * au lieu d'une simple redirection
 */
export default function Index() {
  return (
    <NavigationRestorer>
      <Redirect href="/(main)/(tabs)/home" />
    </NavigationRestorer>
  );
}
