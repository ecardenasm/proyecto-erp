import React, { useState } from 'react';
import { X } from 'lucide-react';

interface PurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: {
    name: string;
    quantity: number;
    unit: string;
    supplier?: string;
  };
}

export default function PurchaseOrderModal({ isOpen, onClose, material }: PurchaseOrderModalProps) {
  const [orderQuantity, setOrderQuantity] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Crear Orden de Compra</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Material</label>
            <p className="mt-1 text-gray-900">{material.name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Stock Actual</label>
            <p className="mt-1 text-gray-900">{material.quantity} {material.unit}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cantidad a Ordenar ({material.unit})
            </label>
            <input
              type="number"
              min="0"
              value={orderQuantity}
              onChange={(e) => setOrderQuantity(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>

          {material.supplier && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Proveedor</label>
              <p className="mt-1 text-gray-900">{material.supplier}</p>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                // Here you would handle the order submission
                alert(`Orden creada por ${orderQuantity} ${material.unit} de ${material.name}`);
                onClose();
              }}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              Crear Orden
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}