import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PeopleList from './components/PeopleList';
import PersonDetails from './components/PersonDetails';
import PersonForm from './components/PersonForm';
import AddRelation from './components/AddRelation';
import Login from './components/Login';
import SignUp from './components/SignUp';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={
              <PrivateRoute>
                <PeopleList />
              </PrivateRoute>
            } />
            <Route path="/person/:id" element={
              <PrivateRoute>
                <PersonDetails />
              </PrivateRoute>
            } />
            <Route path="/person/new" element={
              <PrivateRoute>
                <PersonForm />
              </PrivateRoute>
            } />
            <Route path="/person/edit/:id" element={
              <PrivateRoute>
                <PersonForm />
              </PrivateRoute>
            } />
            <Route path="/relation/new/:personId" element={
              <PrivateRoute>
                <AddRelation />
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}