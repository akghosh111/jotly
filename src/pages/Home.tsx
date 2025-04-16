import React from 'react';
import Header from '../components/Header';
import FolderList from '../features/folders/FolderList';
import NoteList from '../features/notes/NoteList';
import NoteEditor from '../features/notes/NoteEditor';
import { useFolders } from '../features/folders/folderStore';
import { useNotes } from '../features/notes/noteStore';

const Home: React.FC = () => {
  const { 
    folders, 
    activeFolder, 
    setActiveFolder, 
    createFolder 
  } = useFolders();
  
  const { 
    notes, 
    filteredNotes, 
    activeNote, 
    setActiveNote, 
    createNote, 
    updateNote, 
    deleteNote, 
    togglePinNote, 
    pinnedNoteIds 
  } = useNotes();
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header 
        onCreateNote={() => {
          const newNote = createNote(activeFolder || folders[0]?.id || '');
          setActiveNote(newNote.id);
        }}
        notes={notes}
        onNoteSelect={(id) => setActiveNote(id)}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-200 bg-white overflow-y-auto">
          <FolderList
            folders={folders}
            activeFolderId={activeFolder}
            onFolderSelect={setActiveFolder}
            onCreateFolder={() => createFolder()}
          />
        </div>
        
        {/* Note List */}
        <div className="w-80 border-r border-gray-200 bg-white overflow-y-auto">
        <NoteList
            notes={filteredNotes ?? []} // fallback to an empty array
            onNoteSelect={setActiveNote}
            onNoteDelete={deleteNote}
            onNotePin={togglePinNote}
            pinnedNoteIds={pinnedNoteIds}
            title={folders.find(f => f.id === activeFolder)?.name || 'All Notes'}
        />

        </div>
        
        {/* Note Editor */}
        <div className="flex-1 overflow-hidden">
          <NoteEditor
            note={notes.find(n => n.id === activeNote) || null}
            onSave={updateNote}
            onClose={() => setActiveNote(null)}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;