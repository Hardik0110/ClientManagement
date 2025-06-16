import { useForm } from '@tanstack/react-form';
import { ref, push } from 'firebase/database';
import { database } from '../../lib/services/firebase'; 
import { addClientSchema, type AddClientFormData } from '../../lib/validations/addClient';

const AddClient = () => {
  const clientForm = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      notes: '',
    },
    onSubmit: async ({ value }) => {
      try {
        const validatedData = addClientSchema.parse(value);
        
        const clientData = {
          ...validatedData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const clientsRef = ref(database, 'clients');
        const newClientRef = await push(clientsRef, clientData);
        
        console.log('Client added successfully with ID:', newClientRef.key);
        alert('Client added successfully!');
        
        clientForm.reset();
      } catch (error) {
        console.error('Error adding client:', error);
        alert('Error adding client. Please try again.');
      }
    },
  });

  return (
    <div className="text-white px-6 py-12">
      <div className="max-w-3xl mx-auto bg-white/10 border border-white/20 backdrop-blur rounded-xl p-8 shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-white">Add New Client</h2>

        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              clientForm.handleSubmit();
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {([
              { name: 'fullName', label: 'Full Name', required: true },
              { name: 'email', label: 'Email', required: true },
              { name: 'phone', label: 'Phone', required: true },
              { name: 'company', label: 'Company', required: true },
              { name: 'address', label: 'Address', required: true },
              { name: 'city', label: 'City', required: true },
              { name: 'state', label: 'State', required: true },
              { name: 'zip', label: 'ZIP Code', required: true },
            ] as const).map(({ name, label, required }: { name: keyof AddClientFormData; label: string; required: boolean }) => (
              <clientForm.Field 
                name={name} 
                key={name}
                validators={{
                  onChange: ({ value }) => {
                    const result = addClientSchema.shape[name].safeParse(value);
                    return result.success ? undefined : result.error.errors[0]?.message;
                  }
                }}
              >
                {(field) => (
                  <div className="flex flex-col">
                    <label className="text-sm mb-1 text-white">
                      {label}
                      {required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    <input
                      className={`bg-black text-white border rounded-md px-4 py-2 focus:outline-none focus:ring-2 transition-colors ${
                        field.state.meta.errors && field.state.meta.errors.length > 0
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-white/30 focus:ring-white'
                      }`}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder={`Enter ${label.toLowerCase()}`}
                    />
                    {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                      <span className="text-red-400 text-xs mt-1">
                        {field.state.meta.errors[0]?.toString()}
                      </span>
                    )}
                  </div>
                )}
              </clientForm.Field>
            ))}

            <clientForm.Field 
              name="notes"
              validators={{
                onChange: ({ value }) => {
                  const result = addClientSchema.shape.notes.safeParse(value);
                  return result.success ? undefined : result.error.errors[0]?.message;
                }
              }}
            >
              {(field) => (
                <div className="col-span-2 flex flex-col">
                  <label className="text-sm mb-1 text-white">Notes</label>
                  <textarea
                    className={`bg-black text-white border rounded-md px-4 py-2 min-h-[100px] focus:outline-none focus:ring-2 transition-colors ${
                      field.state.meta.errors && field.state.meta.errors.length > 0
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-white/30 focus:ring-white'
                    }`}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter any additional notes about the client (optional)"
                  />
                  {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                    <span className="text-red-400 text-xs mt-1">
                      {field.state.meta.errors[0]?.toString()}
                    </span>
                  )}
                </div>
              )}
            </clientForm.Field>

            <clientForm.Subscribe
              selector={(state) => state}
              children={(state) => (
                <div className="col-span-2 space-y-4">
                  <button 
                    type="submit" 
                    disabled={!state.canSubmit || state.isSubmitting}
                    className={`w-full py-3 px-6 rounded-md font-semibold transition-all duration-200 ${
                      !state.canSubmit || state.isSubmitting 
                        ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                        : 'bg-white text-black hover:bg-gray-200 cursor-pointer shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {state.isSubmitting ? 'Adding Client...' : 'Add Client'}
                  </button>
                </div>
              )}
            />
          </form>
        </>
      </div>
    </div>
  );
};

export default AddClient;