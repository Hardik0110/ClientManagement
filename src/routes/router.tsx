import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { Layout } from '../components/Layout';
import Login from '../pages/Auth/Login';
import Index from '../pages/Dashboard/Index';
import AddClient from '../pages/Dashboard/AddClient';
import Clients from '../pages/Dashboard/Clients';
import Projects from '../pages/Projects/Projects';
import AddProject from '../pages/Projects/AddProject';

const rootRoute = createRootRoute({
  component: () => <div id="app"><Outlet /></div>,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
});

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Layout,
});

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

export const routeTree = rootRoute.addChildren([
  loginRoute,
  layoutRoute.addChildren([
    indexRoute,
    addClientRoute,
    clientsRoute,
    projectsRoute,
    addProjectRoute,
  ]),
]);

export const router = createRouter({ routeTree });