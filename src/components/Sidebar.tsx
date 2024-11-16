import React from 'react';
import { 
  Factory, 
  BadgeCheck, 
  Package, 
  Users,
  Citrus,
  HardHat,
  Settings
} from 'lucide-react';

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

export default function Sidebar({ activeModule, onModuleChange }: SidebarProps) {
  const modules = [
    { id: 'production', icon: Factory, label: 'Producción' },
    { id: 'quality', icon: BadgeCheck, label: 'Calidad' },
    { id: 'inventory', icon: Package, label: 'Inventario' },
    { id: 'suppliers', icon: Users, label: 'Proveedores' },
    { id: 'employees', icon: HardHat, label: 'Empleados' },
    { id: 'machinery', icon: Settings, label: 'Maquinaria' },
  ];

  return (
    <div className="bg-white h-screen w-64 fixed left-0 top-0 shadow-lg">
      <div className="p-4 border-b flex items-center gap-2">
        <Citrus className="w-8 h-8 text-yellow-400" />
        <h1 className="text-xl font-bold text-gray-800">Proyecto Diana</h1>
      </div>
      <nav className="p-4">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <button
              key={module.id}
              onClick={() => onModuleChange(module.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 transition-colors ${
                activeModule === module.id
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{module.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}