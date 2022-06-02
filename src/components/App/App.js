import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "../../pages/Home/Home"
import Navbar from '../Navbar/Navbar';
import Register from '../../pages/Register/Register';
import Login from '../../pages/Login/Login';
import AuthContext from '../../context/AuthContext';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import ErrorPage from '../../pages/ErrorPage/ErrorPage';
import Profile from '../../pages/Profile/Profile';

function App() {
  return (
    <AuthContext>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/" element={<PrivateRoute component={Home} />} />
          <Route exact path="/profile" element={<PrivateRoute component={Profile} />} />
          <Route exact path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </AuthContext>
    );
}

export default App;
