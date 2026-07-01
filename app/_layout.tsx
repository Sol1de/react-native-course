import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import LoadingScreen from "../components/loadingScreen";
import { useSession } from "../hooks/auth";

const queryClient = new QueryClient();

function RootNavigator() {
  const { session, loading } = useSession();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#922dba",
        },
        headerTintColor: "#ffffff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="note/[id]" />
        <Stack.Screen
          name="note/create"
          options={{ presentation: "modal", title: "Nouvelle note" }}
        />
        <Stack.Screen
          name="note/edit/[id]"
          options={{ presentation: "modal", title: "Modifier la note" }}
        />
      </Stack.Protected>

      <Stack.Protected guard={!session}>
        <Stack.Screen name="auth/index" options={{ title: "Connexion" }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
