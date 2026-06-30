import { Ionicons } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { useNote } from "../../contexts/notes";

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getNote } = useNote();
  const note = getNote(id);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.container}
    >
      <Stack.Screen
        options={{
          title: note?.title ?? `Note #${id}`,
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

      {note ? (
        <>
          <Text style={styles.heading}>{note.title}</Text>
          {note.text.trim().length > 0 ? (
            <Text selectable style={styles.body}>
              {note.text}
            </Text>
          ) : (
            <Text style={styles.placeholder}>Cette note est vide.</Text>
          )}
        </>
      ) : (
        <Text style={styles.placeholder}>Note introuvable (#{id}).</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  heading: { fontSize: 22, fontWeight: "bold", color: "#3a0a4d" },
  body: { fontSize: 16, color: "#444" },
  placeholder: { fontSize: 16, color: "#999", fontStyle: "italic" },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 2 },
  backText: { color: "#ffffff", fontSize: 16 },
});
