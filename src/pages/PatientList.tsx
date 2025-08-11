
import { useQuery } from '@tanstack/react-query';
import { getPatients } from '../api/patients';
import type { Patient } from '../types/patient';

const containerStyle: React.CSSProperties = {
  maxWidth: '600px',
  margin: '2rem auto',
  padding: '2rem',
  background: '#fff',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  fontFamily: 'system-ui, sans-serif',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const headingStyle: React.CSSProperties = {
  marginBottom: '1.5rem',
  color: '#2c3e50',
  fontWeight: 700,
  fontSize: '1.5rem',
};

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const listItemStyle: React.CSSProperties = {
  marginBottom: '0.75rem',
  padding: '0.75rem 1rem',
  borderRadius: '6px',
  background: '#f5f7fa',
  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
  transition: 'background 0.2s',
  width: '350px',
  textAlign: 'center',
  marginLeft: 'auto',
  marginRight: 'auto',
};

const linkStyle: React.CSSProperties = {
  color: '#1976d2',
  textDecoration: 'none',
  fontWeight: 500,
  fontSize: '1.1rem',
};

export default function PatientList() {
  const { data, isLoading, error } = useQuery<Patient[]>({ queryKey: ['patients'], queryFn: getPatients });

  if (isLoading) {
    return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading patients...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', marginTop: '2rem', color: '#c00' }}>Error loading patients: {error.message}</div>;
  }

  return (
    <div style={containerStyle}>
      <div style={headingStyle}>Patient List</div>
      <ul style={listStyle}>
        {data?.map((patient: Patient) => (
          <li key={patient.id} style={listItemStyle}>
            <a href={`/patients/${patient.id}`} style={linkStyle}>
              {patient.firstName} {patient.lastName}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}