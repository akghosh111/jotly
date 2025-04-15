import { Note } from '../components/NoteCard';
import { Folder } from '../components/FolderItem';

// Local storage keys
const FOLDERS_KEY = 'notes_app_folders';
const NOTES_KEY = 'notes_app_notes';
const ACTIVE_FOLDER_KEY = 'notes_app_active_folder';
const ACTIVE_NOTE_KEY = 'notes_app_active_note';
const PINNED_NOTES_KEY = 'notes_app_pinned_notes';

// Folder Storage
export const getFolders = (): Folder[] => {
  const storedFolders = localStorage.getItem(FOLDERS_KEY);
  if (storedFolders) {
    return JSON.parse(storedFolders);
  }
  
  // Default folders if none exist
  const defaultFolders: Folder[] = [
    { id: 'work', name: 'Work', icon: '💼', color: 'yellow' },
    { id: 'health', name: 'Health', icon: '🌱', color: 'green' },
    { id: 'ideas', name: 'Ideas', icon: '💡', color: 'rose' },
    { id: 'learning', name: 'Learning', icon: '📚', color: 'purple' }
  ];
  
  localStorage.setItem(FOLDERS_KEY, JSON.stringify(defaultFolders));
  return defaultFolders;
};

export const saveFolders = (folders: Folder[]): void => {
  localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
};

// Notes Storage
export const getNotes = (): Note[] => {
  const storedNotes = localStorage.getItem(NOTES_KEY);
  if (storedNotes) {
    return JSON.parse(storedNotes, (key, value) => {
      // Convert string date values back to Date objects
      if (key === 'createdAt' || key === 'updatedAt') {
        return new Date(value);
      }
      return value;
    });
  }
  
  // Default notes if none exist
  const defaultNotes: Note[] = [
    {
      id: 'note1',
      title: 'Client Meeting Notes',
      content: 'Talked about the new piking model...',
      createdAt: new Date('2023-04-23T10:00:00'),
      updatedAt: new Date('2023-04-23T10:00:00'),
      folderId: 'work',
    },
    {
      id: 'note2',
      title: 'Startup Idea - AI flashcards',
      content: 'An app that auto-generate flashcards',
      createdAt: new Date('2023-04-20T15:30:00'),
      updatedAt: new Date('2023-04-20T15:30:00'),
      folderId: 'ideas',
    }
  ];
  
  localStorage.setItem(NOTES_KEY, JSON.stringify(defaultNotes));
  return defaultNotes;
};

export const saveNotes = (notes: Note[]): void => {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
};

// Active States
export const getActiveFolder = (): string | null => {
  return localStorage.getItem(ACTIVE_FOLDER_KEY);
};

export const saveActiveFolder = (folderId: string | null): void => {
  if (folderId) {
    localStorage.setItem(ACTIVE_FOLDER_KEY, folderId);
  } else {
    localStorage.removeItem(ACTIVE_FOLDER_KEY);
  }
};

export const getActiveNote = (): string | null => {
  return localStorage.getItem(ACTIVE_NOTE_KEY);
};

export const saveActiveNote = (noteId: string | null): void => {
  if (noteId) {
    localStorage.setItem(ACTIVE_NOTE_KEY, noteId);
  } else {
    localStorage.removeItem(ACTIVE_NOTE_KEY);
  }
};

// Pinned Notes
export const getPinnedNotes = (): string[] => {
  const pinnedNotes = localStorage.getItem(PINNED_NOTES_KEY);
  if (pinnedNotes) {
    return JSON.parse(pinnedNotes);
  }
  return [];
};

export const savePinnedNotes = (noteIds: string[]): void => {
  localStorage.setItem(PINNED_NOTES_KEY, JSON.stringify(noteIds));
};