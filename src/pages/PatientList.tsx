import { useQuery } from '@tanstack/react-query';
import { getPatients } from '../api/patients';
import type { Patient } from '../types/patient';

export default function PatientList() {
  const { data, isLoading, error } = useQuery<Patient[]>({ queryKey: ['patients'], queryFn: getPatients });

  if (isLoading) {
    return <div>Loading patients...</div>;
  }

  if (error) {
    return <div>Error loading patients: {error.message}</div>;
  }

  return (
    <ul>
      {data?.map((patient: Patient) => (
        <li key={patient.id}>
          <a href={`/patients/${patient.id}`}>
            {patient.firstName} {patient.lastName}
          </a>
        </li>
      ))}
    </ul>
  );
}