import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useNote } from "../../contexts/notes";

export default function NotesScreen() {
  const { notes, deleteNote } = useNote();

  const confirmDelete = (id: string, title: string) => {
    Alert.alert("Supprimer la note", `Supprimer « ${title} » ?`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => deleteNote(id),
      },
    ]);
  };

  return (
    <FlatList
      data={notes}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.list}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListHeaderComponent={
        <Text style={styles.header}>
          Mes notes ({notes.length})
        </Text>
      }
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Link href={`/note/${item.id}`} asChild>
            <Pressable style={styles.rowMain}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.meta}>#{item.id}</Text>
            </Pressable>
          </Link>
          <Pressable
            onPress={() => confirmDelete(item.id, item.title)}
            hitSlop={12}
            style={styles.deleteBtn}
          >
            <Ionicons name="trash-outline" size={20} color="#922dba" />
          </Pressable>
        </View>
      )}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text>Aucune note. Touche + pour en créer une.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3a0a4d",
    marginBottom: 12,
  },
  separator: { height: 12 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderCurve: "continuous",
    backgroundColor: "#f3e8fa",
  },
  rowMain: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  title: { fontSize: 16, fontWeight: "600", color: "#3a0a4d" },
  meta: { fontSize: 14, color: "#922dba" },
  deleteBtn: { paddingHorizontal: 16, paddingVertical: 16 },
  empty: { padding: 32, alignItems: "center" },
});
