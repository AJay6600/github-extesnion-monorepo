import { Route, Routes } from 'react-router';
import RepoInfoPage from './pages/RepoInfoPage';
import AppLayout from './components/AppLayout';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RepoInfoPage />} />
      <Route path="/home" element={<AppLayout />} />
    </Routes>
  );
}
