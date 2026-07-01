import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export type Note = {
  id: string;
  title: string;
  text: string;
  is_pinned: boolean;
  created_at?: string;
  updated_at?: string;
};

export const NOTES_KEY = ["notes"] as const;
export const noteKey = (id: string) => ["notes", id] as const;

// Épinglées d'abord, puis les plus récemment modifiées.
export function sortNotes(a: Note, b: Note) {
  if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
  return (b.updated_at ?? "").localeCompare(a.updated_at ?? "");
}

export function useNotes() {
  return useQuery({
    queryKey: NOTES_KEY,
    queryFn: async (): Promise<Note[]> => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("is_pinned", { ascending: false })
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useNote(id: string) {
  return useQuery({
    queryKey: noteKey(id),
    enabled: !!id,
    queryFn: async (): Promise<Note | null> => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useAddNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { title: string; text: string }): Promise<Note> => {
      const { data, error } = await supabase
        .from("notes")
        .insert({
          title: input.title.trim() || "Sans titre",
          text: input.text,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;
      return data as Note;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: NOTES_KEY }),
  });
}

export function useUpdateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...patch
    }: { id: string } & Partial<Pick<Note, "title" | "text" | "is_pinned">>): Promise<Note> => {
      const { data, error } = await supabase
        .from("notes")
        .update({ ...patch, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Note;
    },
    onSuccess: (row) => {
      qc.setQueryData(noteKey(row.id), row);
      qc.invalidateQueries({ queryKey: NOTES_KEY });
    },
  });
}

export function useDeleteNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: NOTES_KEY }),
  });
}

// Épingler / désépingler avec mise à jour optimistic + rollback.
export function useTogglePin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      is_pinned,
    }: {
      id: string;
      is_pinned: boolean;
    }): Promise<Note> => {
      const { data, error } = await supabase
        .from("notes")
        .update({ is_pinned, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Note;
    },
    onMutate: async ({ id, is_pinned }) => {
      await qc.cancelQueries({ queryKey: NOTES_KEY });
      const previous = qc.getQueryData<Note[]>(NOTES_KEY);
      qc.setQueryData<Note[]>(NOTES_KEY, (old) =>
        (old ?? [])
          .map((n) => (n.id === id ? { ...n, is_pinned } : n))
          .sort(sortNotes)
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(NOTES_KEY, ctx.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: NOTES_KEY }),
  });
}
