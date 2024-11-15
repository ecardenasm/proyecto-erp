import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ProductionModule from './components/ProductionModule';
import QualityModule from './components/QualityModule';
import InventoryModule from './components/InventoryModule';
import SuppliersModule from './components/SuppliersModule';
import EmployeesModule from './components/EmployeesModule';
import MachineryModule from './components/MachineryModule';

function App() {
  const [activeModule, setActiveModule] = useState('production');

  const renderModule = () => {
    switch (activeModule) {
      case 'production':
        return <ProductionModule />;
      case 'quality':
        return <QualityModule />;
      case 'inventory':
        return <InventoryModule />;
      case 'suppliers':
        return <SuppliersModule />;
      case 'employees':
        return <EmployeesModule />;
      case 'machinery':
        return <MachineryModule />;
      default:
        return <ProductionModule />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
      <main className="ml-64 p-8">
        {renderModule()}
      </main>
    </div>
  );
}

export default App;