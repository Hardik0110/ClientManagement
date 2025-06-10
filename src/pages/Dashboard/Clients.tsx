import { useEffect, useState } from 'react';
import { database } from '../../lib/services/firebase';
import { ref, onValue } from 'firebase/database';
import ClientCard from '../../components/ClientCard';
import type { Client } from '../../components/ClientCard';

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const clientsRef = ref(database, 'clients');
    const unsubscribe = onValue(clientsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedClients = Object.entries(data).map(([id, value]: [string, any]) => ({
          id,
          ...value,
        }));
        setClients(loadedClients);
      } else {
        setClients([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="bg-black min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-white text-3xl font-bold mb-8">Clients</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white/10 rounded-2xl p-6 animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full mr-3"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-white/20 rounded w-3/4"></div>
                    <div className="h-3 bg-white/20 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-8 h-8 bg-white/20 rounded-lg mr-3"></div>
                      <div className="space-y-1 flex-1">
                        <div className="h-3 bg-white/20 rounded w-full"></div>
                        <div className="h-2 bg-white/20 rounded w-1/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black h-100vh p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold mb-2">Clients</h1>
          <p className="text-gray-400">
            {clients.length} {clients.length === 1 ? 'client' : 'clients'} total
          </p>
        </div>

        {/* Clients Grid */}
        {clients.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">👥</span>
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">No clients yet</h3>
            <p className="text-gray-400 mb-6">Add your first client to get started</p>
            <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
              Add Client
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {clients.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Clients;