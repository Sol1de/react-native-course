import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

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

  const addNote: NotesContextValue["addNote"] = ({ title, text }) => {
    const note: Note = {
      id: String(Date.now()),
      title: title.trim() || "Sans titre",
      text,
    };
    setNotes((prev) => [note, ...prev]);
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
    setNotes((prev) => prev.filter((n) => n.id !== id));

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

export function useNote() {
  const ctx = useContext(NotesContext);
  if (!ctx) {
    throw new Error("useNote must be used within a NotesProvider");
  }
  return ctx;
}
