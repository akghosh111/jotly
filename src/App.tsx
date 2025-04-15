import React, { useEffect, useState } from 'react';
import { useFolders } from './features/folders/folderStore';
import { useNotes } from './features/notes/noteStore';
import { useDebounce } from './hooks/useDebounce';
import bgImage from './assets/bg.png';
import NoteEditor from './features/notes/NoteEditor';
import { FolderColor } from './components/FolderItem';

const FOLDER_COLORS: { color: FolderColor; label: string; bg: string; text: string }[] = [
  { color: 'yellow', label: 'Yellow', bg: 'bg-yellow-100', text: 'text-amber-600' },
  { color: 'blue', label: 'Blue', bg: 'bg-blue-100', text: 'text-blue-600' },
  { color: 'green', label: 'Green', bg: 'bg-green-100', text: 'text-green-600' },
  { color: 'rose', label: 'Rose', bg: 'bg-red-100', text: 'text-red-600' },
  { color: 'purple', label: 'Purple', bg: 'bg-purple-100', text: 'text-purple-600' }
];

const App: React.FC = () => {
  const { 
    folders, 
    activeFolder, 
    setActiveFolder, 
    createFolder,
    updateFolder,
    deleteFolder 
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
    pinnedNoteIds,
    searchNotes,
    filterNotesByFolder 
  } = useNotes();

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [searchResults, setSearchResults] = useState(notes);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState('');
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);

  // Update filtered notes when active folder changes
  useEffect(() => {
    filterNotesByFolder(activeFolder);
  }, [activeFolder, filterNotesByFolder]);

  // Update search results when search term changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      setSearchResults(searchNotes(debouncedSearchTerm));
    } else {
      setSearchResults(filteredNotes);
    }
  }, [debouncedSearchTerm, searchNotes, filteredNotes]);

  const handleFolderNameEdit = (folder: { id: string; name: string }) => {
    setEditingFolderId(folder.id);
    setEditingFolderName(folder.name);
  };

  const handleFolderNameSave = () => {
    if (editingFolderId && editingFolderName.trim()) {
      updateFolder(editingFolderId, { name: editingFolderName.trim() });
      setEditingFolderId(null);
      setEditingFolderName('');
    }
  };
  
  return (
    <div className="min-h-screen font-sans antialiased" 
         style={{ 
           backgroundImage: `url(${bgImage})`,
           backgroundSize: 'cover',
           backgroundPosition: 'center'
         }}>
      <div className="container mx-auto px-4 py-8">
        {/* Branding */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-black tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 drop-shadow-sm font-serif">
              Jotly
            </span>
          </h1>
          <p className="text-gray-600 mt-1 text-sm tracking-wide uppercase">A Minimalistic Note Taking App</p>
        </div>

        <div className="bg-white/40 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-white/20 transition-all duration-500 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Folders Section */}
            <div className="md:col-span-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 tracking-tight">Folders</h2>
                <button
                  onClick={() => createFolder()}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-all duration-300 bg-white/50 hover:bg-white/70 rounded-full backdrop-blur-sm hover:shadow-md hover:scale-105 active:scale-95"
                  title="Create New Folder"
                >
                  <span className="text-2xl">+</span>
                </button>
              </div>
              <div className="space-y-3">
                {folders.map(folder => (
                  <div key={folder.id} className="relative group">
                    <button
                      onClick={() => setActiveFolder(folder.id)}
                      className={`
                        w-full text-left px-4 py-3 rounded-xl
                        ${folder.color === 'yellow' ? 'bg-yellow-100/70' : ''}
                        ${folder.color === 'blue' ? 'bg-blue-100/70' : ''}
                        ${folder.color === 'green' ? 'bg-green-100/70' : ''}
                        ${folder.color === 'rose' ? 'bg-red-100/70' : ''}
                        ${folder.color === 'purple' ? 'bg-purple-100/70' : ''}
                        backdrop-blur-sm
                        flex items-center gap-3
                        ${activeFolder === folder.id ? 'ring-2 ring-white/50 shadow-lg scale-102' : ''}
                        hover:shadow-md transition-all duration-300
                        group border border-white/20 hover:scale-102
                      `}
                    >
                      <span className={`
                        transition-transform duration-300 group-hover:scale-110
                        ${folder.color === 'yellow' ? 'text-amber-600' : ''}
                        ${folder.color === 'blue' ? 'text-blue-600' : ''}
                        ${folder.color === 'green' ? 'text-green-600' : ''}
                        ${folder.color === 'rose' ? 'text-red-600' : ''}
                        ${folder.color === 'purple' ? 'text-purple-600' : ''}
                      `}>{folder.icon}</span>
                      
                      {editingFolderId === folder.id ? (
                        <input
                          type="text"
                          value={editingFolderName}
                          onChange={(e) => setEditingFolderName(e.target.value)}
                          onBlur={handleFolderNameSave}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleFolderNameSave();
                            if (e.key === 'Escape') {
                              setEditingFolderId(null);
                              setEditingFolderName('');
                            }
                          }}
                          className="bg-transparent border-b border-gray-400 focus:border-blue-500 outline-none flex-1 text-gray-800"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span className="text-gray-800 font-medium">{folder.name}</span>
                      )}

                      {/* Folder Actions */}
                      <div className="ml-auto flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFolderNameEdit(folder);
                          }}
                          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-white/30 rounded-full transition-all duration-300 hover:scale-110"
                          title="Edit Folder Name"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowColorPicker(showColorPicker === folder.id ? null : folder.id);
                          }}
                          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-white/30 rounded-full transition-all duration-300 hover:scale-110"
                          title="Change Color"
                        >
                          🎨
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Are you sure you want to delete this folder?')) {
                              deleteFolder(folder.id);
                            }
                          }}
                          className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-white/30 rounded-full transition-all duration-300 hover:scale-110"
                          title="Delete Folder"
                        >
                          🗑️
                        </button>
                      </div>
                    </button>

                    {/* Color Picker Dropdown */}
                    {showColorPicker === folder.id && (
                      <div className="absolute right-0 mt-2 w-48 py-2 bg-white/70 backdrop-blur-md rounded-xl shadow-xl z-10 border border-white/20 animate-fade-in">
                        {FOLDER_COLORS.map(({ color, label, bg, text }) => (
                          <button
                            key={color}
                            onClick={(e) => {
                              e.stopPropagation();
                              updateFolder(folder.id, { color });
                              setShowColorPicker(null);
                            }}
                            className={`w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-white/50 transition-all duration-300 ${
                              folder.color === color ? 'bg-white/30' : ''
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-full ${bg}`}></span>
                            <span className="text-gray-800">{label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Notes Section */}
            <div className="md:col-span-2">
              <div className="mb-8">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search notes"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-12 rounded-xl bg-white/50 border border-white/20 backdrop-blur-sm focus:ring-2 focus:ring-blue-300 focus:border-transparent placeholder-gray-500 text-gray-800 transition-all duration-300"
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 transition-transform duration-300">
                    🔍
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 tracking-tight">
                  {activeFolder 
                    ? folders.find(f => f.id === activeFolder)?.name || 'Notes'
                    : 'All Notes'}
                </h2>
                <button
                  onClick={() => {
                    const newNote = createNote(activeFolder || folders[0]?.id);
                    setActiveNote(newNote.id);
                  }}
                  className="px-4 py-2 bg-blue-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-blue-600/80 transition-all duration-300 border border-white/20 hover:shadow-md hover:scale-105 active:scale-95"
                >
                  New Note
                </button>
              </div>

              <div className="space-y-4">
                {(searchTerm ? searchResults : filteredNotes).map(note => (
                  <div 
                    key={note.id}
                    onClick={() => setActiveNote(note.id)}
                    className="bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-white/20 hover:scale-101 group"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-800">{note.title}</h3>
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePinNote(note.id);
                          }}
                          className="p-1.5 text-gray-500 hover:text-amber-500 hover:bg-white/30 rounded-full transition-all duration-300 hover:scale-110"
                        >
                          {pinnedNoteIds.includes(note.id) ? '📌' : '📍'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNote(note.id);
                          }}
                          className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-white/30 rounded-full transition-all duration-300 hover:scale-110"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700 mt-2 line-clamp-2">{note.content}</p>
                    <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {(searchTerm ? searchResults : filteredNotes).length === 0 && (
                  <div className="text-center py-12 text-gray-600 bg-white/30 backdrop-blur-sm rounded-xl border border-white/20">
                    <p className="text-lg">No notes found</p>
                    <p className="mt-2 text-sm">Start writing your thoughts...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Note Editor Modal */}
      {activeNote && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl">
            <NoteEditor
              note={notes.find(n => n.id === activeNote) || null}
              folders={folders}
              onSave={updateNote}
              onClose={() => setActiveNote(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;