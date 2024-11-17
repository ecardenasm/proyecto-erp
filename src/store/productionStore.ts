import { create } from 'zustand';

interface ProductionState {
  inventory: number;
  currentOrder: Order | null;
  isProducing: boolean;
  producedAmount: number;
  setInventory: (inventory: number) => void;
  setCurrentOrder: (order: Order | null) => void;
  setIsProducing: (isProducing: boolean) => void;
  setProducedAmount: (amount: number) => void;
  incrementInventory: () => void;
  incrementProducedAmount: () => void;
}

interface Order {
  id: string;
  client: string;
  quantity: number;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
}

export const useProductionStore = create<ProductionState>((set) => ({
  inventory: 150,
  currentOrder: null,
  isProducing: false,
  producedAmount: 0,
  setInventory: (inventory) => set({ inventory }),
  setCurrentOrder: (order) => set({ currentOrder: order }),
  setIsProducing: (isProducing) => set({ isProducing }),
  setProducedAmount: (amount) => set({ producedAmount: amount }),
  incrementInventory: () => set((state) => ({ inventory: state.inventory + 1 })),
  incrementProducedAmount: () => set((state) => ({ producedAmount: state.producedAmount + 1 })),
}));