import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';

interface Position {
  role: string;
  quantity: number;
}

export default function RequestPersonnelModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [positions, setPositions] = useState<Position[]>([
    { role: '', quantity: 1 }
  ]);

  if (!isOpen) return null;

  const addPosition = () => {
    setPositions([...positions, { role: '', quantity: 1 }]);
  };

  const removePosition = (index: number) => {
    setPositions(positions.filter((_, i) => i !== index));
  };

  const updatePosition = (index: number, field: keyof Position, value: string | number) => {
    const newPositions = [...positions];
    newPositions[index] = { ...newPositions[index], [field]: value };
    setPositions(newPositions);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Solicitar Personal</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {positions.map((position, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Puesto</label>
                <input
                  type="text"
                  value={position.role}
                  onChange={(e) => updatePosition(index, 'role', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                  placeholder="Ej: Operador de Máquina"
                />
              </div>
              <div className="w-32">
                <label className="block text-sm font-medium text-gray-700">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  value={position.quantity}
                  onChange={(e) => updatePosition(index, 'quantity', parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                />
              </div>
              {positions.length > 1 && (
                <button
                  onClick={() => removePosition(index)}
                  className="mt-7 p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Minus className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}

          <button
            onClick={addPosition}
            className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700"
          >
            <Plus className="w-5 h-5" />
            Agregar otro puesto
          </button>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                alert('Solicitud enviada a Recursos Humanos');
                onClose();
              }}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              Enviar Solicitud
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}