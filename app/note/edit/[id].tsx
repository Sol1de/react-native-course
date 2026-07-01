import { Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { useNote, useUpdateNote } from "../../../hooks/notes";

export default function EditNoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: note } = useNote(id);
  const updateNote = useUpdateNote();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const canSave = title.trim().length > 0;

  useEffect(() => {
    if (note && !hydrated) {
      setTitle(note.title);
      setText(note.text);
      setHydrated(true);
    }
  }, [note, hydrated]);

  const handleSave = () => {
    if (!canSave) return;
    updateNote.mutate(
      { id, title: title.trim(), text },
      { onSuccess: () => router.back() }
    );
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.container}
    >
      <Stack.Screen
        options={{
          headerTitle: () => (
            <TextInput
              value={title}
              onChangeText={setTitle}
              style={styles.headerTitleInput}
              placeholder="Titre"
              placeholderTextColor="#ead6f2"
              selectTextOnFocus
            />
          ),
          headerLeft: () => (
            <Pressable onPress={() => router.back()} hitSlop={12}>
              <Text style={styles.headerBtn}>Annuler</Text>
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={handleSave} hitSlop={12} disabled={!canSave}>
              <Text
                style={[
                  styles.headerBtn,
                  styles.headerBtnBold,
                  !canSave && styles.headerBtnDisabled,
                ]}
              >
                Enregistrer
              </Text>
            </Pressable>
          ),
        }}
      />

      {note ? (
        <TextInput
          placeholder="Écris ta note…"
          value={text}
          onChangeText={setText}
          multiline
          autoFocus
          style={styles.input}
        />
      ) : (
        <Text style={styles.placeholder}>Note introuvable (#{id}).</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  headerTitleInput: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    minWidth: 160,
    paddingVertical: 0,
  },
  input: {
    minHeight: 160,
    fontSize: 16,
    textAlignVertical: "top",
    color: "#3a0a4d",
  },
  placeholder: { fontSize: 16, color: "#999", fontStyle: "italic" },
  headerBtn: { color: "#ffffff", fontSize: 16 },
  headerBtnBold: { fontWeight: "bold" },
  headerBtnDisabled: { color: "#ddc4ec" },
});
