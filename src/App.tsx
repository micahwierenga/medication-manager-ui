import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PatientList from './pages/PatientList';
import PatientDetails from './pages/PatientDetails';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PatientList />} />
          <Route path="/patients/:id" element={<PatientDetails />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
