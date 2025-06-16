import { Outlet, useRouterState } from '@tanstack/react-router';
import Header from './Header';
import { ProtectedRoute } from './ProtectedRoute';

export const Layout = () => {
  const route = useRouterState({ select: (s) => s.location.pathname });

  return (
    <ProtectedRoute>
      <div className=" bg-slate-800">
        {route !== '/dashboard' && <Header />}
        <main className="min-h-screen p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  );
};
