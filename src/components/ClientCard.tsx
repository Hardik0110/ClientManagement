

export interface Client {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    company: string;
    address: string;
    city?: string;
    state?: string;
    zip?: string;
    notes?: string;
    createdAt?: string;
  }

const ClientCard = ({ client }: { client: Client }) => (
    <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-2 hover:scale-[1.02]">
      {/* Header with gradient background */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-2xl"></div>
      
      {/* Avatar/Initial Circle */}
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3 shadow-md">
          {client.fullName.split(' ').map(name => name[0]).join('').slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h3 className="font-bold text-xl text-gray-800 group-hover:text-gray-900 transition-colors">
            {client.fullName}
          </h3>
          <p className="text-sm text-gray-500 font-medium">{client.company}</p>
        </div>
      </div>
  
      {/* Contact Information */}
      <div className="space-y-3">
        <div className="flex items-center text-gray-700 hover:text-blue-600 transition-colors group/item">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3 group-hover/item:bg-blue-100 transition-colors">
            <span className="text-blue-600">📧</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{client.email}</p>
            <p className="text-xs text-gray-500">Email</p>
          </div>
        </div>
  
        <div className="flex items-center text-gray-700 hover:text-green-600 transition-colors group/item">
          <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center mr-3 group-hover/item:bg-green-100 transition-colors">
            <span className="text-green-600">📱</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{client.phone}</p>
            <p className="text-xs text-gray-500">Phone</p>
          </div>
        </div>
  
        <div className="flex items-center text-gray-700 hover:text-purple-600 transition-colors group/item">
          <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center mr-3 group-hover/item:bg-purple-100 transition-colors">
            <span className="text-purple-600">🏠</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium line-clamp-2">{client.address}</p>
            {client.city && client.state && (
              <p className="text-xs text-gray-500 mt-1">{client.city}, {client.state} {client.zip}</p>
            )}
            <p className="text-xs text-gray-500">Address</p>
          </div>
        </div>
      </div>
  
      {/* Notes Preview */}
      {client.notes && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-start">
            <div className="w-6 h-6 bg-yellow-50 rounded-md flex items-center justify-center mr-2 mt-0.5">
              <span className="text-yellow-600 text-xs">📝</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-600 line-clamp-2">{client.notes}</p>
            </div>
          </div>
        </div>
      )}
  
      {/* Footer with date */}
      {client.createdAt && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400 flex items-center">
            <span className="mr-1">📅</span>
            Added {new Date(client.createdAt).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </p>
        </div>
      )}
  
      {/* Hover overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );

  export default ClientCard;