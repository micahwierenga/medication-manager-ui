export type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  medicationSchedules?: MedicationSchedule[];
};

export type MedicationSchedule = {
  id?: string;
  patientId: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  date: string;
  completed: boolean;
};

export type Medication = {
  id: string;
  name: string;
};