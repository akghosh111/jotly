import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Folder, FolderColor } from '../../components/FolderItem';
import { getFolders, saveFolders, getActiveFolder, saveActiveFolder } from '../../utils/storage';

interface FolderState {
  folders: Folder[];
  activeFolder: string | null;
  setActiveFolder: (id: string) => void;
  createFolder: (name?: string) => Folder;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;
}

// Default folder icons and colors
const folderIcons = ['📁', '📓', '📔', '📕', '📗', '📘', '📙'];
const folderColors: FolderColor[] = ['yellow', 'blue', 'green', 'rose', 'purple'];

export const useFolders = create<FolderState>((set) => ({
  folders: getFolders(),
  activeFolder: getActiveFolder(),
  
  setActiveFolder: (id: string) => {
    set({ activeFolder: id });
    saveActiveFolder(id);
  },
  
  createFolder: (name = 'New Folder') => {
    const randomIcon = folderIcons[Math.floor(Math.random() * folderIcons.length)];
    const randomColor = folderColors[Math.floor(Math.random() * folderColors.length)];
    
    const newFolder: Folder = {
      id: uuidv4(),
      name,
      icon: randomIcon,
      color: randomColor
    };
    
    set(state => {
      const updatedFolders = [...state.folders, newFolder];
      saveFolders(updatedFolders);
      return { folders: updatedFolders, activeFolder: newFolder.id };
    });
    
    saveActiveFolder(newFolder.id);
    return newFolder;
  },
  
  updateFolder: (id: string, updates: Partial<Folder>) => {
    set(state => {
      const updatedFolders = state.folders.map(folder =>
        folder.id === id ? { ...folder, ...updates } : folder
      );
      saveFolders(updatedFolders);
      return { folders: updatedFolders };
    });
  },
  
  deleteFolder: (id: string) => {
    set(state => {
      const updatedFolders = state.folders.filter(folder => folder.id !== id);
      saveFolders(updatedFolders);
      
      // If the active folder is being deleted, set a new active folder
      if (state.activeFolder === id) {
        const newActive = updatedFolders.length > 0 ? updatedFolders[0].id : null;
        saveActiveFolder(newActive);
        return { folders: updatedFolders, activeFolder: newActive };
      }
      
      return { folders: updatedFolders };
    });
  }
}));