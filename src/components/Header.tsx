import { Link, useRouterState } from '@tanstack/react-router';
import { cn } from '../lib/utils/cn';
import { useAuth } from '../lib/context/authContext';

interface HeaderProps {
  userName?: string;
}

const Header = ({ userName = "Hardik BHOii " }: HeaderProps) => {
  const location = useRouterState({ select: (s) => s.location });
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Add Client', path: '/add-client'},
    { name: 'Clients', path: '/clients' },
    { name: 'Add Project', path: '/add-project'},
    { name: 'Projects', path: '/projects' }
  ];

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <header className="sticky ">
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl px-6 py-4 transition-all duration-300 hover:shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="text-lg md:text-xl font-medium text-gradient bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
            {getGreeting()}, <span className="font-semibold">{userName}</span>
            <span className="text-black italic font-normal"> — Welcome to Client Management Dashboard</span>
          </div>

          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    "hover:bg-black hover:text-white",
                    isActivePath(item.path)
                      ? "bg-black text-white shadow"
                      : "text-black/80"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-gray-300 text-sm">
                  {user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors border border-red-500/30"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
