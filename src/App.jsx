import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './commponents/SingIn';
import Homepage from './commponents/Homepage';
import SignUp from './commponents/SingUp';
import ProtectedRoute from './commponents/ProutectRoute';
import Dashboard from './commponents/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import YourProfile from './commponents/YourProfile';

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
                <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <YourProfile />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;