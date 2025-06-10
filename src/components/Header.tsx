import { User, ArrowDown } from 'lucide-react';
import { Link, useRouterState } from '@tanstack/react-router';
import { cn } from '../lib/utils/cn';

interface HeaderProps {
  userName?: string;
}

const Header = ({ userName = "Hardik BHOii " }: HeaderProps) => {
  const location = useRouterState({ select: (s) => s.location });

  const navigationItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Clients', path: '/clients' },
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
    <header className="sticky top-4 mx-4 z-50">
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

            <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-primary/20 transition duration-200 group border border-primary/20">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow">
                <User className="w-4 h-4 text-white" />
              </div>
              <ArrowDown className="w-4 h-4 text-muted-foreground group-hover:text-primary transition" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
