import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Play, Pause, AlertCircle, Citrus } from 'lucide-react';
import LoadingScreen from './LoadingScreen';

const ProductionControls = lazy(() => import('./ProductionControls'));

export default function ProductionModule() {
  const [isLoading, setIsLoading] = useState(true);
  const [isProducing, setIsProducing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [inventory, setInventory] = useState(150);
  const [lemonPosition, setLemonPosition] = useState(0);
  const [showMaxAlert, setShowMaxAlert] = useState(false);
  const maxInventory = 200;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let animationFrame: number;
    let lastTimestamp: number;
    
    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = timestamp - lastTimestamp;
      
      if (isProducing && inventory < maxInventory) {
        setProgress((prev) => {
          const increment = (delta / 16) * 2; // Ajustado para 60fps
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
          return Math.min(prev + increment, 100);
        });

        setLemonPosition((pos) => (pos >= 100 ? 0 : pos + (delta / 16) * 2));
        lastTimestamp = timestamp;
        animationFrame = requestAnimationFrame(animate);
      }
    };

    if (isProducing) {
      animationFrame = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isProducing, inventory]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
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
              className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-colors ${
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
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-8 bg-gray-200 border-t border-b border-gray-300 relative">
                    <div className="absolute inset-0" 
                      style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #e5e7eb 10px, #e5e7eb 20px)',
                        animation: 'moveStripes 1s linear infinite',
                      }}
                    />
                  </div>
                </div>

                <div 
                  className="absolute top-1/2 -translate-y-1/2 transform transition-transform"
                  style={{ 
                    left: `${lemonPosition}%`,
                    transform: `translateY(-50%) rotate(${lemonPosition * 3.6}deg)`
                  }}
                >
                  <Citrus className="w-8 h-8 text-yellow-400" />
                </div>
              </div>

              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 transition-transform"
                  style={{ 
                    transform: `translateX(${progress - 100}%)`,
                    transition: 'transform 50ms linear'
                  }}
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
    </Suspense>
  );
}