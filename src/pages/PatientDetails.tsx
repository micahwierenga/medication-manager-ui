import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getPatientById, toggleMedicationStatus } from '../api/patients';
import type { Patient, MedicationSchedule } from '../types/patient';
import ScheduleMedicationForm from '../components/ScheduleMedicationForm';

const containerStyle: React.CSSProperties = {
  maxWidth: '800px',
  margin: '2rem auto',
  padding: '2rem',
  background: '#fff',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  fontFamily: 'system-ui, sans-serif',
};

const headingStyle: React.CSSProperties = {
  marginBottom: '1rem',
  color: '#2c3e50',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  marginBottom: '1.5rem',
  background: '#f9f9f9',
};

const thStyle: React.CSSProperties = {
  background: '#e3eafc',
  color: '#2c3e50',
  padding: '0.5rem',
  border: '1px solid #d0d7de',
};

const tdStyle: React.CSSProperties = {
  padding: '0.5rem',
  border: '1px solid #d0d7de',
  textAlign: 'center',
};

const sectionTitleStyle: React.CSSProperties = {
  margin: '1.5rem 0 0.5rem',
  color: '#3b5998',
  fontWeight: 600,
};

const backLinkStyle: React.CSSProperties = {
  display: 'inline-block',
  marginTop: '1.5rem',
  color: '#1976d2',
  textDecoration: 'none',
  fontWeight: 500,
};

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

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Patient Details: {data?.firstName} {data?.lastName}</h2>
      <h3 style={{ ...sectionTitleStyle, marginTop: 0 }}>Scheduled Medication</h3>
      <div style={{ marginBottom: '0.5rem', fontWeight: 500 }}>Upcoming:</div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Medication</th>
            <th style={thStyle}>Dosage</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>
        <tbody>
          {upcomingMedicationSchedules.length > 0 ? (
            upcomingMedicationSchedules.map((medication: MedicationSchedule) => (
              <tr key={medication.id}>
                <td style={tdStyle}>{new Date(medication.date).toLocaleDateString()}</td>
                <td style={tdStyle}>{medication.medicationName}</td>
                <td style={tdStyle}>{medication.dosage}</td>
                <td style={tdStyle}>
                  <input
                    type="checkbox"
                    checked={medication.completed}
                    onChange={() => {
                      if (!medication.id) return;
                      handleToggleStatus.mutate(medication.id);
                    }}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td style={tdStyle} colSpan={4}>No upcoming medication schedules found for this patient.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={{ marginBottom: '0.5rem', fontWeight: 500 }}>Past:</div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Medication</th>
            <th style={thStyle}>Dosage</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>
        <tbody>
          {pastMedicationSchedules.length > 0 ? (
            pastMedicationSchedules.map((medication: MedicationSchedule) => (
              <tr key={medication.id}>
                <td style={tdStyle}>{new Date(medication.date).toLocaleDateString()}</td>
                <td style={tdStyle}>{medication.medicationName}</td>
                <td style={tdStyle}>{medication.dosage}</td>
                <td style={tdStyle}>
                  <input
                    type="checkbox"
                    checked={medication.completed}
                    onChange={() => {
                      if (!medication.id) return;
                      handleToggleStatus.mutate(medication.id);
                    }}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td style={tdStyle} colSpan={4}>No past medication schedules found for this patient.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={{ margin: '1.5rem 0' }}>
        <ScheduleMedicationForm patientId={patientId} />
      </div>
      <a href="/" style={backLinkStyle}>Back to Patient List</a>
    </div>
  );
}
