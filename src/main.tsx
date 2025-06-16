import ReactDOM from 'react-dom/client';
import { createRootRoute, createRoute, createRouter, RouterProvider, Outlet, Navigate, useNavigate } from '@tanstack/react-router';
import { AuthProvider, useAuth } from './lib/context/authContext';
import Login from './pages/Auth/Login';
import Index from './pages/Dashboard/Index';
import AddClient from './pages/Dashboard/AddClient';
import Clients from './pages/Dashboard/Clients';
import Projects from './pages/Projects/Projects';
import AddProject from './pages/Projects/AddProject';
import './styles/index.css';

// Authentication-protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

// Root route
const rootRoute = createRootRoute({
  component: () => <div id="app"><Outlet /></div>,
});

// Login route
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
});

// Dashboard layout route
const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-slate-800">
        <header className="bg-slate-900 shadow-lg p-4 flex justify-between items-center">
          <h1 className="text-white text-xl">Dashboard</h1>
          <LogoutButton />
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  ),
});

// Logout button component
const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  );
};

// Child routes under Dashboard
const indexRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/dashboard',
  component: Index,
});

const addClientRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/add-client',
  component: AddClient,
});

const clientsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/clients',
  component: Clients,
});

const projectsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/projects',
  component: Projects,
});

const addProjectRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/add-project',
  component: AddProject,
});

// Build the route tree
const routeTree = rootRoute.addChildren([
  loginRoute,
  layoutRoute.addChildren([
    indexRoute,
    addClientRoute,
    clientsRoute,
    projectsRoute,
    addProjectRoute,
  ]),
]);

const router = createRouter({ routeTree });

const App = () => (
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);