import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import ProjectDetail from './pages/ProjectDetail';
import EventDetail from './pages/EventDetail';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ContentManager from './pages/admin/ContentManager';
import SettingsManager from './pages/admin/SettingsManager';
import MessagesManager from './pages/admin/MessagesManager';
import SeoManager from './pages/admin/SeoManager';

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
    const scrollNow = () => {
      const el = document.getElementById(hash);
      if (!el) return false;
      const navH = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 0;
      const top = el.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
      return true;
    };
    if (!scrollNow()) {
      // Section may not be mounted yet (data still loading); retry until it appears.
      let tries = 0;
      const timer = setInterval(() => {
        tries += 1;
        if (scrollNow() || tries > 20) clearInterval(timer);
      }, 150);
      return () => clearInterval(timer);
    }
  }, [location.pathname, location.hash]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToHash />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/project/:slug" element={<ProjectDetail />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path=":resource" element={<ContentManager />} />
            <Route path="settings" element={<SettingsManager />} />
            <Route path="seo" element={<SeoManager />} />
            <Route path="messages" element={<MessagesManager />} />
          </Route>
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}