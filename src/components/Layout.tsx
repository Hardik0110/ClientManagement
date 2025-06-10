import { Outlet } from '@tanstack/react-router';
import  Header  from './Header';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};
