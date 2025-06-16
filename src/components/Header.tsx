import { Link, useRouterState } from '@tanstack/react-router';
import { cn } from '../lib/utils/cn';
import { useAuth } from '../lib/context/authContext';
import { useMemo } from 'react';

interface HeaderProps {
  readonly userName?: string;
}

interface NavigationItem {
  readonly name: string;
  readonly path: string;
}

const NAVIGATION_ITEMS: readonly NavigationItem[] = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Add Client', path: '/add-client' },
  { name: 'Clients', path: '/clients' },
  { name: 'Add Project', path: '/add-project' },
  { name: 'Projects', path: '/projects' }
] as const;

const Header = ({ userName = "Hardik BHOii" }: HeaderProps) => {
  const location = useRouterState({ select: (state) => state.location });
  const { user, signOut } = useAuth();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const isActivePath = (path: string): boolean => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-white/20 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl px-6 py-4 transition-all duration-300 hover:shadow-3xl hover:bg-white/25">
        <div className="flex items-center justify-between">
          <div className="text-lg md:text-xl font-medium">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold">
              {greeting}, {userName}
            </span>
            <span className="text-white/80 italic font-normal ml-2">
              — Welcome to Client Management Dashboard
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-2">
              {NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border",
                    "hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white hover:border-transparent hover:shadow-lg hover:scale-105",
                    isActivePath(item.path)
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow-lg"
                      : "text-white/90 border-white/20 bg-white/10 backdrop-blur-sm"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            
            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <div className="hidden sm:flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-white/80 text-sm font-medium">
                      {user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl transition-all duration-200 border border-red-400/30 hover:border-red-300 hover:shadow-lg hover:scale-105 font-medium"
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