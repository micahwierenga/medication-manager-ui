import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getPatientById, toggleMedicationStatus } from '../api/patients';
import type { Patient, MedicationSchedule } from '../types/patient';
import ScheduleMedicationForm from '../components/ScheduleMedicationForm';

// This component fetches and displays details of a specific patient
export default function PatientDetails() {
  const queryClient = useQueryClient();
  const { id: patientId } = useParams<{ id: string }>();

  if (!patientId) {
    throw new Error('Patient ID is required');
  }

  // Fetch patient details using the patientId from the URL
  const { data, isLoading, error } = useQuery<Patient>({
    queryKey: ['patient', patientId],
    queryFn: () => getPatientById(patientId),
  });

  const handleToggleStatus = useMutation({
    mutationFn: (medicationId: string) => toggleMedicationStatus(medicationId),
    onSuccess: (updatedSchedule) => {
      // Update the cached patient data
      queryClient.setQueryData(['patient', patientId], (oldData: Patient | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          medicationSchedules: oldData.medicationSchedules?.map(schedule =>
            schedule.id === updatedSchedule.id
              ? updatedSchedule
              : schedule
          ),
        };
      });
      
    },
    onError: (error) => {
      console.error('Error toggling medication status here:', error);
    }
  });

  if (isLoading) {
    return <div>Loading patient details...</div>;
  }

  if (error) {
    return <div>Error loading patient details: {error.message}</div>;
  }

  const upcomingMedicationSchedules = data?.medicationSchedules?.filter(
    (schedule: MedicationSchedule) => new Date(schedule.date) >= new Date()
  ) || [];

  const pastMedicationSchedules = data?.medicationSchedules?.filter(
    (schedule: MedicationSchedule) => new Date(schedule.date) < new Date()
  ) || [];


  // Display patient details
  return (
    <div>
      <h2>Patient Details: {data?.firstName} {data?.lastName}</h2>
      <h3>Scheduled Medication</h3>
      <strong>Upcoming:</strong>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Medication</th>
            <th>Dosage</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {upcomingMedicationSchedules.length > 0 ? (
            upcomingMedicationSchedules.map((medication: MedicationSchedule) => (
              <tr key={medication.id}>
                <td>{new Date(medication.date).toLocaleDateString()}</td>
                <td>{medication.medicationName}</td>
                <td>{medication.dosage}</td>
                <td>{medication.completed ? 'Completed' : 'Pending'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>No upcoming medication schedules found for this patient.</td>
            </tr>
          )}
        </tbody>
      </table>

      <strong>Past:</strong>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Medication</th>
            <th>Dosage</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {pastMedicationSchedules.length > 0 ? (
            pastMedicationSchedules.map((medication: MedicationSchedule) => (
              <tr key={medication.id}>
                <td>{new Date(medication.date).toLocaleDateString()}</td>
                <td>{medication.medicationName}</td>
                <td>{medication.dosage}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={medication.completed}
                    onChange={() => {
                      // Handle toggle logic here if needed
                      if (!medication.id) return;
                      handleToggleStatus.mutate(medication.id);
                    }}
                  />  
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>No past medication schedules found for this patient.</td>
            </tr>
          )}
        </tbody>
      </table>
      

      <br />
      <ScheduleMedicationForm patientId={patientId} />
      <br />
      <a href="/">Back to Patient List</a>
    </div>
  );
}
