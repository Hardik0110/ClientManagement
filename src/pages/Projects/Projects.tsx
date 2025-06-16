import { useEffect, useState } from 'react';
import { database } from '../../lib/services/firebase';
import { ref, onValue } from 'firebase/database';
import ProjectCard from '../../components/ProjectCard';
import type { Project } from '../../components/ProjectCard';

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'planning' | 'in-progress' | 'review' | 'completed' | 'on-hold' | 'cancelled'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'budget' | 'priority'>('date');

  useEffect(() => {
    const projectsRef = ref(database, 'projects');
    const unsubscribe = onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedProjects = Object.entries(data).map(([id, value]: [string, any]) => ({
          id,
          ...value,
        }));
        setProjects(loadedProjects);
      } else {
        setProjects([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getFilteredProjects = () => {
    let filtered = projects;

    if (filter !== 'all') {
      filtered = filtered.filter(project => project.status === filter);
    }

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.projectName.localeCompare(b.projectName);
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'budget':
          return b.budget - a.budget;
        case 'priority': {
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredProjects = getFilteredProjects();

  const getStatusCount = (status: string) => {
    if (status === 'all') return projects.length;
    return projects.filter(project => project.status === status).length;
  };

  const getTotalBudget = () => {
    return projects.reduce((total, project) => total + project.budget, 0);
  };

  const getActiveProjects = () => {
    return projects.filter(project =>
      project.status === 'in-progress' || project.status === 'planning'
    ).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-white text-3xl font-bold mb-8">Projects</h1>

          {/* Loading skeleton for stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white/10 rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-white/20 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-white/20 rounded w-3/4"></div>
              </div>
            ))}
          </div>

          {/* Loading skeleton for filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-10 bg-white/10 rounded-lg w-24 animate-pulse"></div>
            ))}
          </div>

          {/* Loading skeleton for project cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white/10 rounded-2xl p-6 animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2 flex-1">
                    <div className="h-5 bg-white/20 rounded w-3/4"></div>
                    <div className="h-3 bg-white/20 rounded w-1/2"></div>
                  </div>
                  <div className="h-6 bg-white/20 rounded-full w-16"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-6 bg-white/20 rounded-full w-20"></div>
                  <div className="h-4 bg-white/20 rounded w-full"></div>
                  <div className="h-4 bg-white/20 rounded w-2/3"></div>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-4 h-4 bg-white/20 rounded mr-2"></div>
                      <div className="h-3 bg-white/20 rounded flex-1"></div>
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
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold mb-2">Projects</h1>
          <p className="text-gray-400">
            {projects.length} {projects.length === 1 ? 'project' : 'projects'} total
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4">
            <h3 className="text-gray-400 text-sm font-medium mb-1">Total Projects</h3>
            <p className="text-white text-2xl font-bold">{projects.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4">
            <h3 className="text-gray-400 text-sm font-medium mb-1">Active Projects</h3>
            <p className="text-white text-2xl font-bold">{getActiveProjects()}</p>
          </div>
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4">
            <h3 className="text-gray-400 text-sm font-medium mb-1">Total Budget</h3>
            <p className="text-white text-2xl font-bold">
              ${getTotalBudget().toLocaleString()}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4">
            <h3 className="text-gray-400 text-sm font-medium mb-1">Completed</h3>
            <p className="text-white text-2xl font-bold">{getStatusCount('completed')}</p>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Projects' },
              { key: 'planning', label: 'Planning' },
              { key: 'in-progress', label: 'In Progress' },
              { key: 'review', label: 'Review' },
              { key: 'completed', label: 'Completed' },
              { key: 'on-hold', label: 'On Hold' },
              { key: 'cancelled', label: 'Cancelled' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as unknown as 'all' | 'planning' | 'in-progress' | 'review' | 'completed' | 'on-hold' | 'cancelled')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === key
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {label} ({getStatusCount(key)})
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm bg-black">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'budget' | 'priority')}
              className="bg-black text-white border  rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option value="date">Date Created</option>
              <option value="name">Project Name</option>
              <option value="budget">Budget</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📋</span>
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">
              No projects found for the selected filter.
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;