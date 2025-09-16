import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { getLastRoute } from "../hooks/use-route-persistence";

export default function Index() {
  const [lastRoute, setLastRoute] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("🚀 Index.tsx - Composant monté");
    
    const loadLastRoute = async () => {
      const savedRoute = await getLastRoute();
      setLastRoute(savedRoute);
      setIsLoading(false);
    };

    loadLastRoute();
  }, []);

  if (isLoading) {
    console.log("⏳ Index.tsx - Chargement en cours...");
    return null;
  }

  const targetRoute = lastRoute || "/(main)/home";
  console.log("🔄 Index.tsx - Redirection vers:", targetRoute);
  
  return <Redirect href={targetRoute as any} />;
}
