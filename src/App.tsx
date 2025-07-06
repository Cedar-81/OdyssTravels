import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import Rides from './pages/Rides';
import Circles from './pages/Circles';
import CircleDetail from './pages/CircleDetail';
import RideDetail from './pages/RideDetail';
import CurateTrip from './pages/CurateTrip';
import CreateCircle from './pages/CreateCircle';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import PaymentSuccess from './pages/PaymentSuccess';
import { SearchProvider } from './contexts/SearchContext';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <SearchProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/rides" replace />} />
          <Route path="/rides" element={<Rides />} />
          <Route path="/rides/:id" element={<RideDetail />} />
          <Route path="/circles" element={<Circles />} />
          <Route path="/circle/:id" element={<CircleDetail />} />
          <Route path="/curate-trip" element={<CurateTrip />} />
          <Route path="/create-circle" element={<CreateCircle />} />
          <Route path="/login" element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </SearchProvider>
  );
}

export default App
