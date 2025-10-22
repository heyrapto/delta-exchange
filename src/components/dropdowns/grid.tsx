import { createPortal } from 'react-dom';
import { useEffect, useState, useRef } from 'react';

interface ColumnItem {
  id: string;
  label: string;
  checked: boolean;
  hasDragHandle?: boolean;
  nested?: ColumnItem[];
}

const defaultColumns: ColumnItem[] = [
  {
    id: 'oi',
    label: 'OI',
    checked: true,
    hasDragHandle: true,
  },
  {
    id: 'bid-ask',
    label: 'Bid/ Ask',
    checked: true,
    hasDragHandle: true,
    nested: [
      { id: 'qty', label: 'Qty', checked: true },
      { id: 'mark', label: 'Mark', checked: true },
    ]
  },
  {
    id: 'delta',
    label: 'Delta',
    checked: true,
    hasDragHandle: true,
  },
  {
    id: 'volume',
    label: 'Volume',
    checked: true,
    hasDragHandle: true,
  },
  {
    id: 'oi-chg',
    label: '6H OI Chg.',
    checked: true,
    hasDragHandle: true,
  },
  {
    id: 'pos',
    label: 'POS',
    checked: true,
    hasDragHandle: true,
  },
];

const defaultColumnsRight: ColumnItem[] = [
  {
    id: 'gamma',
    label: 'Gamma',
    checked: true,
    hasDragHandle: true,
  },
  {
    id: 'vega',
    label: 'Vega',
    checked: true,
    hasDragHandle: true,
  },
  {
    id: 'theta',
    label: 'Theta',
    checked: true,
    hasDragHandle: true,
  },
  {
    id: '24hr-chg',
    label: '24hr Chg.',
    checked: true,
    hasDragHandle: true,
  },
  {
    id: 'last',
    label: 'Last',
    checked: true,
    hasDragHandle: true,
  },
  {
    id: 'open',
    label: 'Open',
    checked: true,
    hasDragHandle: true,
  },
  {
    id: 'high',
    label: 'High',
    checked: true,
    hasDragHandle: true,
  },
  {
    id: 'low',
    label: 'Low',
    checked: true,
    hasDragHandle: true,
  },
];

export const GridDropdown = ({ isOpen, onClose, buttonRef }: { 
  isOpen: boolean; 
  onClose: () => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, right: 0 });
  const [leftColumns, setLeftColumns] = useState(defaultColumns);
  const [rightColumns, setRightColumns] = useState(defaultColumnsRight);

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

  const handleToggle = (columnId: string, isLeft: boolean, parentId?: string) => {
    const updateColumn = (columns: ColumnItem[]): ColumnItem[] => {
      return columns.map(col => {
        if (parentId && col.id === parentId && col.nested) {
          return {
            ...col,
            nested: col.nested.map(nested => 
              nested.id === columnId ? { ...nested, checked: !nested.checked } : nested
            )
          };
        }
        if (col.id === columnId) {
          return { ...col, checked: !col.checked };
        }
        return col;
      });
    };

    if (isLeft) {
      setLeftColumns(updateColumn(leftColumns));
    } else {
      setRightColumns(updateColumn(rightColumns));
    }
  };

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
        onChange={() => handleToggle(item.id, isLeft, parentId)}
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