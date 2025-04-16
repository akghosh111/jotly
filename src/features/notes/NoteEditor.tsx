import React, { useState, useEffect } from 'react';
import { Note } from '../../components/NoteCard';

interface NoteEditorProps {
  note: Note | null;
  onSave: (updatedNote: Note) => void;
  onClose: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave, onClose }) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  if (!note) {
    return (
      <div className="p-4 text-gray-500">
        <p>No note selected.</p>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    onSave({
      ...note,
      title: title.trim() || 'Untitled',
      content,
    });
    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 300);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-white/80 backdrop-blur-md py-2 -mx-6 px-6 border-b border-white/20">
        <div className="flex-1 mr-4">
          <input
            className="text-2xl font-bold bg-transparent border-b-2 border-transparent hover:border-gray-200 focus:border-blue-400 focus:outline-none w-full text-gray-800 transition-all duration-300"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
          />
          <div className="text-sm text-gray-500 mt-1">
            Last updated: {new Date(note.updatedAt).toLocaleString()}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 bg-white/50 hover:bg-white/70 backdrop-blur-sm text-gray-700 transition-all duration-300 hover:shadow-md hover:scale-105 active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`
              px-4 py-2 text-sm rounded-lg bg-blue-500/80 hover:bg-blue-600/80 backdrop-blur-sm 
              text-white transition-all duration-300 border border-white/20 
              hover:shadow-md hover:scale-105 active:scale-95
              flex items-center gap-2
              ${isSaving ? 'opacity-75 cursor-not-allowed' : ''}
            `}
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>

      <textarea
        className="w-full h-[calc(100vh-300px)] p-4 bg-white/50 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none text-gray-800 placeholder-gray-500 leading-relaxed"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your note here..."
      />
    </div>
  );
};

export default NoteEditor;
