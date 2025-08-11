import type { Patient, MedicationSchedule, Medication } from '../types/patient';

const BASE_URL = 'https://fn2kuyafkvw4oxgrklgy5hk5ci0lnhrj.lambda-url.us-west-2.on.aws';
const API_KEY = '';

const requestHeaders = {
  'Content-Type': 'application/json',
  'x-api-key': API_KEY,
};

export async function getPatients(): Promise<Patient[]> {
  const response = await fetch(`${BASE_URL}/patients`, {
    headers: requestHeaders,
  });
  if (!response.ok) {
    throw new Error(`Error fetching patients: ${response.statusText}`);
  }

  const data = await response.json();
  if (!Array.isArray(data.patients)) {
    throw new Error('Unexpected response format: expected an array of patients');
  }
  return data.patients as Patient[];
}

export async function getPatientById(id: string): Promise<Patient> {
  const response = await fetch(`${BASE_URL}/patients/${id}`, {
    headers: requestHeaders,
  });
  if (!response.ok) {
    throw new Error(`Error fetching patient with ID ${id}: ${response.statusText}`);
  }

  const data = await response.json();
  if (!data || !data.id) {
    throw new Error(`Patient with ID ${id} not found`);
  }
  return data as Patient;
}

export async function getMedications(): Promise<Medication[]> {
  const response = await fetch(`${BASE_URL}/medications`, {
    headers: requestHeaders,
  });
  if (!response.ok) {
    throw new Error(`Error fetching medications: ${response.statusText}`);
  }
  const data = await response.json();
  if (!Array.isArray(data.medications)) {
    throw new Error('Unexpected response format: expected an array of medications');
  }
  return data.medications as Medication[];
}

export async function createMedicationSchedule(medicationSchedule: MedicationSchedule): Promise<MedicationSchedule> {
  const response = await fetch(`${BASE_URL}/medicationSchedules`, {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify(medicationSchedule),
  });

  if (!response.ok) {
    throw new Error(`Error creating scheduled medication: ${response.statusText}`);
  }

  const data = await response.json();
  if (!data || !data.id) {
    throw new Error('Unexpected response format: expected a created scheduled medication with an ID');
  }
  return data as MedicationSchedule;
}

export async function toggleMedicationStatus(medicationScheduleId: string) {
  const response = await fetch(`${BASE_URL}/medicationSchedules/${medicationScheduleId}`, {
    method: 'PUT',
    headers: requestHeaders,
  });

  if (!response.ok) {
    throw new Error(`Error toggling medication status: ${response.statusText}`);
  }

  const data = await response.json();

  return data as MedicationSchedule;
}