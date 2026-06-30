import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { deleteToken, getToken, setToken } from "../utils/secureToken";

export default function TokenExample() {
  const [input, setInput] = useState("");
  const [stored, setStored] = useState<string | null>(null);

  async function handleSave() {
    await setToken(input);
    setInput("");
  }

  async function handleLoad() {
    const token = await getToken();
    setStored(token);
  }

  async function handleClear() {
    await deleteToken();
    setStored(null);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SecureStore token test</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter a token"
        value={input}
        onChangeText={setInput}
        autoCapitalize="none"
      />

      <View style={styles.row}>
        <Button title="Save" onPress={handleSave} color="#922dba" />
        <Button title="Load" onPress={handleLoad} color="#922dba" />
        <Button title="Clear" onPress={handleClear} color="#922dba" />
      </View>

      <Text style={styles.result}>
        Stored: {stored ?? "(none)"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 6,
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  result: {
    fontSize: 16,
  },
});
