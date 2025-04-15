import React, { useState } from 'react';
import { Pencil } from 'lucide-react'; // or use any edit icon you prefer

export type FolderColor = 'yellow' | 'blue' | 'green' | 'rose' | 'purple';

export interface Folder {
  id: string;
  name: string;
  icon: string;
  color: FolderColor;
}

interface FolderItemProps {
  folder: Folder;
  isActive: boolean;
  onClick: (id: string) => void;
  onRename?: (id: string, newName: string) => void; // made optional
}

const colorMap: Record<FolderColor, string> = {
  yellow: 'bg-amber-200 hover:bg-amber-300',
  blue: 'bg-blue-200 hover:bg-blue-300',
  green: 'bg-emerald-200 hover:bg-emerald-300',
  rose: 'bg-rose-200 hover:bg-rose-300',
  purple: 'bg-purple-200 hover:bg-purple-300',
};

const FolderItem: React.FC<FolderItemProps> = ({
  folder,
  isActive,
  onClick,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(folder.name);
  const bgColorClass = colorMap[folder.color];

  const handleRename = () => {
    if (editedName.trim() && editedName !== folder.name && onRename) {
      onRename(folder.id, editedName.trim());
    }
    setIsEditing(false);
  };

  return (
    <div
      className={`
        transition-all duration-200 ease-in-out rounded-lg p-3 mb-2 cursor-pointer 
        ${bgColorClass}
        ${isActive ? 'shadow-md' : 'hover:shadow-sm'}
        transform hover:-translate-y-1 hover:shadow-md
      `}
      onClick={() => !isEditing && onClick(folder.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{folder.icon}</span>

          {isEditing ? (
            <input
              className="font-medium bg-transparent border-b border-gray-500 focus:outline-none"
              value={editedName}
              autoFocus
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRename();
                } else if (e.key === 'Escape') {
                  setIsEditing(false);
                  setEditedName(folder.name);
                }
              }}
            />
          ) : (
            <span className="font-medium">{folder.name}</span>
          )}
        </div>

        {/* ✏️ Edit Icon */}
        {onRename && !isEditing && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent parent click
              setIsEditing(true);
            }}
            className="p-1 text-gray-600 hover:text-gray-900"
            title="Rename Folder"
          >
            <Pencil size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default FolderItem;
