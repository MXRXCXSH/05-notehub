import css from './NoteList.module.css';
import type { Note } from '../../types/note';
import { deleteNote } from '../../services/noteService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface NotesListProps {
  notes: Note[];
}

function NoteList({ notes }: NotesListProps) {
  const queryClient = useQueryClient();

  const deleteNoteM = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: error => {
      console.log(error);
    },
  });

  if (!notes.length) return null;

  return (
    <ul className={css.list}>
      {notes.map(note => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              onClick={() => deleteNoteM.mutate(note.id)}
              className={css.button}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
export default NoteList;
