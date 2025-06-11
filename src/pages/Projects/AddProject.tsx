import { useState, useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import { ref, push, get } from 'firebase/database';
import { database } from '../../lib/services/firebase';
import { 
  addProjectSchema, 
  projectTypeOptions,
  statusOptions,
  priorityOptions
} from '../../lib/validations/addProject';

interface Client {
  id: string;
  fullName: string;
  company: string;
}

const AddProject = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [teamMembers, setTeamMembers] = useState<string[]>(['']);
  const [tags, setTags] = useState<string[]>(['']);

  // Fetch clients from Firebase
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsRef = ref(database, 'clients');
        const snapshot = await get(clientsRef);
        if (snapshot.exists()) {
          const clientsData = snapshot.val();
          const clientsList = Object.entries(clientsData).map(([id, client]: [string, any]) => ({
            id,
            fullName: client.fullName,
            company: client.company
          }));
          setClients(clientsList);
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    fetchClients();
  }, []);

  const projectForm = useForm({
    defaultValues: {
      projectName: '',
      clientId: '',
      description: '',
      projectType: 'web-development' as const,
      status: 'planning' as const,
      priority: 'medium' as const,
      startDate: '',
      endDate: '',
      budget: '',
      teamMembers: [''],
      tags: [],
      notes: ''
    },
    onSubmit: async ({ value }) => {
      try {
        // Filter out empty team members and tags
        const cleanValue = {
          ...value,
          teamMembers: teamMembers.filter(member => member.trim() !== ''),
          tags: tags.filter(tag => tag.trim() !== ''),
          budget: parseFloat(value.budget)
        };

        const validatedData = addProjectSchema.parse(cleanValue);
        
        const projectData = {
          ...validatedData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const projectsRef = ref(database, 'projects');
        const newProjectRef = await push(projectsRef, projectData);
        
        console.log('Project added successfully with ID:', newProjectRef.key);
        alert('Project added successfully!');
        
        // Reset form and arrays
        projectForm.reset();
        setTeamMembers(['']);
        setTags(['']);
      } catch (error) {
        console.error('Error adding project:', error);
        alert('Error adding project. Please try again.');
      }
    },
  });

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, '']);
  };

  const removeTeamMember = (index: number) => {
    if (teamMembers.length > 1) {
      setTeamMembers(teamMembers.filter((_, i) => i !== index));
    }
  };

  const updateTeamMember = (index: number, value: string) => {
    const updated = [...teamMembers];
    updated[index] = value;
    setTeamMembers(updated);
  };

  const addTag = () => {
    setTags([...tags, '']);
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const updateTag = (index: number, value: string) => {
    const updated = [...tags];
    updated[index] = value;
    setTags(updated);
  };

  return (
    <div className="bg-black text-white px-6 py-12">
      <div className="max-w-4xl mx-auto bg-white/10 border border-white/20 backdrop-blur rounded-xl p-8 shadow-xl">
        <h2 className="text-3xl font-bold mb-8 text-white">Add New Project</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            projectForm.handleSubmit();
          }}
          className="space-y-8"
        >
          {/* Basic Project Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <projectForm.Field 
              name="projectName"
              validators={{
                onChange: ({ value }) => {
                  const result = addProjectSchema.innerType().shape.projectName.safeParse(value);
                  return result.success ? undefined : result.error.errors[0]?.message;
                }
              }}
            >
              {(field) => (
                <div className="flex flex-col">
                  <label className="text-sm mb-2 text-white font-medium">
                    Project Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    className={`bg-black text-white border rounded-md px-4 py-3 focus:outline-none focus:ring-2 transition-colors ${
                      field.state.meta.errors && field.state.meta.errors.length > 0
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-white/30 focus:ring-white'
                    }`}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter project name"
                  />
                  {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                    <span className="text-red-400 text-xs mt-1">
                      {field.state.meta.errors[0]?.toString()}
                    </span>
                  )}
                </div>
              )}
            </projectForm.Field>

            <projectForm.Field 
              name="clientId"
              validators={{
                onChange: ({ value }) => {
                  const result = addProjectSchema.innerType().shape.clientId.safeParse(value);
                  return result.success ? undefined : result.error.errors[0]?.message;
                }
              }}
            >
              {(field) => (
                <div className="flex flex-col">
                  <label className="text-sm mb-2 text-white font-medium">
                    Client <span className="text-red-400">*</span>
                  </label>
                  <select
                    className={`bg-black text-white border rounded-md px-4 py-3 focus:outline-none focus:ring-2 transition-colors ${
                      field.state.meta.errors && field.state.meta.errors.length > 0
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-white/30 focus:ring-white'
                    }`}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  >
                    <option value="">Select a client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.fullName} - {client.company}
                      </option>
                    ))}
                  </select>
                  {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                    <span className="text-red-400 text-xs mt-1">
                      {field.state.meta.errors[0]?.toString()}
                    </span>
                  )}
                </div>
              )}
            </projectForm.Field>
          </div>

          {/* Project Description */}
          <projectForm.Field 
            name="description"
            validators={{
              onChange: ({ value }) => {
                const result = addProjectSchema.innerType().shape.description.safeParse(value);
                return result.success ? undefined : result.error.errors[0]?.message;
              }
            }}
          >
            {(field) => (
              <div className="flex flex-col">
                <label className="text-sm mb-2 text-white font-medium">
                  Project Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  className={`bg-black text-white border rounded-md px-4 py-3 h-24 resize-none focus:outline-none focus:ring-2 transition-colors ${
                    field.state.meta.errors && field.state.meta.errors.length > 0
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-white/30 focus:ring-white'
                  }`}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Describe the project scope and objectives"
                />
                {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                  <span className="text-red-400 text-xs mt-1">
                    {field.state.meta.errors[0]?.toString()}
                  </span>
                )}
              </div>
            )}
          </projectForm.Field>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <projectForm.Field name="projectType">
              {(field) => (
                <div className="flex flex-col">
                  <label className="text-sm mb-2 text-white font-medium">
                    Project Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    className="bg-black text-white border border-white/30 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value as any)}
                  >
                    {projectTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </projectForm.Field>

            <projectForm.Field name="status">
              {(field) => (
                <div className="flex flex-col">
                  <label className="text-sm mb-2 text-white font-medium">
                    Status <span className="text-red-400">*</span>
                  </label>
                  <select
                    className="bg-black text-white border border-white/30 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value as any)}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </projectForm.Field>

            <projectForm.Field name="priority">
              {(field) => (
                <div className="flex flex-col">
                  <label className="text-sm mb-2 text-white font-medium">
                    Priority <span className="text-red-400">*</span>
                  </label>
                  <select
                    className="bg-black text-white border border-white/30 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value as any)}
                  >
                    {priorityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </projectForm.Field>
          </div>

          {/* Dates and Budget */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <projectForm.Field 
              name="startDate"
              validators={{
                onChange: ({ value }) => {
                  const result = addProjectSchema.innerType().shape.startDate.safeParse(value);
                  return result.success ? undefined : result.error.errors[0]?.message;
                }
              }}
            >
              {(field) => (
                <div className="flex flex-col">
                  <label className="text-sm mb-2 text-white font-medium">
                    Start Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    className={`bg-black text-white border rounded-md px-4 py-3 focus:outline-none focus:ring-2 transition-colors ${
                      field.state.meta.errors && field.state.meta.errors.length > 0
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-white/30 focus:ring-white'
                    }`}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                    <span className="text-red-400 text-xs mt-1">
                      {field.state.meta.errors[0]?.toString()}
                    </span>
                  )}
                </div>
              )}
            </projectForm.Field>

            <projectForm.Field 
              name="endDate"
              validators={{
                onChange: ({ value }) => {
                  const result = addProjectSchema.innerType().shape.endDate.safeParse(value);
                  return result.success ? undefined : result.error.errors[0]?.message;
                }
              }}
            >
              {(field) => (
                <div className="flex flex-col">
                  <label className="text-sm mb-2 text-white font-medium">
                    End Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    className={`bg-black text-white border rounded-md px-4 py-3 focus:outline-none focus:ring-2 transition-colors ${
                      field.state.meta.errors && field.state.meta.errors.length > 0
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-white/30 focus:ring-white'
                    }`}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                    <span className="text-red-400 text-xs mt-1">
                      {field.state.meta.errors[0]?.toString()}
                    </span>
                  )}
                </div>
              )}
            </projectForm.Field>

            <projectForm.Field 
              name="budget"
              validators={{
                onChange: ({ value }) => {
                  const result = addProjectSchema.innerType().shape.budget.safeParse(value);
                  return result.success ? undefined : result.error.errors[0]?.message;
                }
              }}
            >
              {(field) => (
                <div className="flex flex-col">
                  <label className="text-sm mb-2 text-white font-medium">
                    Budget ($) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={`bg-black text-white border rounded-md px-4 py-3 focus:outline-none focus:ring-2 transition-colors ${
                      field.state.meta.errors && field.state.meta.errors.length > 0
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-white/30 focus:ring-white'
                    }`}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="0.00"
                  />
                  {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                    <span className="text-red-400 text-xs mt-1">
                      {field.state.meta.errors[0]?.toString()}
                    </span>
                  )}
                </div>
              )}
            </projectForm.Field>
          </div>

          {/* Team Members */}
          <div className="flex flex-col">
            <label className="text-sm mb-2 text-white font-medium">
              Team Members <span className="text-red-400">*</span>
            </label>
            <div className="space-y-2">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    className="flex-1 bg-black text-white border border-white/30 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
                    value={member}
                    onChange={(e) => updateTeamMember(index, e.target.value)}
                    placeholder="Enter team member name"
                  />
                  {teamMembers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTeamMember(index)}
                      className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTeamMember}
                className="px-4 py-2 bg-white/20 text-white rounded-md hover:bg-white/30 transition-colors w-fit"
              >
                + Add Team Member
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-col">
            <label className="text-sm mb-2 text-white font-medium">Tags (Optional)</label>
            <div className="space-y-2">
              {tags.map((tag, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    className="flex-1 bg-black text-white border border-white/30 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
                    value={tag}
                    onChange={(e) => updateTag(index, e.target.value)}
                    placeholder="Enter tag"
                  />
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-white/20 text-white rounded-md hover:bg-white/30 transition-colors w-fit"
              >
                + Add Tag
              </button>
            </div>
          </div>

          {/* Notes */}
          <projectForm.Field 
            name="notes"
            validators={{
              onChange: ({ value }) => {
                const result = addProjectSchema.innerType().shape.notes.safeParse(value);
                return result.success ? undefined : result.error.errors[0]?.message;
              }
            }}
          >
            {(field) => (
              <div className="flex flex-col">
                <label className="text-sm mb-2 text-white font-medium">Additional Notes</label>
                <textarea
                  className={`bg-black text-white border rounded-md px-4 py-3 h-24 resize-none focus:outline-none focus:ring-2 transition-colors ${
                    field.state.meta.errors && field.state.meta.errors.length > 0
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-white/30 focus:ring-white'
                  }`}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Any additional notes or requirements"
                />
                {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                  <span className="text-red-400 text-xs mt-1">
                    {field.state.meta.errors[0]?.toString()}
                  </span>
                )}
              </div>
            )}
          </projectForm.Field>

          {/* Submit Button */}
          <projectForm.Subscribe
            selector={(state) => state}
            children={(state) => (
              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={!state.canSubmit || state.isSubmitting}
                  className={`w-full py-4 px-6 rounded-md font-semibold text-lg transition-all duration-200 ${
                    !state.canSubmit || state.isSubmitting 
                      ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                      : 'bg-white text-black hover:bg-gray-200 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                  }`}
                >
                  {state.isSubmitting ? 'Creating Project...' : 'Create Project'}
                </button>
              </div>
            )}
          />
        </form>
      </div>
    </div>
  );
};

export default AddProject;