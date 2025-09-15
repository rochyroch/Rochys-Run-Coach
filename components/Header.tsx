
import React from 'react';
import { RunnerIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-brand-dark shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center gap-4">
        <RunnerIcon className="w-10 h-10 text-brand-primary" />
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Rochys Run Coach
        </h1>
      </div>
    </header>
  );
};

export default Header;
