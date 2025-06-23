import React from 'react';
import { NotificationCenter } from '../notifications/NotificationCenter';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-end">
      <NotificationCenter />
    </header>
  );
};