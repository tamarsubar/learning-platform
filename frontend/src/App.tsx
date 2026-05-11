import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Signup from './pages/Signup';
import Categories from './pages/Categories';
import Subcategories from './pages/Subcategories';
import Chat from './pages/Chat';
import History from './pages/History';
import Admin from './pages/Admin';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:categoryId" element={<Subcategories />} />
          <Route path="/chat/:subId" element={<Chat />} />
          <Route path="/history" element={<History />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
