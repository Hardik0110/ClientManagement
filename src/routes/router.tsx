import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { Layout } from '../components/Layout';
import Index from '../pages/Dashboard/Index';
import AddClient from '../pages/Dashboard/AddClient';
import Clients from '../pages/Dashboard/Clients';
import Projects from '../pages/Projects/Projects';
import AddProject from '../pages/Projects/AddProject';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Index,
});

const addClientRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/add-client',
  component: AddClient,
});

const clientsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/clients',
  component: Clients,
});

const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects',
  component: Projects,
})

const addProjectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/add-project',
  component: AddProject,
})

export const routeTree = rootRoute.addChildren([
  indexRoute,
  addClientRoute,
  clientsRoute,
  addProjectRoute,
  projectsRoute
]);

export const router = createRouter({ routeTree });
