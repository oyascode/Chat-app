import React, { useState } from 'react';
import './Login.css';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { updateDoc, doc} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
    error: "",
    isLoading: false,
  });

  const navigate = useNavigate();

  const {email, password, error, isLoading} = data;

  const handleChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setData({...data, error: null, isLoading: true})
    if(!email || !password) {
      setData({
        ...data,
        error: "All fields are required"
      })
    }
    try {
      // Sign user in
      const result = await signInWithEmailAndPassword( 
        auth, 
        email, 
        password
      );
      // Update the user
        await updateDoc(doc(db, "users", result.user.uid), {
          isOnline: true,
        });
        setData({
          email: "",
          password: "",
          error: null,
          isLoading: false,
        });
        navigate("/")
    } catch(err) {
      setData({  
        ...data,
        error: err.message,
        isLoading: false,
      })
    }
  }
  return (
    <div className='login_wrap'>
      <h3>Log into your Account</h3>
      <form className='form' onSubmit={handleSubmit}>
        <div className="input_wrap">
          <label htmlFor="email">Email</label>
          <input 
            type="text" 
            name='email' 
            value={email} 
            onChange={handleChange} 
          />
        </div>
        <div className="input_wrap">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            name='password' 
            value={password} 
            onChange={handleChange}
          />
        </div>
        { error ?
          <p className="error">{error}</p> :
          null
        }
        <div className="btn_wrap">
          <button className="btn" disabled={isLoading}>
            {isLoading ? "Loging in ..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login