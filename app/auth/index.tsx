import { Stack } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../../lib/supabase";

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length >= 6 && !loading;

  const signIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (error) {
      Alert.alert("Connexion échouée", error.message);
      return;
    }
    Alert.alert("Connecté", "Bienvenue !");
  };

  const signUp = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (error) {
      Alert.alert("Inscription échouée", error.message);
      return;
    }

    if (!data.session) {
      Alert.alert(
        "Vérifie tes emails",
        "Compte créé. Confirme ton adresse via le lien reçu par email, puis connecte-toi."
      );
      return;
    }
    Alert.alert("Compte créé", "Tu es connecté !");
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Stack.Screen options={{ title: "Connexion" }} />
      <View style={styles.container}>
        <Text style={styles.heading}>Notes</Text>
        <Text style={styles.subtitle}>Connecte-toi ou crée un compte</Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#b79bc7"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Mot de passe (min. 6 caractères)"
          placeholderTextColor="#b79bc7"
          autoCapitalize="none"
          secureTextEntry
          style={styles.input}
        />

        <Pressable
          onPress={signIn}
          disabled={!canSubmit}
          style={[styles.btn, styles.btnPrimary, !canSubmit && styles.btnDisabled]}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.btnPrimaryText}>Se connecter</Text>
          )}
        </Pressable>

        <Pressable
          onPress={signUp}
          disabled={!canSubmit}
          style={[styles.btn, styles.btnSecondary, !canSubmit && styles.btnDisabled]}
        >
          <Text style={styles.btnSecondaryText}>Créer un compte</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    gap: 12,
    backgroundColor: "#ffffff",
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#3a0a4d",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#922dba",
    textAlign: "center",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e3cdf0",
    borderRadius: 12,
    borderCurve: "continuous",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#3a0a4d",
    backgroundColor: "#faf5fd",
  },
  btn: {
    borderRadius: 12,
    borderCurve: "continuous",
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: { backgroundColor: "#922dba" },
  btnPrimaryText: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },
  btnSecondary: { backgroundColor: "#f3e8fa" },
  btnSecondaryText: { color: "#922dba", fontSize: 16, fontWeight: "600" },
  btnDisabled: { opacity: 0.5 },
});
