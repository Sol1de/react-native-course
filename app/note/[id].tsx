import { Ionicons } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.container}
    >
      <Stack.Screen
        options={{
          title: `Note #${id}`,
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              hitSlop={12}
              style={styles.backBtn}
            >
              <Ionicons name="chevron-back" size={24} color="#ffffff" />
              <Text style={styles.backText}>Notes</Text>
            </Pressable>
          ),
        }}
      />

      <Text style={styles.heading}>Détail de la note</Text>
      <Text selectable style={styles.body}>
        Identifiant : {id}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  heading: { fontSize: 22, fontWeight: "bold", color: "#3a0a4d" },
  body: { fontSize: 16, color: "#444" },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 2 },
  backText: { color: "#ffffff", fontSize: 16 },
});
