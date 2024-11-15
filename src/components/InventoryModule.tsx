import React, { useState } from 'react';
import { Package, Citrus, Box, ShoppingCart } from 'lucide-react';
import PurchaseOrderModal from './PurchaseOrderModal';

const rawMaterials = [
  { 
    name: 'Limones',
    quantity: 500,
    unit: 'kg',
    min: 100,
    supplier: 'Limones del Sur'
  },
  { 
    name: 'Azúcar',
    quantity: 200,
    unit: 'kg',
    min: 50,
    supplier: 'Azúcar Industrial SA'
  },
  { 
    name: 'Agua Purificada',
    quantity: 1000,
    unit: 'L',
    min: 200,
    supplier: 'Agua Pura SA'
  },
];

export default function InventoryModule() {
  const maxCapacity = 1000;
  const currentStock = 150;
  const stockPercentage = (currentStock / maxCapacity) * 100;
  const [selectedMaterial, setSelectedMaterial] = useState<typeof rawMaterials[0] | null>(null);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Capacidad de Almacenamiento</h2>
        <div className="flex items-center gap-4 mb-4">
          <Box className="w-8 h-8 text-blue-500" />
          <div className="flex-1">
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${stockPercentage}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-sm text-gray-600">
              <span>{currentStock} unidades</span>
              <span>{maxCapacity} capacidad máxima</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Materia Prima</h2>
        <div className="space-y-4">
          {rawMaterials.map((material) => (
            <div
              key={material.name}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Package className="w-6 h-6 text-gray-400" />
                <div>
                  <p className="font-medium">{material.name}</p>
                  <p className="text-sm text-gray-500">
                    Mínimo requerido: {material.min} {material.unit}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    {material.quantity} {material.unit}
                  </p>
                  <p className={`text-sm ${
                    material.quantity > material.min * 2
                      ? 'text-green-600'
                      : material.quantity > material.min
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}>
                    {material.quantity > material.min * 2
                      ? 'Stock óptimo'
                      : material.quantity > material.min
                      ? 'Stock moderado'
                      : 'Stock bajo'}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedMaterial(material)}
                  className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <PurchaseOrderModal
        isOpen={!!selectedMaterial}
        onClose={() => setSelectedMaterial(null)}
        material={selectedMaterial || rawMaterials[0]}
      />
    </div>
  );
}