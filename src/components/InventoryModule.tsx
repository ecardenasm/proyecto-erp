import React, { useState } from 'react';
import { Package, Citrus, Box, ShoppingCart, Calendar } from 'lucide-react';
import PurchaseOrderModal from './PurchaseOrderModal';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  min: number;
  supplier: string;
  type: 'raw' | 'material' | 'product';
  batchNumber?: string;
  productionDate?: string;
  expirationDate?: string;
}

const inventory: InventoryItem[] = [
  // Materia Prima
  { 
    id: '1',
    name: 'Limones',
    quantity: 500,
    unit: 'kg',
    min: 100,
    supplier: 'Limones del Sur',
    type: 'raw'
  },
  { 
    id: '2',
    name: 'Azúcar',
    quantity: 200,
    unit: 'kg',
    min: 50,
    supplier: 'Azúcar Industrial SA',
    type: 'raw'
  },
  // Materiales
  { 
    id: '3',
    name: 'Botellas 500ml',
    quantity: 1000,
    unit: 'unidades',
    min: 200,
    supplier: 'Botellas Premium',
    type: 'material'
  },
  { 
    id: '4',
    name: 'Tapas',
    quantity: 1500,
    unit: 'unidades',
    min: 300,
    supplier: 'Botellas Premium',
    type: 'material'
  },
  // Productos
  { 
    id: '5',
    name: 'Limonada Natural',
    quantity: 150,
    unit: 'unidades',
    min: 50,
    supplier: '-',
    type: 'product',
    batchNumber: 'LN-2024-001',
    productionDate: '2024-03-01',
    expirationDate: '2024-06-01'
  },
  { 
    id: '6',
    name: 'Limonada Natural',
    quantity: 200,
    unit: 'unidades',
    min: 50,
    supplier: '-',
    type: 'product',
    batchNumber: 'LN-2024-002',
    productionDate: '2024-03-10',
    expirationDate: '2024-06-10'
  }
];

export default function InventoryModule() {
  const [selectedType, setSelectedType] = useState<'raw' | 'material' | 'product'>('raw');
  const [selectedMaterial, setSelectedMaterial] = useState<InventoryItem | null>(null);

  const filteredInventory = inventory.filter(item => item.type === selectedType);

  const sortedProducts = selectedType === 'product' 
    ? [...filteredInventory].sort((a, b) => 
        new Date(a.expirationDate!).getTime() - new Date(b.expirationDate!).getTime()
      )
    : filteredInventory;

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity <= item.min) return 'text-red-600';
    if (item.quantity <= item.min * 2) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getDaysUntilExpiration = (date: string) => {
    const today = new Date();
    const expiration = new Date(date);
    const diffTime = expiration.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <button
          onClick={() => setSelectedType('raw')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            selectedType === 'raw' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100'
          }`}
        >
          <Citrus className="w-5 h-5" />
          Materia Prima
        </button>
        <button
          onClick={() => setSelectedType('material')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            selectedType === 'material' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100'
          }`}
        >
          <Box className="w-5 h-5" />
          Materiales
        </button>
        <button
          onClick={() => setSelectedType('product')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            selectedType === 'product' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100'
          }`}
        >
          <Package className="w-5 h-5" />
          Productos
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="space-y-4">
          {sortedProducts.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Package className="w-6 h-6 text-gray-400" />
                <div>
                  <p className="font-medium">{item.name}</p>
                  {item.type === 'product' ? (
                    <div className="text-sm text-gray-500">
                      <p>Lote: {item.batchNumber}</p>
                      <p className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Vence: {new Date(item.expirationDate!).toLocaleDateString()} 
                        ({getDaysUntilExpiration(item.expirationDate!)} días)
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Mínimo requerido: {item.min} {item.unit}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className={`text-lg font-semibold ${getStockStatus(item)}`}>
                    {item.quantity} {item.unit}
                  </p>
                  {item.type !== 'product' && (
                    <p className={`text-sm ${getStockStatus(item)}`}>
                      {item.quantity <= item.min ? 'Stock bajo' : 
                       item.quantity <= item.min * 2 ? 'Stock moderado' : 
                       'Stock óptimo'}
                    </p>
                  )}
                </div>
                {item.type !== 'product' && (
                  <button
                    onClick={() => setSelectedMaterial(item)}
                    className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedMaterial && (
        <PurchaseOrderModal
          isOpen={!!selectedMaterial}
          onClose={() => setSelectedMaterial(null)}
          material={selectedMaterial}
        />
      )}
    </div>
  );
}