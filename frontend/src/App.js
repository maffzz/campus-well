import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import StudentDashboard from './pages/StudentDashboard';
import PsychologyPage from './pages/PsychologyPage';
import ActivityPage from './pages/ActivityPage';
import HabitsPage from './pages/HabitsPage';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/student/:studentId" element={<StudentDashboard />} />
            <Route path="/psychology/:studentId" element={<PsychologyPage />} />
            <Route path="/activity/:studentId" element={<ActivityPage />} />
            <Route path="/habits/:studentId" element={<HabitsPage />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </Layout>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
