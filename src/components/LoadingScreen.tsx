import React from 'react';
import { Citrus } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-yellow-50 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative">
          <Citrus className="w-16 h-16 text-yellow-400 animate-spin" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200 to-transparent animate-pulse" />
        </div>
        <p className="mt-4 text-yellow-700 font-medium animate-pulse">
          Preparando tu limonada...
        </p>
      </div>
    </div>
  );
}