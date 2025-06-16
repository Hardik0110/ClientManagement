import ReactDOM from 'react-dom/client';
import { createRootRoute, createRoute, createRouter, RouterProvider, Outlet, Navigate } from '@tanstack/react-router';
import { AuthProvider, useAuth } from './lib/context/authContext';
import Login from './pages/Auth/Login';
import Index from './pages/Dashboard/Index';
import AddClient from './pages/Dashboard/AddClient';
import Clients from './pages/Dashboard/Clients';
import Projects from './pages/Projects/Projects';
import AddProject from './pages/Projects/AddProject';
import Header from './components/Header';
import './styles/index.css';

// Authentication-protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

// Authentication redirect wrapper for login page
const AuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

// Root route
const rootRoute = createRootRoute({
  component: () => <div id="app"><Outlet /></div>,
});

// Root redirect route component
const RootRedirect = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }
  
  return <Navigate to={user ? "/dashboard" : "/login"} />;
};

// Root redirect route
const rootRedirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: RootRedirect,
});

// Login route
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: () => (
    <AuthRedirect>
      <Login />
    </AuthRedirect>
  ),
});

// Dashboard layout route
const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
        <div className="container mx-auto px-4 py-6 space-y-6">
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  ),
});

// Dashboard index route
const dashboardIndexRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/',
  component: Index,
});

// Add client route
const addClientRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/add-client',
  component: () => (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
        <div className="container mx-auto px-4 py-6 space-y-6">
          <Header />
          <main className="flex-1">
            <AddClient />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  ),
});

// Clients route
const clientsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/clients',
  component: () => (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
        <div className="container mx-auto px-4 py-6 space-y-6">
          <Header />
          <main className="flex-1">
            <Clients />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  ),
});

// Projects route
const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects',
  component: () => (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
        <div className="container mx-auto px-4 py-6 space-y-6">
          <Header />
          <main className="flex-1">
            <Projects />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  ),
});

// Add project route
const addProjectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/add-project',
  component: () => (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
        <div className="container mx-auto px-4 py-6 space-y-6">
          <Header />
          <main className="flex-1">
            <AddProject />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  ),
});

// Build the route tree
const routeTree = rootRoute.addChildren([
  rootRedirectRoute,
  loginRoute,
  layoutRoute.addChildren([
    dashboardIndexRoute,
  ]),
  addClientRoute,
  clientsRoute,
  projectsRoute,
  addProjectRoute,
]);

const router = createRouter({ routeTree });

const App = () => (
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);