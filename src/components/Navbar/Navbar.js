import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import { auth, db } from "../../firebase"
import { signOut } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';
import { AppAuthState } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
  const navigate = useNavigate();
  const { user } = AppAuthState();

  const handleLogout = async () => {
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      isOnline: false,
    })
    await signOut(auth);
    navigate("/login")
  };
  return (
    <nav className='nav'>
      <h3>
        <Link to="/">Messanger</Link>
      </h3>
      <div>
        { user ?
          <>
            <Link to="/profile">Profile</Link>
            <button className="btn" onClick={handleLogout}>Logout</button>
          </> :
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
          
        }
      </div>
    </nav>
  )
}

export default Navbar