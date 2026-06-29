import { Stack, router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";

export default function CreateNoteScreen() {
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

  // Enregistrer : ferme aussi pour l'instant
  const handleSave = () => {
    close();
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.container}
    >
      <Stack.Screen
        options={{
          title: "Nouvelle note",
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
  input: {
    minHeight: 160,
    fontSize: 16,
    textAlignVertical: "top",
    color: "#3a0a4d",
  },
  headerBtn: { color: "#ffffff", fontSize: 16 },
  headerBtnBold: { fontWeight: "bold" },
});
