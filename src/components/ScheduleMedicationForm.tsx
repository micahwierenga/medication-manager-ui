import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createMedicationSchedule, getMedications } from '../api/patients';
import type { Medication, MedicationSchedule } from '../types/patient';

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <select {...register('medicationId')} required onChange={onChange}>
        <option value="">Select Medication</option>
        {data?.map((medication) => (
          <option key={medication.id} value={medication.id}>
            {medication.name}
          </option>
        ))}
      </select>
      <input {...register('dosage')} placeholder="Dosage" required />
      <input type="date" {...register('date')} required />
      <button type="submit">Add Scheduled Medication</button>
    </form>
  );
}