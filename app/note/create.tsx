import { Stack, router } from "expo-router";
import { useState } from "react";
import { useAddNote } from "../../hooks/notes";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";

export default function CreateNoteScreen() {
  const addNote = useAddNote();
  const [title, setTitle] = useState("Nouvelle note");
  const [text, setText] = useState("");

  const close = () => router.back();

  // Bonus : confirmation si du texte a été saisi avant de fermer
  const handleCancel = () => {
    if (text.trim().length === 0) {
      close();
      return;
    }
    Alert.alert(
      "Abandonner la note ?",
      "Le texte saisi sera perdu.",
      [
        { text: "Continuer l'édition", style: "cancel" },
        { text: "Abandonner", style: "destructive", onPress: close },
      ]
    );
  };

  const handleSave = () => {
    addNote.mutate(
      { title, text },
      {
        onSuccess: close,
        onError: (error) =>
          Alert.alert("Enregistrement échoué", error.message),
      }
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
            <Pressable onPress={handleCancel} hitSlop={12}>
              <Text style={styles.headerBtn}>Annuler</Text>
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={handleSave} hitSlop={12}>
              <Text style={[styles.headerBtn, styles.headerBtnBold]}>
                Enregistrer
              </Text>
            </Pressable>
          ),
        }}
      />

      <TextInput
        placeholder="Écris ta note…"
        value={text}
        onChangeText={setText}
        multiline
        autoFocus
        style={styles.input}
      />
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
  headerBtn: { color: "#ffffff", fontSize: 16 },
  headerBtnBold: { fontWeight: "bold" },
});
