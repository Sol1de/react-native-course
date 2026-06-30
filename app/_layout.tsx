import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import LoadingScreen from "../components/loadingScreen";
import { NotesProvider, useNote } from "../contexts/notes";

function RootNavigator() {
  const { isReady } = useNote();

  if (!isReady) {
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
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="note/[id]" />
      <Stack.Screen
        name="note/create"
        options={{
          presentation: "modal",
          title: "Nouvelle note",
        }}
      />
      <Stack.Screen
        name="note/edit/[id]"
        options={{
          presentation: "modal",
          title: "Modifier la note",
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <NotesProvider>
        <RootNavigator />
      </NotesProvider>
    </SafeAreaProvider>
  );
}
