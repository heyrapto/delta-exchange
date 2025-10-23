import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface ColumnItem {
  id: string
  label: string
  checked: boolean
  hasDragHandle?: boolean
  nested?: ColumnItem[]
}

export interface GridState {
  leftColumns: ColumnItem[]
  rightColumns: ColumnItem[]
  
  // Actions
  setLeftColumns: (columns: ColumnItem[]) => void
  setRightColumns: (columns: ColumnItem[]) => void
  toggleColumn: (columnId: string, isLeft: boolean, parentId?: string) => void
  resetColumns: () => void
}

const defaultLeftColumns: ColumnItem[] = [
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
]

const defaultRightColumns: ColumnItem[] = [
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
]

export const useGridStore = create<GridState>()(
  devtools(
    (set, get) => ({
      // Initial state
      leftColumns: defaultLeftColumns,
      rightColumns: defaultRightColumns,

      // Actions
      setLeftColumns: (columns: ColumnItem[]) => {
        set({ leftColumns: columns })
      },

      setRightColumns: (columns: ColumnItem[]) => {
        set({ rightColumns: columns })
      },

      toggleColumn: (columnId: string, isLeft: boolean, parentId?: string) => {
        const updateColumn = (columns: ColumnItem[]): ColumnItem[] => {
          return columns.map(col => {
            if (parentId && col.id === parentId && col.nested) {
              return {
                ...col,
                nested: col.nested.map(nested => 
                  nested.id === columnId ? { ...nested, checked: !nested.checked } : nested
                )
              }
            }
            if (col.id === columnId) {
              return { ...col, checked: !col.checked }
            }
            return col
          })
        }

        const { leftColumns, rightColumns } = get()
        
        if (isLeft) {
          set({ leftColumns: updateColumn(leftColumns) })
        } else {
          set({ rightColumns: updateColumn(rightColumns) })
        }
      },

      resetColumns: () => {
        set({ 
          leftColumns: defaultLeftColumns,
          rightColumns: defaultRightColumns
        })
      }
    }),
    {
      name: 'grid-store'
    }
  )
)
