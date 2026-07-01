import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import LoadingScreen from "../../components/loadingScreen";
import {
  useDeleteNote,
  useNotes,
  useTogglePin,
} from "../../hooks/notes";

export default function NotesScreen() {
  const { data: notes = [], isLoading, refetch, isRefetching } = useNotes();
  const deleteNote = useDeleteNote();
  const togglePin = useTogglePin();
  const [onlyPinned, setOnlyPinned] = useState(false);

  const visible = useMemo(
    () => (onlyPinned ? notes.filter((n) => n.is_pinned) : notes),
    [notes, onlyPinned]
  );

  const confirmDelete = (id: string, title: string) => {
    Alert.alert("Supprimer la note", `Supprimer « ${title} » ?`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => deleteNote.mutate(id),
      },
    ]);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <FlatList
      data={visible}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.list}
      keyExtractor={(item) => item.id}
      refreshing={isRefetching}
      onRefresh={refetch}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListHeaderComponent={
        <View style={styles.headerRow}>
          <Text style={styles.header}>Mes notes ({visible.length})</Text>
          <View style={styles.filter}>
            <Text style={styles.filterLabel}>Épinglées</Text>
            <Switch
              value={onlyPinned}
              onValueChange={setOnlyPinned}
              trackColor={{ true: "#922dba" }}
            />
          </View>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Pressable
            onPress={() =>
              togglePin.mutate({ id: item.id, is_pinned: !item.is_pinned })
            }
            hitSlop={12}
            style={styles.pinBtn}
          >
            <Ionicons
              name={item.is_pinned ? "pin" : "pin-outline"}
              size={20}
              color={item.is_pinned ? "#922dba" : "#b79bc7"}
            />
          </Pressable>
          <Link href={`/note/${item.id}`} asChild>
            <Pressable style={styles.rowMain}>
              <Text style={styles.title}>{item.title}</Text>
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
          <Text>
            {onlyPinned
              ? "Aucune note épinglée."
              : "Aucune note. Touche + pour en créer une."}
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3a0a4d",
  },
  filter: { flexDirection: "row", alignItems: "center", gap: 6 },
  filterLabel: { fontSize: 14, color: "#922dba" },
  separator: { height: 12 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderCurve: "continuous",
    backgroundColor: "#f3e8fa",
  },
  pinBtn: { paddingLeft: 16, paddingVertical: 16 },
  rowMain: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  title: { fontSize: 16, fontWeight: "600", color: "#3a0a4d" },
  deleteBtn: { paddingHorizontal: 16, paddingVertical: 16 },
  empty: { padding: 32, alignItems: "center" },
});
