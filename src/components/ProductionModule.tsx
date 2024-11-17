import React, { useState, useEffect, Suspense } from 'react';
import { Play, Pause, AlertCircle, Citrus } from 'lucide-react';
import LoadingScreen from './LoadingScreen';
import OrderSelectionModal from './OrderSelectionModal';
import { useProductionStore } from '../store/productionStore';

const ANIMATION_FRAME_RATE = 1000 / 30; // 30fps para mejor rendimiento
const PRODUCTION_SPEED = 5; // Aumentado para producción más rápida
const LEMON_ROTATION_SPEED = 5;

export default function ProductionModule() {
  const {
    inventory,
    currentOrder,
    isProducing,
    producedAmount,
    setCurrentOrder,
    setIsProducing,
    setProducedAmount,
    incrementInventory,
    incrementProducedAmount
  } = useProductionStore();

  const [isLoading, setIsLoading] = useState(true);
  const [lemonPosition, setLemonPosition] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [progress, setProgress] = useState(0);

  // Manejar el estado de carga inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Manejar la animación y producción
  useEffect(() => {
    if (!isProducing || !currentOrder) return;

    let animationFrame: number;
    let lastTimestamp: number;
    
    const animate = (timestamp: number) => {
      try {
        if (!lastTimestamp) lastTimestamp = timestamp;
        const delta = timestamp - lastTimestamp;
        
        setProgress((prev) => {
          const increment = (delta / ANIMATION_FRAME_RATE) * PRODUCTION_SPEED;
          if (prev >= 100) {
            incrementInventory();
            incrementProducedAmount();
            
            if (producedAmount + 1 >= currentOrder.quantity) {
              setIsProducing(false);
              setCurrentOrder(null);
              setProducedAmount(0);
            }
            return 0;
          }
          return Math.min(prev + increment, 100);
        });

        setLemonPosition((pos) => (pos >= 100 ? 0 : pos + (delta / ANIMATION_FRAME_RATE) * PRODUCTION_SPEED));
        lastTimestamp = timestamp;
        animationFrame = requestAnimationFrame(animate);
      } catch (err) {
        setError('Error en el proceso de producción');
        setIsProducing(false);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isProducing, currentOrder, producedAmount, incrementInventory, incrementProducedAmount, setIsProducing, setCurrentOrder, setProducedAmount]);

  const handleStartProduction = () => {
    try {
      if (!currentOrder) {
        setShowOrderModal(true);
        return;
      }
      setIsProducing(!isProducing);
      setError(null);
    } catch (err) {
      setError('Error al iniciar/detener la producción');
    }
  };

  const handleOrderSelect = (order: any) => {
    setCurrentOrder(order);
    setProducedAmount(0);
    setShowOrderModal(false);
  };

  const getInventoryColor = () => {
    if (inventory <= 50) return 'text-red-600';
    if (inventory <= 100) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Estado de Producción</h2>
          
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-600">Inventario Actual</p>
              <p className={`text-2xl font-bold ${getInventoryColor()}`}>{inventory}</p>
            </div>
            <button
              onClick={handleStartProduction}
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
                  <Play className="w-5 h-5" /> {currentOrder ? 'Continuar' : 'Seleccionar Pedido'}
                </>
              )}
            </button>
          </div>

          {currentOrder && (
            <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg">
              <p className="font-medium">Pedido en Producción</p>
              <p>Cliente: {currentOrder.client}</p>
              <p>Progreso: {producedAmount} / {currentOrder.quantity} unidades</p>
            </div>
          )}

          {isProducing && (
            <div className="relative">
              <div className="h-24 bg-gray-100 rounded-xl overflow-hidden relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-8 bg-gray-200 border-t border-b border-gray-300 relative">
                    <div 
                      className="absolute inset-0" 
                      style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #e5e7eb 10px, #e5e7eb 20px)',
                        animation: 'moveStripes 1s linear infinite',
                      }}
                    />
                  </div>
                </div>

                <div 
                  className="absolute top-1/2 -translate-y-1/2 transform will-change-transform"
                  style={{ 
                    left: `${lemonPosition}%`,
                    transform: `translateY(-50%) rotate(${lemonPosition * LEMON_ROTATION_SPEED}deg)`
                  }}
                >
                  <Citrus className="w-8 h-8 text-yellow-400" />
                </div>
              </div>

              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 will-change-transform"
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

        <OrderSelectionModal 
          isOpen={showOrderModal}
          onClose={() => setShowOrderModal(false)}
          onSelect={handleOrderSelect}
          currentInventory={inventory}
        />
      </div>
    </Suspense>
  );
}