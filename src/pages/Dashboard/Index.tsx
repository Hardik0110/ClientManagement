import { useNavigate } from '@tanstack/react-router';
import { ScanEye, UserPlus } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="text-white h-100vh p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onClick={() => navigate({ to: '/add-client' })}
          className="cursor-pointer bg-white/50 p-6 rounded-xl shadow-lg hover:scale-105 transition"
        >
        <UserPlus className="w-8 h-8 text-primary mb-2" />
          <h2 className="text-2xl font-semibold mb-2">Add Client</h2>
          <p>Add a new client to your database</p>
        </div>
        <div
          onClick={() => navigate({ to: '/clients' })}
          className="cursor-pointer bg-white/50 p-6 rounded-xl shadow-lg hover:scale-105 transition"
        >
            <ScanEye className="w-8 h-8 text-primary mb-2" />
          <h2 className="text-2xl font-semibold mb-2">View Clients</h2>
          <p>See and manage all clients</p>
        </div>
      </div>
    </div>
  );
}