import { z } from 'zod';

export const addProjectSchema = z.object({
  projectName: z
    .string()
    .min(3, 'Project name must be at least 3 characters')
    .max(100, 'Project name must not exceed 100 characters')
    .trim(),
  
  clientId: z
    .string()
    .min(1, 'Please select a client'),
  
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters')
    .trim(),
  
  projectType: z
    .enum(['web-development', 'mobile-app', 'design', 'consulting', 'marketing', 'other'], {
      errorMap: () => ({ message: 'Please select a valid project type' })
    }),
  
  status: z
    .enum(['planning', 'in-progress', 'review', 'completed', 'on-hold', 'cancelled'], {
      errorMap: () => ({ message: 'Please select a valid status' })
    }),
  
  priority: z
    .enum(['low', 'medium', 'high', 'urgent'], {
      errorMap: () => ({ message: 'Please select a valid priority level' })
    }),
  
  startDate: z
    .string()
    .min(1, 'Start date is required')
    .refine((date) => new Date(date) >= new Date(), {
      message: 'Start date cannot be in the past'
    }),
  
  endDate: z
    .string()
    .min(1, 'End date is required'),
  
  budget: z
    .string()
    .min(1, 'Budget is required')
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, 'Budget must be a valid positive number'),
  
  teamMembers: z
    .array(z.string())
    .min(1, 'At least one team member is required'),
  
  tags: z
    .array(z.string())
    .optional(),
  
  notes: z
    .string()
    .max(1000, 'Notes must not exceed 1000 characters')
    .optional()
}).refine((data) => {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  return endDate > startDate;
}, {
  message: 'End date must be after start date',
  path: ['endDate']
});

export type AddProjectFormData = z.infer<typeof addProjectSchema>;

export const projectTypeOptions = [
  { value: 'web-development', label: 'Web Development' },
  { value: 'mobile-app', label: 'Mobile App' },
  { value: 'design', label: 'Design' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'other', label: 'Other' }
];

export const statusOptions = [
  { value: 'planning', label: 'Planning' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'review', label: 'Under Review' },
  { value: 'completed', label: 'Completed' },
  { value: 'on-hold', label: 'On Hold' },
  { value: 'cancelled', label: 'Cancelled' }
];

export const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' }
];