import { Route, Routes } from 'react-router';
import RepoInfoPage from './pages/RepoInfoPage';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<RepoInfoPage />} />
        <Route path="/home" element={<HomePage />} />
      </Route>
    </Routes>
  );
}
