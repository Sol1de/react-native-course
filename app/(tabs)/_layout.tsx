import { Tabs, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#922dba" },
        headerTintColor: "#ffffff",
        headerTitleStyle: { fontWeight: "bold" },
        tabBarActiveTintColor: "#922dba",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Notes",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" color={color} size={size} />
          ),
          // Bouton + dans l'en-tête : ouvre la modale de création
          headerRight: () => (
            <Pressable
              onPress={() => router.push("/note/create")}
              hitSlop={12}
              style={{ paddingHorizontal: 16 }}
            >
              <Ionicons name="add" size={28} color="#ffffff" />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Réglages",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "À propos",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
