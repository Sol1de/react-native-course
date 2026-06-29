import { Link } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

const NOTES = [
  { id: "1", title: "Liste de courses" },
  { id: "2", title: "Idées d'app" },
  { id: "3", title: "Notes de réunion" },
];

export default function NotesScreen() {
  return (
    <FlatList
      data={NOTES}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.list}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Link href={`/note/${item.id}`} asChild>
          <Pressable style={styles.row}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.meta}>#{item.id}</Text>
          </Pressable>
        </Link>
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
  list: { padding: 16, gap: 12 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderCurve: "continuous",
    backgroundColor: "#f3e8fa",
  },
  title: { fontSize: 16, fontWeight: "600", color: "#3a0a4d" },
  meta: { fontSize: 14, color: "#922dba" },
  empty: { padding: 32, alignItems: "center" },
});
