import React from 'react';
import SearchBar from './SearchBar';
import { Note } from './NoteCard';

interface HeaderProps {
  onCreateNote: () => void;
  notes: Note[];
  onNoteSelect: (id: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onCreateNote, notes, onNoteSelect }) => {
  return (
    <header className="sticky top-0 z-10 py-4 bg-gradient-to-r from-blue-100 to-blue-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800">
              Organize your notes
            </h1>
            <p className="text-gray-600">
              with color-coded folders and quick search
            </p>
          </div>
          
          <div className="flex space-x-4 items-center w-full md:w-auto">
            <div className="w-full md:w-64">
              <SearchBar notes={notes} onNoteSelect={onNoteSelect} />
            </div>
            
            <button
              onClick={onCreateNote}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-sm transition-colors duration-200 flex items-center"
            >
              <span className="mr-1">+</span>
              <span>New Note</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;