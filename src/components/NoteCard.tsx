import React from 'react';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  folderId: string;
}

interface NoteCardProps {
  note: Note;
  onClick: (id: string) => void;
  onDelete?: (id: string) => void;
  onPin?: (id: string) => void;
  isPinned?: boolean;
}

const NoteCard: React.FC<NoteCardProps> = ({ 
  note, 
  onClick, 
  onDelete, 
  onPin,
  isPinned = false
}) => {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  }).format(new Date(note.updatedAt));
  
  // Get preview text (first ~100 characters)
  const contentPreview = note.content.substring(0, 100) + (note.content.length > 100 ? '...' : '');
  
  return (
    <div 
      className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-all duration-200 mb-4 border border-gray-100"
      onClick={() => onClick(note.id)}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg text-gray-900">{note.title}</h3>
        
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onPin && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onPin(note.id);
              }}
              className="text-gray-500 hover:text-amber-500"
            >
              {isPinned ? '📌' : '📍'}
            </button>
          )}
          
          {onDelete && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              className="text-gray-500 hover:text-rose-500"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
      
      <p className="text-gray-600 mt-2 text-sm line-clamp-2">{contentPreview}</p>
      
      <div className="mt-3 text-xs text-gray-500">{formattedDate}</div>
    </div>
  );
};

export default NoteCard;