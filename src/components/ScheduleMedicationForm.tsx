
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createMedicationSchedule, getMedications } from '../api/patients';
import type { Medication, MedicationSchedule } from '../types/patient';

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  gap: '1rem',
  alignItems: 'center',
  background: '#f5f7fa',
  padding: '1rem',
  borderRadius: '8px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  marginBottom: '1rem',
};

const selectStyle: React.CSSProperties = {
  padding: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #d0d7de',
  minWidth: '160px',
  background: '#fff',
  color: '#2c3e50',
  fontSize: '1rem',
  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
  outline: 'none',
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  cursor: 'pointer',
  transition: 'border-color 0.2s',
};

const inputStyle: React.CSSProperties = {
  padding: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #d0d7de',
  minWidth: '120px',
  background: '#fff',
  color: '#2c3e50',
  fontSize: '1rem',
  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
  outline: 'none',
  transition: 'border-color 0.2s',
};

const buttonStyle: React.CSSProperties = {
  padding: '0.5rem 1.2rem',
  borderRadius: '4px',
  border: 'none',
  background: '#1976d2',
  color: '#fff',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background 0.2s',
};

export default function ScheduleMedicationForm({ patientId }: { patientId: string }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<MedicationSchedule>();

  const { data } = useQuery<Medication[]>({
    queryKey: ['medications'],
    queryFn: () => getMedications(),
  });

  const mutation = useMutation({
    mutationFn: (data: MedicationSchedule) => createMedicationSchedule({ ...data as MedicationSchedule }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient', patientId] });
      reset();
    },
  });

  const onSubmit = (data: any) => {
    const newMedicationSchedule: MedicationSchedule = {
      ...data,
      medicationName: data.name,
      completed: false, // Default to not completed
    };

    mutation.mutate(newMedicationSchedule);
  };

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMedication = data?.find(med => med.id === event.target.value);
    if (selectedMedication) {
      reset({
        ...selectedMedication,
        patientId, // Ensure patientId is set correctly
      });
    }
  }

  return (
    <div>
      <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem', color: '#2c3e50' }}>
        Create New Scheduled Medication
      </div>
      <form onSubmit={handleSubmit(onSubmit)} style={formStyle}>
        <select {...register('medicationId')} required onChange={onChange} style={selectStyle}>
          <option value="">Select Medication</option>
          {data?.map((medication) => (
            <option key={medication.id} value={medication.id}>
              {medication.name}
            </option>
          ))}
        </select>
        <input {...register('dosage')} placeholder="Dosage" required style={inputStyle} />
        <input type="date" {...register('date')} required style={inputStyle} />
        <button type="submit" style={buttonStyle}>Add</button>
      </form>
    </div>
  );
}