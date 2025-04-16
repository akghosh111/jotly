import React from 'react';
import FolderItem, { Folder } from '../../components/FolderItem';

interface FolderListProps {
  folders: Folder[];
  activeFolderId: string | null;
  onFolderSelect: (id: string) => void;
  onCreateFolder: () => void;
  onUpdateFolder?: (id: string, updates: Partial<Folder>) => void;
}

const FolderList: React.FC<FolderListProps> = ({
  folders,
  activeFolderId,
  onFolderSelect,
  onCreateFolder,
  onUpdateFolder
}) => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Folders</h2>
        <button
          onClick={onCreateFolder}
          className="text-gray-600 hover:text-blue-500 transition-colors"
        >
          <span className="text-lg">+</span>
        </button>
      </div>
      
      <div className="space-y-2">
        {folders.map((folder) => (
          <FolderItem
            key={folder.id}
            folder={folder}
            isActive={activeFolderId === folder.id}
            onClick={onFolderSelect}
            onRename={onUpdateFolder ? (id: string, newName: string) => {
              onUpdateFolder(id, { name: newName });
            } : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default FolderList;