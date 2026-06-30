import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NotesProvider } from "../contexts/notes";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <NotesProvider>
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
        </Stack>
      </NotesProvider>
    </SafeAreaProvider>
  );
}
