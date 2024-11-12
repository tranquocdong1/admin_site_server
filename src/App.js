import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminPage from './components/AdminPage';
import LoginPage from './components/LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
