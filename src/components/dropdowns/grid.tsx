import { createPortal } from 'react-dom';
import { useEffect, useState, useRef } from 'react';
import { useGridStore } from '@/store/grid-store';

interface ColumnItem {
  id: string;
  label: string;
  checked: boolean;
  hasDragHandle?: boolean;
  nested?: ColumnItem[];
}


export const GridDropdown = ({ isOpen, onClose, buttonRef }: { 
  isOpen: boolean; 
  onClose: () => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, right: 0 });
  const { leftColumns, rightColumns, toggleColumn } = useGridStore();

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right
      });
    }
  }, [isOpen, buttonRef]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose, buttonRef]);


  const renderColumnItem = (item: ColumnItem, isLeft: boolean, isNested: boolean = false, parentId?: string) => (
    <label 
      key={item.id}
      className={`flex items-center gap-3 text-sm text-gray-300 cursor-pointer hover:bg-gray-800/50 py-2 rounded transition-colors ${
        isNested ? 'px-4' : 'px-2 -mx-2'
      }`}
    >
      <input 
        type="checkbox" 
        checked={item.checked}
        onChange={() => toggleColumn(item.id, isLeft, parentId)}
        className="w-4 h-4 rounded border-gray-600 bg-transparent text-[#ADFF2F] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#ADFF2F]" 
      />
      {item.hasDragHandle && <span className="text-gray-900 text-xs">⋮⋮</span>}
      <span className="text-gray-700">{item.label}</span>
    </label>
  );

  const renderColumn = (columns: ColumnItem[], isLeft: boolean) => (
    <div className="px-4 space-y-0">
      {columns.map(item => (
        <div key={item.id}>
          {renderColumnItem(item, isLeft)}
          {item.nested && item.nested.length > 0 && (
            <div className="bg-gray-300/70 rounded py-1 my-1">
              {item.nested.map(nested => renderColumnItem(nested, isLeft, true, item.id))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  if (!isOpen) return null;

  return createPortal(
    <div 
      ref={dropdownRef}
      className="fixed bg-white border border-gray-300 rounded shadow-2xl min-w-[380px] z-[9999] py-3"
      style={{
        top: `${position.top}px`,
        right: `${position.right}px`,
      }}
    >
      <div className="grid grid-cols-2 gap-0 divide-x divide-gray-300">
        {renderColumn(leftColumns, true)}
        {renderColumn(rightColumns, false)}
      </div>
    </div>,
    document.body
  );
};