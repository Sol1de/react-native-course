import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const STORAGE_KEY = "@notes";

export type Note = {
  id: string;
  title: string;
  text: string;
  updatedAt?: number;
};

type NotesContextValue = {
  notes: Note[];
  addNote: (note: { title: string; text: string }) => Note;
  getNote: (id: string) => Note | undefined;
  getNoteById: (id: string) => Note | undefined;
  updateNote: (id: string, data: Partial<Pick<Note, "title" | "text">>) => void;
  deleteNote: (id: string) => void;
};

const NotesContext = createContext<NotesContextValue | null>(null);

const INITIAL_NOTES: Note[] = [
  { id: "1", title: "Liste de courses", text: "" },
  { id: "2", title: "Idées d'app", text: "" },
  { id: "3", title: "Notes de réunion", text: "" },
];

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [isReady, setIsReady] = useState<boolean>(false);

  const loadNotes = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        setNotes(JSON.parse(raw) as Note[]);
      }
    } finally {
      setIsReady(true);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const saveNotes = (next: Note[]) => {
    setNotes(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addNote: NotesContextValue["addNote"] = ({ title, text }) => {
    const note: Note = {
      id: String(Date.now()),
      title: title.trim() || "Sans titre",
      text,
    };
    saveNotes([note, ...notes]);
    return note;
  };

  const getNote: NotesContextValue["getNote"] = (id) =>
    notes.find((n) => n.id === id);

  const getNoteById: NotesContextValue["getNoteById"] = (id) =>
    notes.find((n) => n.id === id);

  const updateNote: NotesContextValue["updateNote"] = (id, data) =>
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, ...data, updatedAt: Date.now() } : n
      )
    );

  const deleteNote: NotesContextValue["deleteNote"] = (id) =>
    saveNotes(notes.filter((n) => n.id !== id));

  if (!isReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NotesContext.Provider
      value={{
        notes,
        addNote,
        getNote,
        getNoteById,
        updateNote,
        deleteNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export function useNote() {
  const ctx = useContext(NotesContext);
  if (!ctx) {
    throw new Error("useNote must be used within a NotesProvider");
  }
  return ctx;
}
