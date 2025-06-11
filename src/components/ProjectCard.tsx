import React from 'react';
import { Calendar, DollarSign, Users, Tag, AlertCircle, Clock, CheckCircle, Pause, XCircle } from 'lucide-react';

export interface Project {
  id: string;
  projectName: string;
  clientId: string;
  description: string;
  projectType: 'web-development' | 'mobile-app' | 'design' | 'consulting' | 'marketing' | 'other';
  status: 'planning' | 'in-progress' | 'review' | 'completed' | 'on-hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate: string;
  endDate: string;
  budget: number;
  teamMembers: string[];
  tags: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'planning':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'in-progress':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'review':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'on-hold':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-500/20 text-gray-300';
      case 'medium':
        return 'bg-blue-500/20 text-blue-300';
      case 'high':
        return 'bg-orange-500/20 text-orange-300';
      case 'urgent':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'planning':
        return <Clock className="w-4 h-4" />;
      case 'in-progress':
        return <AlertCircle className="w-4 h-4" />;
      case 'review':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'on-hold':
        return <Pause className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getProjectTypeLabel = (type: Project['projectType']) => {
    switch (type) {
      case 'web-development':
        return 'Web Development';
      case 'mobile-app':
        return 'Mobile App';
      case 'design':
        return 'Design';
      case 'consulting':
        return 'Consulting';
      case 'marketing':
        return 'Marketing';
      case 'other':
        return 'Other';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatBudget = (budget: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(budget);
  };

  const getDaysRemaining = () => {
    const endDate = new Date(project.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-200 hover:scale-[1.02] cursor-pointer group">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-white/90 transition-colors">
            {project.projectName}
          </h3>
          <p className="text-gray-400 text-sm">
            {getProjectTypeLabel(project.projectType)}
          </p>
        </div>
        <div className="flex gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
            {project.priority.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Status */}
      <div className="mb-4">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
          {getStatusIcon(project.status)}
          {project.status.replace('-', ' ').toUpperCase()}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
        {project.description}
      </p>

      {/* Project Details */}
      <div className="space-y-3 mb-4">
        {/* Budget */}
        <div className="flex items-center text-gray-300">
          <DollarSign className="w-4 h-4 mr-2 text-green-400" />
          <span className="text-sm font-medium">{formatBudget(project.budget)}</span>
        </div>

        {/* Timeline */}
        <div className="flex items-center text-gray-300">
          <Calendar className="w-4 h-4 mr-2 text-blue-400" />
          <span className="text-sm">
            {formatDate(project.startDate)} - {formatDate(project.endDate)}
          </span>
        </div>

        {/* Team Members */}
        <div className="flex items-center text-gray-300">
          <Users className="w-4 h-4 mr-2 text-purple-400" />
          <span className="text-sm">
            {project.teamMembers.length} team {project.teamMembers.length === 1 ? 'member' : 'members'}
          </span>
        </div>

        {/* Days Remaining */}
        {project.status !== 'completed' && project.status !== 'cancelled' && (
          <div className="flex items-center text-gray-300">
            <Clock className="w-4 h-4 mr-2 text-orange-400" />
            <span className="text-sm">
              {daysRemaining > 0 ? `${daysRemaining} days remaining` : 
               daysRemaining === 0 ? 'Due today' : 
               `${Math.abs(daysRemaining)} days overdue`}
            </span>
          </div>
        )}
      </div>

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-4 h-4 text-gray-400" />
          <div className="flex flex-wrap gap-1">
            {project.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-md"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-md">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Team Members Preview */}
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {project.teamMembers.slice(0, 4).map((member, index) => (
            <div
              key={index}
              className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-black"
              title={member}
            >
              {member.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
          ))}
          {project.teamMembers.length > 4 && (
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-black">
              +{project.teamMembers.length - 4}
            </div>
          )}
        </div>
        
        <div className="text-xs text-gray-400">
          Updated {new Date(project.updatedAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;