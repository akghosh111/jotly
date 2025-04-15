import React from 'react';
import { useState } from 'react';
import FolderItem, { Folder } from '../../components/FolderItem';




interface FolderListProps {
  folders: Folder[];
  activeFolderId: string | null;
  onFolderSelect: (id: string) => void;
  onCreateFolder: () => void;
}

const FolderList: React.FC<FolderListProps> = ({
  folders,
  activeFolderId,
  onFolderSelect,
  onCreateFolder
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
          onRename={(id: string, newName: string) => {
            setFolders((prev: Folder[]) =>
              prev.map((f: Folder) =>
                f.id === id ? { ...f, name: newName } : f
              )
            );
          }}
          
          
        />
        
        ))}
      </div>
    </div>
  );
};

export default FolderList;