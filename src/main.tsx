import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { AuthProvider } from './lib/context/authContext';
import { router } from './routes/router';
import './styles/index.css';

const App = () => (
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);