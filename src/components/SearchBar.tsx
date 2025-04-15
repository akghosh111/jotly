import React, { useState, useRef, useEffect } from 'react';
import { Note } from './NoteCard';
import { useDebounce } from '../hooks/useDebounce';

interface SearchBarProps {
  notes: Note[];
  onNoteSelect: (id: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ notes, onNoteSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [searchResults, setSearchResults] = useState<Note[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Handle clicks outside of search component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Search logic
  useEffect(() => {
    if (debouncedSearchTerm) {
      const term = debouncedSearchTerm.toLowerCase();
      const results = notes.filter(note => 
        note.title.toLowerCase().includes(term) || 
        note.content.toLowerCase().includes(term)
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchTerm, notes]);
  
  return (
    <div className="relative w-full" ref={searchRef}>
      <div className={`
        relative flex items-center w-full bg-white rounded-full
        shadow-sm transition-all duration-200 border
        ${isFocused ? 'border-blue-300 shadow-md' : 'border-gray-200'}
      `}>
        <div className="pl-4 py-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        
        <input
          type="text"
          placeholder="Search notes"
          className="w-full py-2 px-2 bg-transparent outline-none text-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
      </div>
      
      {/* Search results dropdown */}
      {isFocused && searchTerm && (
        <div className="absolute top-full left-0 right-0 bg-white mt-2 rounded-lg shadow-lg max-h-72 overflow-y-auto z-10 border border-gray-200">
          {searchResults.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No results found</div>
          ) : (
            <ul>
              {searchResults.map(note => (
                <li 
                  key={note.id} 
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                  onClick={() => {
                    onNoteSelect(note.id);
                    setIsFocused(false);
                    setSearchTerm('');
                  }}
                >
                  <div className="font-medium">{note.title}</div>
                  <div className="text-sm text-gray-600 truncate">{note.content.substring(0, 60)}...</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;