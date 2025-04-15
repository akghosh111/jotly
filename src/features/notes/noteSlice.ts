import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Note } from '../../components/NoteCard';
import { 
  getNotes, 
  saveNotes, 
  getActiveNote, 
  saveActiveNote,
  getPinnedNotes,
  savePinnedNotes
} from '../../utils/storage';

interface NoteState {
  notes: Note[];
  activeNote: string | null;
  filteredNotes: Note[];
  pinnedNoteIds: string[];
  
  setActiveNote: (id: string | null) => void;
  createNote: (folderId: string) => Note;
  updateNote: (updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;
  filterNotesByFolder: (folderId: string | null) => void;
  searchNotes: (query: string) => Note[];
}

export const useNotes = create<NoteState>((set, get) => ({
  notes: getNotes(),
  activeNote: getActiveNote(),
  filteredNotes: getNotes(),
  pinnedNoteIds: getPinnedNotes(),
  
  setActiveNote: (id: string | null) => {
    set({ activeNote: id });
    saveActiveNote(id);
  },
  
  createNote: (folderId: string) => {
    const newNote: Note = {
      id: uuidv4(),
      title: 'New Note',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      folderId
    };
    
    set(state => {
      const updatedNotes = [...state.notes, newNote];
      saveNotes(updatedNotes);
      
      // Update filtered notes if they're in the same folder
      const updatedFiltered = state.filteredNotes.some(note => note.folderId === folderId) 
        ? [...state.filteredNotes, newNote] 
        : state.filteredNotes;
        
      return { 
        notes: updatedNotes, 
        filteredNotes: updatedFiltered
      };
    });
    
    return newNote;
  },
  
  updateNote: (updates: Partial<Note>) => {
    if (!updates.id) return;
    
    set(state => {
      const updatedNotes = state.notes.map(note => 
        note.id === updates.id 
          ? { ...note, ...updates, updatedAt: new Date() } 
          : note
      );
      
      const updatedFiltered = state.filteredNotes.map(note => 
        note.id === updates.id 
          ? { ...note, ...updates, updatedAt: new Date() } 
          : note
      );
      
      saveNotes(updatedNotes);
      
      return { 
        notes: updatedNotes,
        filteredNotes: updatedFiltered
      };
    });
  },
  
  deleteNote: (id: string) => {
    set(state => {
      const updatedNotes = state.notes.filter(note => note.id !== id);
      const updatedFiltered = state.filteredNotes.filter(note => note.id !== id);
      const updatedPinned = state.pinnedNoteIds.filter(pinnedId => pinnedId !== id);
      
      saveNotes(updatedNotes);
      savePinnedNotes(updatedPinned);
      
      // If active note is deleted, clear it
      if (state.activeNote === id) {
        saveActiveNote(null);
        return { 
          notes: updatedNotes, 
          filteredNotes: updatedFiltered,
          pinnedNoteIds: updatedPinned,
          activeNote: null 
        };
      }
      
      return { 
        notes: updatedNotes, 
        filteredNotes: updatedFiltered,
        pinnedNoteIds: updatedPinned
      };
    });
  },
  
  togglePinNote: (id: string) => {
    set(state => {
      const isPinned = state.pinnedNoteIds.includes(id);
      let updatedPinned;
      
      if (isPinned) {
        updatedPinned = state.pinnedNoteIds.filter(pinnedId => pinnedId !== id);
      } else {
        updatedPinned = [...state.pinnedNoteIds, id];
      }
      
      savePinnedNotes(updatedPinned);
      return { pinnedNoteIds: updatedPinned };
    });
  },
  
  filterNotesByFolder: (folderId: string | null) => {
    set(state => {
      if (!folderId) {
        return { filteredNotes: state.notes };
      }
      
      const filtered = state.notes.filter(note => note.folderId === folderId);
      return { filteredNotes: filtered };
    });
  },
  
  searchNotes: (query: string) => {
    const { notes } = get();
    const lowerQuery = query.toLowerCase();
    
    if (!query) return notes;
    
    return notes.filter(note => 
      note.title.toLowerCase().includes(lowerQuery) || 
      note.content.toLowerCase().includes(lowerQuery)
    );
  }
}));