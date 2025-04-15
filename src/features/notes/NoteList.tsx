import React from 'react';
import NoteCard, { Note } from '../../components/NoteCard';

interface NoteListProps {
  notes: Note[];
  onNoteSelect: (id: string) => void;
  onNoteDelete: (id: string) => void;
  onNotePin: (id: string) => void;
  pinnedNoteIds: string[];
  title?: string;
}

const NoteList: React.FC<NoteListProps> = ({
  notes,
  onNoteSelect,
  onNoteDelete,
  onNotePin,
  pinnedNoteIds,
  title = 'Notes'
}) => {
  const pinnedNotes = notes.filter(note => pinnedNoteIds.includes(note.id));
  const unpinnedNotes = notes.filter(note => !pinnedNoteIds.includes(note.id));
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
      
      {pinnedNotes.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">PINNED</h3>
          {pinnedNotes.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              onClick={onNoteSelect}
              onDelete={onNoteDelete}
              onPin={onNotePin}
              isPinned={true}
            />
          ))}
        </div>
      )}
      
      {unpinnedNotes.length > 0 ? (
        <div>
          {pinnedNotes.length > 0 && (
            <h3 className="text-sm font-medium text-gray-500 mb-2">OTHERS</h3>
          )}
          
          {unpinnedNotes.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              onClick={onNoteSelect}
              onDelete={onNoteDelete}
              onPin={onNotePin}
              isPinned={false}
            />
          ))}
        </div>
      ) : (
        unpinnedNotes.length === 0 && pinnedNotes.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <p>No notes in this folder yet.</p>
            <p className="mt-2">Create a new note to get started!</p>
          </div>
        )
      )}
    </div>
  );
};

export default NoteList;