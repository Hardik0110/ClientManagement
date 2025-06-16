import { useNavigate } from '@tanstack/react-router';
import { FormInput, ScanEye, UserPlus, Eye } from 'lucide-react';

type IconComponent = typeof UserPlus;

interface DashboardCard {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly route: string;
  readonly icon: IconComponent;
  readonly gradient: string;
  readonly iconColor: string;
}

const DASHBOARD_CARDS: readonly DashboardCard[] = [
  {
    id: 'add-client',
    title: 'Add Client',
    description: 'Create and onboard new clients to your portfolio',
    route: '/add-client',
    icon: UserPlus,
    gradient: 'from-purple-500 via-pink-500 to-red-500',
    iconColor: 'text-purple-100'
  },
  {
    id: 'view-clients',
    title: 'View Clients',
    description: 'Manage and explore your client database',
    route: '/clients',
    icon: ScanEye,
    gradient: 'from-blue-500 via-cyan-500 to-teal-500',
    iconColor: 'text-blue-100'
  },
  {
    id: 'add-project',
    title: 'Add Projects',
    description: 'Launch new projects and track progress',
    route: '/add-project',
    icon: FormInput,
    gradient: 'from-green-500 via-emerald-500 to-lime-500',
    iconColor: 'text-green-100'
  },
  {
    id: 'view-projects',
    title: 'View Projects',
    description: 'Monitor and manage all active projects',
    route: '/projects',
    icon: Eye,
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    iconColor: 'text-orange-100'
  }
] as const;

interface CardProps {
  readonly card: DashboardCard;
  readonly onClick: () => void;
}

const DashboardCard = ({ card, onClick }: CardProps) => {
  const Icon = card.icon;
  
  return (
    <div
      onClick={onClick}
      className={`
        group relative cursor-pointer overflow-hidden rounded-2xl p-8
        bg-gradient-to-br ${card.gradient}
        shadow-xl hover:shadow-2xl
        transform hover:scale-105 hover:-rotate-1
        transition-all duration-300 ease-out
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300
      `}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12 group-hover:scale-150 transition-transform duration-500" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <Icon className={`w-12 h-12 ${card.iconColor} group-hover:scale-110 transition-transform duration-300`} />
          <div className="w-3 h-3 bg-white/40 rounded-full group-hover:bg-white/60 transition-colors duration-300" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-3 group-hover:translate-x-1 transition-transform duration-300">
          {card.title}
        </h2>
        
        <p className="text-white/90 leading-relaxed group-hover:text-white transition-colors duration-300">
          {card.description}
        </p>
        
        {/* Hover arrow indicator */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-6 h-6 border-2 border-white/60 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white/60 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Index() {
  const navigate = useNavigate();

  const handleCardClick = (route: string): void => {
    navigate({ to: route });
  };

  return (
    <div className="">
      {/* Header section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 mb-4">
          Dashboard
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Streamline your workflow with our powerful management tools
        </p>
      </div>

      {/* Cards grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {DASHBOARD_CARDS.map((card) => (
            <DashboardCard 
              key={card.id}
              card={card} 
              onClick={() => handleCardClick(card.route)}
            />
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}