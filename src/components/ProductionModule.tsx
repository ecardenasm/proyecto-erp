import React, { useState, useEffect } from 'react';
import { Play, Pause, AlertCircle } from 'lucide-react';

export default function ProductionModule() {
  const [isProducing, setIsProducing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [inventory, setInventory] = useState(150);
  const [lemonPosition, setLemonPosition] = useState(0);
  const [showMaxAlert, setShowMaxAlert] = useState(false);
  const maxInventory = 200;

  useEffect(() => {
    let interval: number;
    if (isProducing && inventory < maxInventory) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setInventory((inv) => {
              const newInv = inv + 1;
              if (newInv >= maxInventory) {
                setIsProducing(false);
                setShowMaxAlert(true);
                setTimeout(() => setShowMaxAlert(false), 5000);
              }
              return Math.min(newInv, maxInventory);
            });
            return 0;
          }
          return prev + 2;
        });
        setLemonPosition((pos) => (pos >= 100 ? 0 : pos + 2));
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isProducing, inventory]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Estado de Producción</h2>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-600">Inventario Actual</p>
            <p className="text-2xl font-bold">{inventory} / {maxInventory}</p>
          </div>
          <button
            onClick={() => setIsProducing(!isProducing)}
            className={`px-6 py-3 rounded-lg flex items-center gap-2 ${
              isProducing
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {isProducing ? (
              <>
                <Pause className="w-5 h-5" /> Detener
              </>
            ) : (
              <>
                <Play className="w-5 h-5" /> Iniciar
              </>
            )}
          </button>
        </div>

        {showMaxAlert && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>Se ha alcanzado la capacidad máxima de producción</span>
          </div>
        )}

        {isProducing && (
          <div className="relative">
            <div className="h-24 bg-gray-100 rounded-xl overflow-hidden relative mb-4">
              {/* Conveyor belt animation */}
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-8 bg-gray-200 border-t border-b border-gray-300 relative">
                  {/* Moving stripes */}
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #e5e7eb 10px, #e5e7eb 20px)',
                    animation: 'moveStripes 1s linear infinite',
                  }}></div>
                </div>
              </div>

              {/* Lemon moving on conveyor */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 transition-all duration-200"
                style={{ left: `${lemonPosition}%` }}
              >
                <Citrus className="w-8 h-8 text-yellow-400" />
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-600 mb-2">Producción Diaria</h3>
          <p className="text-2xl font-bold">324 unidades</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-600 mb-2">Eficiencia</h3>
          <p className="text-2xl font-bold text-green-600">94%</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-600 mb-2">Tiempo Medio</h3>
          <p className="text-2xl font-bold">1.2 min/u</p>
        </div>
      </div>
    </div>
  );
}