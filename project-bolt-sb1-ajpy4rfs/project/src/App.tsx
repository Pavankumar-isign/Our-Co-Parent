import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Calendar from './components/calendar/Calendar';
import MessageLayout from './components/messages/MessageLayout';
import ExpensesLayout from './components/expenses/ExpensesLayout';
import InfoBankLayout from './components/info-bank/InfoBankLayout';
import AccountLayout from './components/account/AccountLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/shared/PrivateRoute';


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/calendar" element={<Calendar />} />
        <Route path="/messages" element={<MessageLayout />} />
        <Route path="/expenses" element={<ExpensesLayout />} />
        <Route path="/info-bank" element={<InfoBankLayout />} />
        <Route path="/account" element={<AccountLayout />} /> 

        {/* Protected Routes */}
        {/* <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/calendar" element={<PrivateRoute><Calendar /></PrivateRoute>} />
        <Route path="/messages" element={<PrivateRoute><MessageLayout /></PrivateRoute>} />
        <Route path="/expenses" element={<PrivateRoute><ExpensesLayout /></PrivateRoute>} />
        <Route path="/info-bank" element={<PrivateRoute><InfoBankLayout /></PrivateRoute>} />
        <Route path="/account" element={<PrivateRoute><AccountLayout /></PrivateRoute>} />  */}
      </Routes>
    </Router>
  );
}

export default App;